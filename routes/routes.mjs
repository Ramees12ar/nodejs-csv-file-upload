import express from "express"
import fileUpload from "../controllers/upload.mjs"
import upload from "../middleware/multer.mjs";
import login from "../controllers/auth.mjs";
import { isAuthenticated } from "../middleware/authentication.mjs";

const apiRouter = express.Router()

apiRouter.post("/login", login)
apiRouter.post("/upload", isAuthenticated, upload.single("file"), fileUpload)

export default apiRouter;