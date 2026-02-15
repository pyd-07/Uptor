const express = require('express');
const router = express.Router();
const { auth } = require('../../Middlewares/auth');
const { Alert } = require('../../Models/Alert');
const { Monitor } = require('../../Models/Monitor');

router.get('/', auth, async (req, res) => {
    const org_id = req.org_id;
    let limit = parseInt(req.query.limit, 10);
    if (!limit || limit < 1 || limit > 100) limit = 20;

    try {
        const monitors = await Monitor.find({ organizationId: org_id })
            .select("_id")
            .lean();

        if (monitors.length === 0) {
            return res.status(200).json([]);
        }

        const monitorIds = monitors.map((monitor) => monitor._id);

        const alerts = await Alert.find({ monitorId: { $in: monitorIds } })
            .populate("monitorId", "name url")
            .sort({ sent_at: -1 })
            .limit(limit);

        return res.status(200).json(alerts);
    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
