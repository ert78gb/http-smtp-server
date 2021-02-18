import nodemailer from 'nodemailer'

let normalTransporter
let dkimTransporter

/**
 * @param {boolean} dkim - Use transport with default DKIM sign
 * @returns {Mail|*}
 */
function getTransporter({ dkim }) {
  if (dkim)
    return getDkimTransport()

  return getNormalTransport()
}

function getNormalTransportOptions() {
  const transportOption = {
    host: process.env.SMTP_RELAY_HOST,
    port: parseInt(process.env.SMTP_RELAY_PORT || '25', 10),
    secure: process.env.SMTP_RELAY_USE_TLS === 'true'
  }

  if (process.env.SMTP_RELAY_USER)
    transportOption.auth = {
      user: process.env.SMTP_RELAY_USER,
      pass: process.env.SMTP_RELAY_PASSWORD,
    }

  if (process.env.SMTP_ACCEPT_INVALID_CERT)
    transportOption.tls = {
      rejectUnauthorized: process.env.SMTP_ACCEPT_INVALID_CERT !== 'true'
    }

  return transportOption
}

function getDkimTransportOptions() {
  const transportOption = getNormalTransportOptions()

  if (process.env.SMTP_DKIM_DOMAIN)
    transportOption.dkim = {
      domainName: process.env.SMTP_DKIM_DOMAIN,
      keySelector: process.env.SMTP_DKIM_KEY_SELECTOR,
      privateKey: process.env.SMTP_DKIM_PRIVATE_KEY.split('\\n').join('\n'),
    }

  return transportOption
}

function getDkimTransport() {
  if (dkimTransporter)
    return dkimTransporter

  dkimTransporter = nodemailer.createTransport(getDkimTransportOptions())

  return dkimTransporter
}

function getNormalTransport() {
  if (normalTransporter)
    return normalTransporter

  normalTransporter = nodemailer.createTransport(getNormalTransportOptions())

  return normalTransporter
}

function mapEmailAddress(emailAddress) {
  return {
    name: emailAddress.name,
    address: emailAddress.email,
  }
}
export default function sendEmail(options) {
  return getTransporter({ dkim: !options.dkim })
    .sendMail({
      attachments: options.attachments,
      bcc: (options.bcc || []).map(mapEmailAddress),
      cc: (options.cc || []).map(mapEmailAddress),
      from: mapEmailAddress(options.from),
      html: options.html,
      priority: options.priority,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      to: options.to.map(mapEmailAddress),
    })
}
