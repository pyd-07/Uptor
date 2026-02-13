const express = require('express');
const router = express.Router();
const {auth} = require('../../Middlewares/auth');
const {Monitor} = require('../../Models/Monitor');


router.get('/summary', auth, async(req, res)=>{
    try{
        const monitorsArr = await Monitor.find({organizationId: req.org_Id})

        const slowest_10 = monitorsArr
        .filter((monitor)=>monitor.response_time_ms!=null)
        .sort((a, b) => b.response_time_ms - a.response_time_ms)
        .slice(0, 10);


        return res.status(200).json({
            allMonitors: monitorsArr,
            slowest_monitors: slowest_10
        });
    }catch(err){
        console.error("Dashboard Error:", err);
        return res.status(500).json({
            message:"Internal Server error."
        })
    }

});

module.exports = router;
