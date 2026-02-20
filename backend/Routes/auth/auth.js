const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");

const {User} = require('../../Models/User')
const {Organization} = require('../../Models/Organization');
const {auth} = require('../../Middlewares/auth')

const SECRET = process.env.SECRET


const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 100,
    message:"Too many attempts. Please try again later"
})


router.post("/login", authLimiter, async (req, res) => {
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
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ message: "Login successful" })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
})


router.post('/register', authLimiter, async (req, res) => {
    const {name, email, password, org_name, org_mail} = req.body

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
        let user
        if (org_exists) {
            user = new User({
                name:name,
                email:email,
                password_hash:hashedPass,
                role:"Member",
                organizationId:org_exists._id
            }) 
            await user.save()
        }else{
            const org = new Organization({
                name:org_name,
                mail: org_mail
            })
            await org.save()
            user = new User({
                name:name,
                email:email,
                password_hash:hashedPass,
                role:"Owner",
                organizationId:org._id
            }) 
            await user.save()
        }
        const token = jwt.sign(
            {
                userId: user._id,
                orgId: user.organizationId,
                role: user.role
            },
            SECRET,
            { expiresIn: "7d" }
            )

            res.cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(201).json({
            message: "Registration Successful"
            })

    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

router.get('/me', auth, async(req, res)=>{

    try{
        const organisation = await Organization.findById(req.org_id)
        const user = await User.findById(req.user_id)
        res.json({
            user:{
                name: user.name,
                org_name: organisation.name,
                role: req.role
            }
        })
    } catch {
        res.status(404).json({
            user: {
                name: req.user_id,
                org_name: "err not found",
                role: req.role
            }
        })
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie("auth_token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    return res.status(200).json({ message: "Logged out" })
})



module.exports = router
