const axios = require('axios')

async function checkMonitor(monitor) {
    const url = monitor.url

    for(let retries=0; retries<3; retries++){
        try {
            const start = new Date()
            let response = await axios.get(url, {
                    timeout:monitor.timeout_ms,
                    maxRedirects:5,
                    validateStatus: ()=>true
                });
            const res_time = new Date() - start;
            const res_code = response.status
            const isUp = res_code>=200 && res_code<=399
            const isDown = res_code>=400 && res_code<=599

            return {
                had_response:true,
                status: isUp?"up":(isDown?"down":"unknown"),
                response_time_ms: res_time,
                status_code: res_code,
                checked_at: new Date()
            }
        } catch (error) {
            const tryAgain = (error.code === "ECONNABORTED"
                                || error.code === "ECONNRESET"
                                || error.code === "ENOTFOUND"
                                || error.code === "EAI_AGAIN"
                            );
            if (retries === 2) {
                return {
                    had_response: false,
                    status: "down",
                    response_time_ms: null,
                    status_code: null,
                    checked_at: new Date(),
                    error: error.message
                };
            }
            if (tryAgain){
              await new Promise(r => setTimeout(r, 1000))
              continue
            }

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
