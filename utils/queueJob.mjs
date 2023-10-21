import imports from "../model/import.mjs"
import vars from "../variables/vars.mjs"
import fs from "fs"
import csvParser from "csv-parser"
import surveyResults from "../model/surey_result.mjs";
import Error from "./errorManagement.mjs";

/**
 * @function validateRequiredFields - validating required fields
 * @param {*} row 
 * @returns 
 */
function validateRequiredFields(row) {
    const requiredFields = ["year", "industry_code", "industry_name", "size_group", "variable", "value", "unit"]; // Define your required fields here
    const missingFields = []
    for (const field of requiredFields) {
        if (!row[field]) {
            missingFields.push(field)
        }
    }
    if (missingFields.length > 0) {
        return { isValid: false, missingFields }
    }
    return { isValid: true }; // All required fields are present
}

async function readCsvFile(path, importId) {
    return new Promise((resolve, reject) => {
        const validationErrors = [];
        const dataRow = []
        let rowLine = 1
        fs.createReadStream(path)
            .pipe(csvParser())
            .on("error", (error) => {
                throw Error(error.message, vars.STATUS_CODE.METHOD_FAILURE)
            })
            .on("data", (row) => {
                // Perform required field validation
                const { isValid = false, missingFields = [] } = validateRequiredFields(row);
                if (isValid) {
                    dataRow.push({ ...row, import_id: importId })
                } else {
                    validationErrors.push(`Validation Error: Required field(s) ${missingFields.join(",")} missing in the ${rowLine} row.`)
                }
                rowLine++
            })
            .on("end", () => {
                resolve({ dataRow, validationErrors });
            });
    })
}

async function dbUpdate(model, condition, update) {
    try {
        await model.update(update, { where: condition })
    } catch (err) {
        throw err
    }
}

const queueJob = async (job) => {
    const { BAD_REQUEST } = vars.STATUS_CODE
    const importId = job.data.id
    try {
        const importData = await imports.findOne({ where: { id: importId }, attributes: ['name'] })
        if (!importData) {
            await dbUpdate(imports, { id: importId }, { status: "failed", error_status: true, error_message: vars.MESSAGES.DATA_NOT_EXIST })
            throw Error(vars.MESSAGES.DATA_NOT_EXIST, BAD_REQUEST)
        }
        await dbUpdate(imports, { id: importId }, { status: "pending" })
        const path = vars.temp_path + importData.name
        const { dataRow, validationErrors } = await readCsvFile(path, importId)
        if (validationErrors.length > 0) {
            throw Error(vars.MESSAGES.REQUIRED_FIELDS_MISSING, BAD_REQUEST, validationErrors)
        }
        surveyResults.bulkCreate(dataRow)
            .then(() => {
                if (fs.existsSync(path)) {
                    // Delete the file
                    fs.unlinkSync(path)
                }
                dbUpdate(imports, { id: importId }, { status: "completed" })
            })
            .catch((error) => {
                dbUpdate(imports, { id: importId }, { status: "failed", error_status: true, error_message: JSON.stringify(error) })
            })
        return true;
    } catch (err) {
        imports.update(
            { status: "failed", error_status: true, error_message: JSON.stringify(err) },
            { where: { id: importId } }
        )
        return err;
    }
}
export default queueJob;