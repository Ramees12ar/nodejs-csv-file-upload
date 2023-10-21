import express from "express"
import { fileUpload, getFileStatus, getSurveyData } from "../controllers/csvFileUploader.mjs"
import upload from "../middleware/multer.mjs";
import login from "../controllers/auth.mjs";
import { isAuthenticated } from "../middleware/authentication.mjs";

const apiRouter = express.Router()

apiRouter.post("/login", login)
apiRouter.post("/upload", isAuthenticated, upload.single("file"), fileUpload)
apiRouter.get("/status", isAuthenticated, getFileStatus)
apiRouter.get("/:importId/data", isAuthenticated, getSurveyData)

export default apiRouter;