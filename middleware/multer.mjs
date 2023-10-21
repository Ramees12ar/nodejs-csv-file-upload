import crypto from "crypto"
import multer from "multer"
import fs from "fs"
import path from "path"
import vars from "../variables/vars.mjs";
import Error from "../utils/errorManagement.mjs";

// storage options for multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = vars.temp_path
        if (!fs.existsSync(uploadDir)) {
            // Create the directory if it doesn't exist
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        // the directory to save the uploaded csv files
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const extname = path.extname(file.originalname);
        if (extname.toLowerCase() === '.csv') {
            // Generate a unique name for the uploaded CSV file
            cb(null, `${crypto.randomBytes(5).toString('hex')}-${Date.now()}${extname}`);
        } else {
            cb(Error('File is not a CSV', vars.STATUS_CODE.BAD_REQUEST), null);
        }
    },
});

// Create the multer middleware
const upload = multer({
    storage,
});

export default upload;