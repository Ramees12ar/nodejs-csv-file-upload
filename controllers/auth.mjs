import config from "config"
import crypto from "crypto"
import vars from "../variables/vars.mjs"
import Error from "../utils/errorManagement.mjs"
import { getToken } from "../middleware/authentication.mjs"
const login = async (req, res) => {
    const { BAD_REQUEST, SUCCESS, NOT_FOUND } = vars.STATUS_CODE
    try {
        const { username, password } = req.body
        const { username: user, password: pass } = config;
        if (username === user && password === pass) {
            const randomString = crypto.randomBytes(10).toString('hex')
            const accessToken = await getToken({ id: randomString, superAdmin: true })
            return res.status(SUCCESS).json({ status: SUCCESS, message: "login success", accessToken })
        } else {
            throw Error("invalid credentials", BAD_REQUEST)
        }
    } catch (err) {
        return res.status(err.code || BAD_REQUEST).json({ status: err.code || BAD_REQUEST, message: err.message, err: err })
    }
}

export default login;