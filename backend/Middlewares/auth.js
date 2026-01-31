const jwt = require('jsonwebtoken');
const {User} = require('../Models/User');
const SECRET = process.env.SECRET

async function auth(req, res, next) {
    const raw = req.headers.authorization
    const token = raw.split(' ')[0]=="Bearer"?raw.split(' ')[1]:raw
    if (!token) {
        return res.status(401).json({ message: "Authorization token required" })
    }
    try {
        const isValid = jwt.verify(token, SECRET)
        const email = isValid.email
        const hashedPass = isValid.hashedPass
        const found = await User.findOne({email:email, password_hash:hashedPass})
        if(found){
            req.user_id = email
            req.org_id = found.organizationId.toString()
            next()
        }else{
            throw new Error('Can not find the user')
        }
    } catch (error) {
        return res.status(400).json({
            message:"Bad Credentials. Login Again",
            error:error.message
        })
    }
}

module.exports = {auth}