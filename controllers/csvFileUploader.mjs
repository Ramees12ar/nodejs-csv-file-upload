import Error from "../utils/errorManagement.mjs"
import vars from "../variables/vars.mjs"
import imports from "../model/import.mjs";
import csvUploadQueue from "../services/queue.mjs";
import surveyResults from "../model/surey_result.mjs";

export const fileUpload = async (req, res) => {
    const { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS } = vars.STATUS_CODE
    try {
        const csvFile = req.file
        if (!csvFile) {
            throw Error(vars.MESSAGES.UPLOAD_FILE, BAD_REQUEST)
        }
        console.log(csvFile.filename, csvFile.path)
        const data = await imports.create({ name: csvFile.filename })
        await csvUploadQueue.add({ id: data.id })
        res.status(SUCCESS).json({ success: SUCCESS, message: vars.MESSAGES.FILE_UPLOADED, data })
    } catch (err) {
        return res.status(err.code || INTERNAL_SERVER_ERROR).json({ status: err.code || INTERNAL_SERVER_ERROR, message: err.message, err: err })
    }
}

export const getFileStatus = async (req, res) => {
    const { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS, NOT_FOUND } = vars.STATUS_CODE
    try {
        const { importId = "" } = req.query
        if (!importId) {
            throw Error(vars.MESSAGES.FIELD_MISSING.replace("#FIELD#", "importId"), BAD_REQUEST)
        }
        const response = await imports.findOne({ where: { id: importId } })
        if (!response) {
            throw Error(vars.MESSAGES.DATA_NOT_EXIST, NOT_FOUND)
        }
        res.status(SUCCESS).json({ success: SUCCESS, message: vars.MESSAGES.SUCCESS, data: response })
    } catch (err) {
        return res.status(err.code || INTERNAL_SERVER_ERROR).json({ status: err.code || INTERNAL_SERVER_ERROR, message: err.message, err: err })
    }
}

export const getSurveyData = async (req, res) => {
    const { BAD_REQUEST, INTERNAL_SERVER_ERROR, SUCCESS, NOT_FOUND } = vars.STATUS_CODE
    try {
        console.log(req.query, req.params)
        const { page = 0, limit = 20 } = req.query
        const { importId = "" } = req.params
        if (!importId) {
            throw Error(vars.MESSAGES.FIELD_MISSING.replace("#FIELD#", "importId"), BAD_REQUEST)
        }
        const results = await surveyResults.findAndCountAll({
            where: { import_id: importId },
            limit: limit,
            offset: page * limit,
        });
        res.status(SUCCESS).json({ success: SUCCESS, message: vars.MESSAGES.SUCCESS, data: { count: results.count, data: results.rows } })
    } catch (err) {
        return res.status(err.code || INTERNAL_SERVER_ERROR).json({ status: err.code || INTERNAL_SERVER_ERROR, message: err.message, err: err })
    }
}