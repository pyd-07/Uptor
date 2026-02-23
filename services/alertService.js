const {Organization} = require('../backend/Models/Organization')
const sendEmail = require('../utils/mailer')

async function notifyMail(transition, monitor) {
    const organization = await Organization.findOne({_id : monitor.organizationId})
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
    return `
  <div style="font-family: Arial, sans-serif; background:#0f172a; padding:24px; color:#e5e7eb;">
    <div style="max-width:600px; margin:0 auto; background:#111827; padding:24px; border-radius:12px;">

      <h2 style="margin:0 0 16px 0; font-weight:600;">
        UPTOR Monitoring Alert
      </h2>

      <div style="padding:12px 16px; background:#7f1d1d; border-radius:8px; margin-bottom:20px;">
        <strong>Status:</strong> DOWN
      </div>

      <p style="margin-bottom:16px; font-size:14px;">
        The monitored endpoint is currently unreachable.
      </p>

      <table style="width:100%; font-size:14px; line-height:1.6;">
        <tr>
          <td style="color:#9ca3af;">Name</td>
          <td>${monitor.name}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">URL</td>
          <td>${monitor.url}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Status Code</td>
          <td>${monitor.status_code ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Checked At</td>
          <td>${new Date(monitor.last_checked_at).toUTCString()}</td>
        </tr>
      </table>

      <p style="margin-top:20px; font-size:13px; color:#9ca3af;">
        Immediate attention may be required.
      </p>

      <hr style="margin:24px 0; border:0; border-top:1px solid #1f2937;" />

      <p style="font-size:12px; color:#6b7280;">
        Uptor Monitoring Service<br/>
        Reliable uptime tracking
      </p>

    </div>
  </div>
  `;
}

function recoveryMessage(monitor) {
    return `
  <div style="font-family: Arial, sans-serif; background:#0f172a; padding:24px; color:#e5e7eb;">
    <div style="max-width:600px; margin:0 auto; background:#111827; padding:24px; border-radius:12px;">

      <h2 style="margin:0 0 16px 0; font-weight:600;">
        UPTOR Monitoring Alert
      </h2>

      <div style="padding:12px 16px; background:#064e3b; border-radius:8px; margin-bottom:20px;">
        <strong>Status:</strong> RECOVERED
      </div>

      <p style="margin-bottom:16px; font-size:14px;">
        The monitored endpoint is responding normally again.
      </p>

      <table style="width:100%; font-size:14px; line-height:1.6;">
        <tr>
          <td style="color:#9ca3af;">Name</td>
          <td>${monitor.name}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">URL</td>
          <td>${monitor.url}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Status Code</td>
          <td>${monitor.status_code ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Checked At</td>
          <td>${new Date(monitor.last_checked_at).toUTCString()}</td>
        </tr>
      </table>

      <p style="margin-top:20px; font-size:13px; color:#9ca3af;">
        Service availability has been restored.
      </p>

      <hr style="margin:24px 0; border:0; border-top:1px solid #1f2937;" />

      <p style="font-size:12px; color:#6b7280;">
        Uptor Monitoring Service<br/>
        Reliable uptime tracking
      </p>

    </div>
  </div>
  `;
}

function unknownMessage(monitor) {
    return `
  <div style="font-family: Arial, sans-serif; background:#0f172a; padding:24px; color:#e5e7eb;">
    <div style="max-width:600px; margin:0 auto; background:#111827; padding:24px; border-radius:12px;">

      <h2 style="margin:0 0 16px 0; font-weight:600;">
        UPTOR Monitoring Alert
      </h2>

      <div style="padding:12px 16px; background:#78350f; border-radius:8px; margin-bottom:20px;">
        <strong>Status:</strong> UNKNOWN
      </div>

      <p style="margin-bottom:16px; font-size:14px;">
        The monitor state could not be determined at this time.
      </p>

      <table style="width:100%; font-size:14px; line-height:1.6;">
        <tr>
          <td style="color:#9ca3af;">Name</td>
          <td>${monitor.name}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">URL</td>
          <td>${monitor.url}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Status Code</td>
          <td>${monitor.status_code ?? "N/A"}</td>
        </tr>
        <tr>
          <td style="color:#9ca3af;">Checked At</td>
          <td>${new Date(monitor.last_checked_at).toUTCString()}</td>
        </tr>
      </table>

      <p style="margin-top:20px; font-size:13px; color:#9ca3af;">
        Monitoring attempts will continue automatically.
      </p>

      <hr style="margin:24px 0; border:0; border-top:1px solid #1f2937;" />

      <p style="font-size:12px; color:#6b7280;">
        Uptor Monitoring Service<br/>
        Reliable uptime tracking
      </p>

    </div>
  </div>
  `;
}

module.exports = notifyMail