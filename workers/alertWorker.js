process.on("unhandledRejection", (err) => {
    console.error("[FATAL] Unhandled Rejection:", err)
})

process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught Exception:", err)
    process.exit(1)
})

const pLimit = require('p-limit').default;
const { Alert } = require('../backend/Models/Alert')
const {Monitor} = require('../backend/Models/Monitor')
const notifyMail = require('../services/alertService')

async function getpendingAlerts() {
    return await Alert.find({status:"pending", tries: {$lt:3}});
}

let running = false;
const limit = pLimit(20)

function startWorker() {
    console.log("Started Alert Worker");
  setInterval(async () => {
    if(running) return;
    running = true;

    try {
        const pendingAlerts = await getpendingAlerts();

        const tasks = pendingAlerts
            .map((alert)=>
                limit(async () => {
                    const claimed = await Alert.findOneAndUpdate(
                        {_id:alert._id, status:"pending"},
                        {status:"processing"},
                        {new: true}
                    )
                    if(!claimed) return;
                    try {
                        const monitor = await Monitor.findOne({ _id: alert.monitorId })
                        if (!monitor) {
                            await Alert.findByIdAndUpdate(alert._id, {
                            status: "failed",
                            $inc: { tries: 1 },
                            });
                            return;
                        }
                        const res = await notifyMail(alert.type, monitor)
                        const updated = await Alert.findByIdAndUpdate(alert._id,{
                            status: res?"sent":"pending",
                            sent_at : new Date(),
                            $inc: {tries:1}
                            }, 
                            {new:true}
                        )
                        if(updated.status!=="sent" && updated.tries>=3)
                            await Alert.findByIdAndUpdate(alert._id, {status: "failed"})
                    } catch (error) {
                        const updated = await Alert.findByIdAndUpdate(alert._id,{
                            status:"pending",
                            $inc: {tries:1}
                            }, 
                            {new: true}
                        );
                        if(updated.tries>=3)
                            await Alert.findByIdAndUpdate(alert._id, {status:"failed"})
                    }
                })
            )
            await Promise.all(tasks);
    } finally {
        running = false;
    }

  }, 10_000);
}

startWorker()

module.exports = {}
