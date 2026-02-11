const express = require('express')
const router = express.Router()
const {auth} = require('../../Middlewares/auth')
const {Organization} = require('../../Models/Organization')

router.get('/status', auth, async (req, res) => {
    const org_id = req.org_id
    try {
        const org = await Organization.findById(org_id)
            .select("name plan monitor_limit used_monitors can_create_monitor")
        return res.status(200).json(org)
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
})

module.exports = router