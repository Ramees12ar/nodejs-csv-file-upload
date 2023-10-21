const vars = {
    STATUS_CODE: {
        BAD_REQUEST: 400,
        SUCCESS: 200,
        NOT_FOUND: 404,
        UNAUTHORIZED: 401,
        NO_CONTENT: 204,
        FORBIDDEN: 403,
        METHOD_FAILURE: 420,
        INTERNAL_SERVER_ERROR: 500
    },
    MESSAGES: {
        SUCCESS: "success",
        VALID_TOKEN: "please pass valid token",
        UNAUTHORIZED: "Unauthorized",
        UPLOAD_FILE: "Please upload a CSV file!",
        REQUIRED_FIELDS_MISSING: "Required field missing the file.",
        FILE_UPLOADED: "file successfully uploaded",
        DATA_NOT_EXIST: "data not exist",
        FIELD_MISSING:"required field #FIELD# missing",
    },
    temp_path: ".tmp/",
};

export default vars
