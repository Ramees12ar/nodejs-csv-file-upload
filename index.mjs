import express from "express"
import cors from "cors"
import config from "config";
import bodyParser from "body-parser"
import apiRouter from "./routes/routes.mjs";

const app = express()
app.use(cors({
    origin: "*",
    allowedHeaders: "X-Requested-With, authorization, Content-Type, Accept, Cache-Control, DNT, If-Modified-Since, Keep-Alive, Origin, User-Agent",
    methods: "GET,POST",
    preflightContinue: false,
    maxAge: 36000,
    credentials: true,
}))

const { port } = config;
console.log(port)
const processApplication = async () => {
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use("/api", apiRouter)
    app.use((err, req, res, next) => {
        if(err){
            return res.status(err.code).json({ error: err.message, status: err.code, err });
        }
        next(); // Pass control to the next middleware if no error occurred
    });
    process.on("unhandledRejection", (reason, p) => console.error("Unhandled Rejection at: Promise ", p, reason));
    app.listen(port, () => {
        console.log(`App Started on port :: ${port} ${config.apiUrl}`);
    });
};

processApplication().then();

export default app;