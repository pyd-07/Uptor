const express = require('express');
const router = express.Router();
const {auth} = require('../../Middlewares/auth')
const {Monitor} = require('../../Models/Monitor');
const {MonitorCheck} = require('../../Models/MonitorCheck')
const {Organization} = require('../../Models/Organization')

router.post('/',auth, async (req, res) => {
    const {name, url, interval_sec, timeout_ms} = req.body
    if(!name || !url){
        return res.status(400).json({
            message:"Insufficient Information"
        })
    }
    try {
        const organization = await Organization.findById(req.org_id)
        if(organization.used_monitors >= organization.monitor_limit){
            return res.status(403).json({
                message: "Monitor limit is reached already! Upgrade required."
            })
        }
        const intervalSec = interval_sec || 300
        const monitor = new Monitor({
            organizationId: req.org_id,
            name,
            url,
            interval_sec: intervalSec,
            timeout_ms: timeout_ms || 5000,
            next_check_at: new Date()
        })
        await monitor.save()
        const updatedOrg = await Organization.findByIdAndUpdate(req.org_id, {
            $inc: { used_monitors: 1 }
        }, { new: true })
        await Organization.findByIdAndUpdate(req.org_id, {
            can_create_monitor: updatedOrg.used_monitors < updatedOrg.monitor_limit
        })
        return res.status(201).json({
            id:monitor._id,
            status:"created"
        })
    } catch (error) {
        return res.status(500).json({
            error:error.message
        })
    }
})

router.get('/', auth, async (req,res) => {
    const org_id = req.org_id
    try {

        const monitors = await Monitor.find({ organizationId: org_id })
        return res.status(200).json(monitors)
    } catch (error) {
        return res.status(500).json({
            error:`${error}`
        })
    }
})

router.patch('/:id', auth, async (req, res) => {
    const id = req.params.id
    const org_id = req.org_id
    try {
        const monitor = await Monitor.findById(id)
        if (!monitor) {
            return res.status(404).json({ message: "Monitor not found" })
        }
        if (monitor.organizationId.toString() !== org_id) {
            return res.status(403).json({ message: "You are not permitted to modify this monitor" })
        }
        monitor.is_active = !monitor.is_active
        const updated_monitor = await monitor.save()
        return res.status(200).json({
            message: 'Monitor status toggled.'
        })
    } catch (error) {
        return res.status(500).json({
            message: `Internal Server Error`
        })
    }
})

router.delete('/:id', auth, async (req, res) => {
    const org_id = req.org_id
    const id = req.params.id
    try {
        const monitor = await Monitor.findById(id)
        if(!monitor){
            return res.status(404).json({
                message:"Monitor Not Found"
            })
        }
        if (monitor.organizationId.toString() !== org_id) {
            return res.status(403).json({
                message: "You are not permitted to delete this monitor"
            })
        }
        await Monitor.findByIdAndDelete(id)
        await Organization.findByIdAndUpdate(org_id, {
            $inc: { used_monitors: -1 }
        })
        return res.status(200).json({
            message: "Monitor deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
})

router.get('/:id/checks', auth, async (req, res) => {
    const id = req.params.id
    const org_id = req.org_id
    let limit = parseInt(req.query.limit)
    if (!limit || limit < 10 || limit > 100) {
        limit = 50
    }
    try {
        const monitor = await Monitor.findById(id)
        if (!monitor || monitor.organizationId.toString() !== org_id) {
            return res.status(404).json({ message: "Monitor not found" })
        }
        const checks = await MonitorCheck.find({ monitorId: id })
            .sort({checked_at:-1})
            .limit(limit)
            .select("status response_time_ms status_code checked_at");
    
        return res.status(200).json(checks)
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
})

module.exports = router
