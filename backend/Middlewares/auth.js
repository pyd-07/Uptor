const jwt = require("jsonwebtoken")
const { User } = require("../Models/User")

const SECRET = process.env.SECRET

async function auth(req, res, next) {
    let token = null

    if (req.cookies && req.cookies.auth_token) {
        token = req.cookies.auth_token
    }

    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ")
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1]
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" })
    }

    try {
        const payload = jwt.verify(token, SECRET)

        const user = await User.findById(payload.userId)

        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        req.user_id = user._id.toString()
        req.org_id = user.organizationId.toString()
        req.role = user.role

        next()
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })
    }
}

module.exports = { auth }
