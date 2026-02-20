process.on("unhandledRejection", (err) => {
    console.error("[FATAL] Unhandled Rejection:", err)
})

process.on("uncaughtException", (err) => {
    console.error("[FATAL] Uncaught Exception:", err)
    process.exit(1)
})

const pLimit = require("p-limit").default
const checkMonitor = require("../services/httpCheckService")

const { Alert } = require("../backend/Models/Alert")
const { Monitor } = require("../backend/Models/Monitor")
const { MonitorCheck } = require("../backend/Models/MonitorCheck")

const limit = pLimit(20)
let running = false

async function getDueMonitors() {
    return Monitor.find({
        is_active: true,
        next_check_at: { $lte: new Date() }
    }).limit(500)
}

function startWorker() {
    console.log("Started Uptime Worker");
    setInterval(async () => {
        if (running) return
            running = true

            try {
                const monitors = await getDueMonitors()

                const tasks = monitors.map((monitor) =>
                limit(async () => {
                    try {
                        const result = await checkMonitor(monitor)

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
                            next_check_at: new Date(
                                result.checked_at.getTime() + monitor.interval_sec * 1000
                            ),
                            response_time_ms: result.response_time_ms,
                            status_code: result.status_code
                        })

                        let transition = null
                        if (pastState === "down" && result.status === "up") {
                            transition = "recovery"
                        } else if (pastState !== "down" && result.status === "down") {
                            transition = "down"
                        }

                        if (transition) {
                            await storeAlert(transition, monitor._id)
                        }
                    } catch (err) {
                        console.error("Monitor check failed:", monitor._id, err)
                    }
                })
                )

                await Promise.all(tasks)
            } finally {
                running = false
            }
    }, 10_000)
}

async function storeAlert(type, monitorId) {
    const alert = new Alert({
        monitorId,
        type,
        result: {
            created_by: "uptimeWorker",
            timestamp: new Date()
        }
    })

    await alert.save()
}

startWorker()

module.exports = {}
