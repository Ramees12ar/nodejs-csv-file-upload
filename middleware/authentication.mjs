import jwt from "jsonwebtoken"
import config from "config"
import Error from "../utils/errorManagement.mjs"
import vars from "../variables/vars.mjs"

export const getToken = async (data) => {
    try {
        const accessToken = jwt.sign(data, config.secretKey, { expiresIn: "7d" })
        console.log(accessToken)
        return accessToken
    } catch (err) {
        throw new Error((err.message) ? err.message : err, err.code)
    }
}

export const isAuthenticated = async (req, res, next) => {
    try {
        const accessToken = req.headers.accesstoken
        if (!accessToken) {
            throw Error(vars.MESSAGES.VALID_TOKEN, vars.STATUS_CODE.BAD_REQUEST)
        }
        jwt.verify(accessToken, config.secretKey, async (error, decode) => {
            try {
                if (error) {
                    throw Error(vars.MESSAGES.UNAUTHORIZED, vars.STATUS_CODE.UNAUTHORIZED)
                } else {
                    req.isSuperAdmin = decode.superAdmin
                    next()
                }
                return true
            } catch (err) {
                return res.status(err.code || vars.STATUS_CODE.BAD_REQUEST).json(
                    { status: err.code || vars.STATUS_CODE.BAD_REQUEST, message: (err.message) ? err.message : message, },
                )
            }
        });
        return true
    } catch (err) {
        return res.status(err.code || vars.STATUS_CODE.BAD_REQUEST).json(
            { status: err.code || vars.STATUS_CODE.BAD_REQUEST, message: (err.message) ? err.message : message, },
        )
    }
}