const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendEmail(to, subject, html) {
    try {
        const response = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to,
            subject,
            html
        })

        return response
    } catch (error) {
        console.error("Resend error:", error)
        throw error
    }
}

module.exports = sendEmail
