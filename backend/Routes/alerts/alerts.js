const express = require('express');
const router = express.Router();
const { auth } = require('../../Middlewares/auth');
const { Alert } = require('../../Models/Alert');
const { Monitor } = require('../../Models/Monitor');

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id
    const org_id = req.org_id
    let limit = parseInt(req.query.limit)
    if (!limit || limit < 1 || limit > 100) limit = 20
    try {
        const monitor = await Monitor.findById(id)
        if (!monitor || monitor.organizationId.toString() !== org_id) {
            return res.status(404).json({ message: "Monitor not found" })
        }
        const alerts = await Alert.find({ monitorId: id })
            .sort({sent_at: -1})
            .limit(limit)
            .select("type sent_via sent_at");
        return res.status(200).json(alerts)
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
})

module.exports = router