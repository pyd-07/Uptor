const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../Models/User')
const {Organization} = require('../../Models/Organization');
const {auth} = require('../../Middlewares/auth')
const SECRET = process.env.SECRET

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ message: "Insufficient Information" })
    }

    try {
        const found = await User.findOne({ email })
        if (!found) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, found.password_hash)
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        const token = jwt.sign(
            {
                userId: found._id,
                orgId: found.organizationId,
                role: found.role
            },
            SECRET,
            { expiresIn: "7d" }
        )

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
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
        if (!org_mail) {
            return res.status(400).json({ error: "Organization mail required" })
        }
        const hashedPass = await bcrypt.hash(password,10)
        const org_exists = await Organization.findOne({mail:org_mail})
        if (org_exists) {
            const user = new User({
                email:email,
                password_hash:hashedPass,
                role:"member",
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

router.get('/me', auth, (req, res)=>{
    res.json({
        user:{
            id: req.user_id,
            orgId: req.org_id,
            role: req.role
        }
    })
})


module.exports = router
