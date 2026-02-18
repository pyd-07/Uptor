const express = require('express');
const router = express.Router();
const {auth} = require('../../Middlewares/auth');
const {Monitor} = require('../../Models/Monitor');


router.get('/summary', auth, async(req, res)=>{
    const org_id = req.org_id
    try{
        const monitors = await Monitor.find({organizationId: org_id})

        const slowest_sort = monitors
        .filter((monitor)=>monitor.response_time_ms!=null)
        .sort((a, b) => b.response_time_ms - a.response_time_ms);


        return res.status(200).json(monitors);
    }catch(err){
        console.error("Dashboard Error:", err);
        return res.status(500).json({
            message:"Internal Server error."
        })
    }

});

module.exports = router;
