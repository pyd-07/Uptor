const express = require('express');
const router = express.Router();
const {auth} = require('../../Middlewares/auth');
const {Monitor} = require('../../Models/Monitor');


router.get('/summary', auth, async(req, res)=>{
    try{
        const monitorsArr = await Monitor.find({organizationId: req.org_Id})

        const totalMonitors = monitorsArr.length;
        const upMonitors = monitorsArr.filter((monitor)=> monitor.last_status==="up" && monitor.is_active).length
        const downMonitors = monitorsArr.filter((monitor)=> monitor.last_status==="down" && monitor.is_active).length
        const pausedMonitors = monitorsArr.filter((monitor)=> !monitor.is_active).length
        const unknownMonitors = monitorsArr.filter((monitor)=> monitor.last_status==="unknown" && monitor.is_active).length

        const stats = {
           totalMonitors,
           upMonitors,
           downMonitors,
           pausedMonitors,
           unknownMonitors
        };

        const slowest_10 = monitorsArr
        .filter((monitor)=>monitor.response_time_ms!=null)
        .sort((a, b) => b.response_time_ms - a.response_time_ms)
        .slice(0, 10);

        const formatted = slowest_10.map(m => ({
            id: m._id,
            name: m.name,
            url: m.url,
            status: m.last_status,
            responseTime: m.response_time_ms,
            interval: `${m.interval_sec / 60} min`,
            lastChecked: m.last_checked_at,
            is_active: m.is_active
        }));


        return res.status(200).json({
            stats,
           monitors: formatted
        });
    }catch(err){
        console.error("Dashboard Error:", err);
        return res.status(500).json({
            message:"Internal Server error."
        })
    }

});

module.exports = router;
