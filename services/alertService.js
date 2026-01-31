const Organization = require('../backend/Models/Organization')
const sendEmail = require('../utils/mailer')

async function notifyMail(transition, monitor) {
    const organization = await Organization.findById(monitor.organizationId)
    if (!organization) return false
    try {
        if(transition==="down")
            await sendEmail(organization.mail, "Monitor Down", downMessage(monitor));
        else if (transition==="recovery")
            await sendEmail(organization.mail, "Monitor Recovered", recoveryMessage(monitor));
        else
            await sendEmail(organization.mail, "Monitor State Unavailable", unknownMessage(monitor));
        return true
    } catch (error) {
        console.log("notifyMail failed:", error.message)
        return false
    }
}

function downMessage(monitor) {
    return `Monitor Down
    Name: ${monitor.name}
    URL: ${monitor.url}
    StatusCode: ${monitor.status_code}
    CheckedAt: ${new Date(monitor.last_checked_at).toISOString()}
    `;
}

function recoveryMessage(monitor){
    return `Monitor Recovered
    Name: ${monitor.name}
    URL: ${monitor.url}
    StatusCode: ${monitor.status_code}
    CheckedAt: ${new Date(monitor.last_checked_at).toISOString()}
    `
}

function unknownMessage(monitor){
    return `Monitor State Unknown
    Name: ${monitor.name}
    URL: ${monitor.url}
    StatusCode: ${monitor.status_code}
    CheckedAt: ${new Date(monitor.last_checked_at).toISOString()}
    `;
}

module.exports = notifyMail