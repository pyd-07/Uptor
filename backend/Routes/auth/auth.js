const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../Models/User')
const {Organization} = require('../../Models/Organization');
const SECRET = process.env.SECRET

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    if (!email || !password) {
        return res.status(400).json({
            message:"Insufficient Information"
        })
    }

    try {
        const found = await User.findOne({email:email})
        if (!found) {
            return res.status(400).json({
                message:"No User Found"
            })
        }
        const hashedPass = found.password_hash
        const isMatch = await bcrypt.compare(password, hashedPass)
        if(!isMatch){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }
        req.user_id = email
        const org_id = found.organizationId
        req.org_id = org_id
        const token = jwt.sign({email, hashedPass}, SECRET)
        return res.status(201).json({
            message:"Login Successful",
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

router.post('/register', async (req, res) => {
    const {email, password, org_name, org_mail} = req.body

    if (!email || !password || !org_name){
        return res.status(400).json({
            message: "Insufficient Information."
        })
    }

    try {
        const user_exists = await User.findOne({email:email})
        if (user_exists) {
            return res.status(409).json({
                message: "User already exists"
            })
        }
        const hashedPass = await bcrypt.hash(password,10)
        const org_exists = await Organization.findOne({name:org_name, mail:org_mail})
        if (org_exists) {
            const user = new User({
                email:email,
                password_hash:hashedPass,
                role:"user",
                organizationId:org_exists._id
            }) 
            await user.save()
        }else{
            const org = new Organization({
                name:org_name,
                mail: org_mail
            })
            await org.save()
            const user = new User({
                email:email,
                password_hash:hashedPass,
                role:"owner",
                organizationId:org._id
            }) 
            await user.save()
        }
        const token = jwt.sign({email, hashedPass}, SECRET)
        return res.status(201).json({
            message:"Registration Successful",
            token:token
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})


module.exports = router