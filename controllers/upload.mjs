import Error from "../utils/errorManagement.mjs"
import vars from "../variables/vars.mjs"
import fs from "fs"
import csvParser from "csv-parser"
import surveyResults from "../model/surey_result.mjs";

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

async function readCsvFile(path) {
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
                    dataRow.push(row)
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

const fileUpload = async (req, res) => {
    const { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } = vars.STATUS_CODE
    try {
        const csvFile = req.file
        if (!csvFile) {
            throw Error(vars.MESSAGES.UPLOAD_FILE, BAD_REQUEST)
        }
        const { dataRow, validationErrors } = await readCsvFile(csvFile.path)
        if (validationErrors.length > 0) {
            throw Error(vars.MESSAGES.REQUIRED_FIELDS_MISSING, BAD_REQUEST, validationErrors)
        }
        surveyResults.bulkCreate(dataRow)
            .then(() => {
                if (fs.existsSync(csvFile.path)) {
                    // Delete the file
                    fs.unlinkSync(csvFile.path)
                }
                res.status(SUCCESS).json({
                    status: SUCCESS,
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            })
            .catch((error) => {
                res.status(INTERNAL_SERVER_ERROR).send({
                    status: INTERNAL_SERVER_ERROR,
                    message: "Fail to import data into database!",
                    error: error.message,
                });
            })
    } catch (err) {
        return res.status(err.code || INTERNAL_SERVER_ERROR).json({ status: err.code || INTERNAL_SERVER_ERROR, message: err.message, err: err })
    }
}

export default fileUpload