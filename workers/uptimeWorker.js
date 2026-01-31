const pLimit = require('p-limit')
const connectDB = require('../db')
const checkMonitor = require('../services/httpCheckService')
const {Alert} = require('../backend/Models/Alert')
const {Monitor} = require('../backend/Models/Monitor')
const {MonitorCheck} = require('../backend/Models/MonitorCheck')

async function getDueMonitors() {
    const monitors = await Monitor.find({is_active:true, next_check_at: {$lte: new Date()}})
        .limit(500);
    return monitors
}

let running = false;
const limit = pLimit(20)

function startWorker() {
  setInterval(async () => {
    if (running) return;
    running = true;

    try{
        const monitors = await getDueMonitors();

        const tasks = monitors
            .map((monitor)=>
                limit(async () => {
                    const result = await checkMonitor(monitor);

                await MonitorCheck.create({
                    monitorId: monitor._id,
                    had_response: result.had_response,
                    status: result.status,
                    response_time_ms: result.response_time_ms,
                    status_code: result.status_code,
                    checked_at: result.checked_at,
                    error: result.error || null
                })

                const pastState = monitor.last_status
                await Monitor.findByIdAndUpdate(monitor._id, {
                    last_status: result.status,
                    last_checked_at: result.checked_at,
                    next_check_at: new Date(result.checked_at + monitor.interval_sec*1000)
                }
                )
                let transition = null;
                if(pastState=="down" && result.status=="up"){
                    transition = "recovery"
                }else if (pastState!=="down" && result.status=="down") {
                    transition = "down"
                } 
                // Further logic of "unknown" transition if ever needed

                if (transition) {
                    await storeAlert(transition, monitor._id)   
                }
            })
        )
        await Promise.all(tasks);

    } finally {
        running = false
    }

}, 10_000);

async function storeAlert(type, id) {
    const alert = new Alert({
        monitorId: id,
        type
    })
    await alert.save()
}

connectDB().then(startWorker).catch((err) => {
  console.error("Uptime worker failed to connect to DB:", err)
  process.exit(1)
})}