const axios = require('axios')

async function checkMonitor(monitor) {
    const url = monitor.url

    for(let timeouts=0; timeouts<3; timeouts++){
        try {
            const start = new Date()
            let response = await axios.head(url, {
                    timeout:monitor.timeout_ms,
                    maxRedirects:5,
                    validateStatus: ()=>true
                });
            const done = new Date()
            const res_time = done - start;
            const res_code = response.status
            const isUp = res_code>=200 && res_code<=399
            const isDown = res_code>=400 && res_code<=599

            return {
                had_response:true,
                status: isUp?"up":(isDown?"down":"unknown"),
                response_time_ms: res_time,
                status_code: res_code,
                checked_at: done
            }
        } catch (error) {
            const isTimeout = error.code === "ECONNABORTED";
            if (timeouts === 2) {
                return {
                    had_response: false,
                    status: "down",
                    response_time_ms: null,
                    status_code: null,
                    checked_at: new Date(),
                    error: isTimeout ? "Timeout" : error.message
                };
            }
            if (isTimeout) continue;

            return {
                had_response:false,
                status: "unknown",
                response_time_ms: null,
                status_code: null,
                checked_at:new Date(),
                error:error.message
            }
        }
    }            
}

module.exports = checkMonitor