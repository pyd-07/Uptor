const express = require('express');
const router = express.Router();
const {User} = require('../../Models/User');
const {Organization} = require('../../Models/Organization');
const {auth} = require('../../Middlewares/auth');

router.get('/me', auth, async (req, res) => {
    const user = await User.findOne({ email: req.user_id })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }
    if (user.role !== "owner") {
        return res.status(403).json({
            message: "Only organization owners can view this"
        })
    }
    const org = await Organization.findById(user.organizationId)
    if (!org) {
        return res.status(404).json({ message: "Organization not found" })
    }
    return res.status(200).json(org)
})

module.exports = router