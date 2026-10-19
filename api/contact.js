// Indra — envía por correo (Resend) el mensaje de contacto u ofrecimiento
// a la persona contactada. El remitente va en Reply-To para que pueda responder.

const responses = require("./responses.js");

const RESEND_URL = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function clean(s, max) {
  return String(s == null ? "" : s).replace(/[\r\n]+/g, " ").trim().slice(0, max);
}
function normEmail(s) {
  return String(s || "").trim().toLowerCase();
}

function fromAddress() {
  const raw = String(process.env.RESEND_EMAIL_DOMAIN || "").trim();
  if (!raw) return "Indra <onboarding@resend.dev>";
  if (raw.indexOf("<") >= 0) return raw;
  if (raw.indexOf("@") >= 0) return "Indra <" + raw + ">";
  return "Indra <indra@" + raw + ">";
}

async function allowedRecipients() {
  const set = new Set();
  (responses.SEEDS || []).forEach(function (p) {
    if (p.email) set.add(normEmail(p.email));
  });
  try {
    const r = await fetch(responses.SHEET_CSV_URL, { redirect: "follow" });
    if (r.ok) {
      responses.buildPeople(await r.text()).forEach(function (p) {
        if (p.email) set.add(normEmail(p.email));
      });
    }
  } catch (e) {
    // sin hoja: solo valen los perfiles base
  }
  return set;
}

function buildHtml(o) {
  const body = esc(o.message).replace(/\n/g, "<br>");
  const intro =
    o.kind === "contact"
      ? esc(o.fromName) + " quiere conectar contigo desde la red Indra."
      : esc(o.fromName) + " respondió a tu solicitud en la red Indra.";
  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#1c1b19;line-height:1.55">' +
    '<p style="font-size:15px;margin:0 0 16px"><strong>' + intro + "</strong></p>" +
    '<div style="background:#f6f3ec;border-radius:12px;padding:16px 18px;font-size:15px">' + body + "</div>" +
    '<p style="font-size:14px;margin:18px 0 0">Para responder, escribe a <a href="mailto:' + esc(o.fromEmail) + '">' + esc(o.fromEmail) + "</a> " +
    "o simplemente responde a este correo.</p>" +
    '<p style="font-size:12px;color:#7a766d;margin:22px 0 0">Indra — Casa de la Cultura Latinoamericana, Berlín</p>' +
    "</div>"
  );
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ ok: false, error: "not_configured" });
  }

  let b = req.body;
  if (typeof b === "string") {
    try { b = JSON.parse(b); } catch (e) { b = {}; }
  }
  b = b || {};

  const to = normEmail(b.to);
  const fromName = clean(b.fromName, 80);
  const fromEmail = normEmail(b.fromEmail);
  const toName = clean(b.toName, 80);
  const kind = b.kind === "contact" ? "contact" : "offer";
  const subject = clean(b.subject, 140) || "Indra — Mensaje";
  const message = String(b.message == null ? "" : b.message).trim().slice(0, 1500);

  if (!EMAIL_RE.test(to) || !EMAIL_RE.test(fromEmail) || !fromName || !message) {
    return res.status(400).json({ ok: false, error: "invalid_input" });
  }

  const allowed = await allowedRecipients();
  if (!allowed.has(to)) {
    return res.status(403).json({ ok: false, error: "recipient_not_allowed" });
  }

  const payload = {
    from: fromAddress(),
    to: [to],
    reply_to: fromEmail,
    subject: subject,
    html: buildHtml({ kind: kind, fromName: fromName, fromEmail: fromEmail, message: message }),
    text: fromName + " <" + fromEmail + ">\n\n" + message + "\n\n— Indra, Casa de la Cultura Latinoamericana",
  };

  try {
    const r = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": "contact/" + Buffer.from(fromEmail + "|" + to + "|" + message).toString("base64").slice(0, 120) + "/" + Math.floor(Date.now() / 60000),
      },
      body: JSON.stringify(payload),
    });
    const data = await r.json().catch(function () { return {}; });
    if (!r.ok) {
      return res.status(502).json({ ok: false, error: "send_failed", detail: data && data.message ? String(data.message) : "HTTP " + r.status });
    }
    return res.status(200).json({ ok: true, id: data.id, toName: toName });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "send_failed", detail: String((e && e.message) || e) });
  }
};
