const nodemailer = require('nodemailer');

const SUBJECT = 'Reset your HOZOKO password';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEmailBody(resetUrl) {
  return {
    text: `We received a request to reset your HOZOKO password.\n\nOpen this link to choose a new password (valid for 1 hour):\n${resetUrl}\n\nIf you did not ask for this, ignore this email.`,
    html: `<p>We received a request to reset your HOZOKO password.</p>
<p><a href="${escapeHtml(resetUrl)}">Set a new password</a></p>
<p style="word-break:break-all;font-size:13px;color:#666">${escapeHtml(resetUrl)}</p>
<p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
  };
}

function resolveFromAddress() {
  const explicit = process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.RESEND_FROM;
  if (explicit) return explicit;

  const user = process.env.SMTP_USER;
  if (user && /^[^\s<>]+@[^\s<>]+$/.test(user)) {
    return `HOZOKO <${user}>`;
  }

  return 'HOZOKO <onboarding@resend.dev>';
}

async function sendViaResend(to, resetUrl) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return false;
  }

  const { text, html } = buildEmailBody(resetUrl);
  const from = resolveFromAddress();

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: SUBJECT,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[sendPasswordResetEmail] Resend error:', res.status, body);
    return false;
  }

  return true;
}

async function sendViaSmtp(to, resetUrl) {
  const host = process.env.SMTP_HOST;
  if (!host) {
    return false;
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user || pass ? { user, pass } : undefined,
  });

  const from = resolveFromAddress();
  const { text, html } = buildEmailBody(resetUrl);

  await transport.sendMail({
    from,
    to,
    subject: SUBJECT,
    text,
    html,
  });

  return true;
}

/**
 * Sends password reset email.
 * Prefer Resend (Option A): set RESEND_API_KEY (+ RESEND_FROM or EMAIL_FROM).
 * Optional SMTP fallback: SMTP_HOST (+ SMTP_USER / SMTP_PASS) when Resend is not configured.
 */
async function sendPasswordResetEmail(to, resetUrl) {
  try {
    if (process.env.RESEND_API_KEY) {
      return sendViaResend(to, resetUrl);
    }

    if (process.env.SMTP_HOST) {
      await sendViaSmtp(to, resetUrl);
      return true;
    }

    return false;
  } catch (error) {
    console.error('[sendPasswordResetEmail]', error.message || error);
    return false;
  }
}

module.exports = { sendPasswordResetEmail };
