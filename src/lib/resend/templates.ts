// HTML email templates — inline styles para compatibilidad con clientes de correo

const base = (content: string) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF8F8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F8;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#F5C0C0,#D4BCEC);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
          <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.35);display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
            <span style="font-size:20px;">✦</span>
          </div>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1A2040;letter-spacing:-0.3px;">Nails Art Yurany</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="background:#FFFFFF;padding:36px 40px;border-left:1px solid #F0E8E8;border-right:1px solid #F0E8E8;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#FEF5F7;border:1px solid #F0E8E8;border-top:none;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#B8BCCF;">Nails Art Yurany · Chile</p>
          <p style="margin:4px 0 0;font-size:11px;color:#B8BCCF;">Este es un correo automático, no respondas a este mensaje.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

const detailRow = (icon: string, label: string, value: string) => `
  <tr>
    <td style="padding:8px 0;vertical-align:top;">
      <span style="font-size:14px;">${icon}</span>
    </td>
    <td style="padding:8px 12px 8px 8px;vertical-align:top;width:110px;">
      <span style="font-size:12px;font-weight:600;color:#8A91AD;text-transform:uppercase;letter-spacing:0.5px;">${label}</span>
    </td>
    <td style="padding:8px 0;vertical-align:top;">
      <span style="font-size:14px;color:#1A2040;font-weight:500;">${value}</span>
    </td>
  </tr>`

export function templateConfirmacion(data: {
  clientName: string
  serviceName: string
  date: string
  time: string
  price: string
  paymentStatus: string
}) {
  const isPendingTransfer = data.paymentStatus === 'pending_verification'

  const content = `
    <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;color:#1A2040;">¡Tu cita está reservada! 🎉</h2>
    <p style="margin:0 0 28px;font-size:15px;color:#4A5270;">Hola <strong>${data.clientName}</strong>, recibimos tu reserva con éxito.</p>

    <div style="background:#FFF8F8;border:1px solid #F0E8E8;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('✂️', 'Servicio', data.serviceName)}
        ${detailRow('📅', 'Fecha', data.date)}
        ${detailRow('🕐', 'Hora', data.time)}
        ${detailRow('💰', 'Total', data.price)}
      </table>
    </div>

    ${isPendingTransfer ? `
    <div style="background:#FFF8F0;border:1px solid #FFD9A0;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#E67E00;text-transform:uppercase;letter-spacing:0.5px;">Pago pendiente</p>
      <p style="margin:0;font-size:13px;color:#4A5270;">Tu cita se confirmará una vez que verifiquemos tu transferencia. Te avisaremos por email.</p>
    </div>` : ''}

    <p style="margin:0;font-size:14px;color:#8A91AD;">Si necesitas cancelar o modificar tu cita, contáctanos con anticipación.</p>
  `
  return base(content)
}

export function templateRecordatorio(data: {
  clientName: string
  serviceName: string
  date: string
  time: string
}) {
  const content = `
    <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;color:#1A2040;">Tu cita es mañana ⏰</h2>
    <p style="margin:0 0 28px;font-size:15px;color:#4A5270;">Hola <strong>${data.clientName}</strong>, te recordamos tu cita de mañana.</p>

    <div style="background:#FFF8F8;border:1px solid #F0E8E8;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('✂️', 'Servicio', data.serviceName)}
        ${detailRow('📅', 'Fecha', data.date)}
        ${detailRow('🕐', 'Hora', data.time)}
      </table>
    </div>

    <p style="margin:0;font-size:14px;color:#8A91AD;">Si no puedes asistir, por favor avísanos con anticipación. ¡Te esperamos!</p>
  `
  return base(content)
}

export function templatePagoVerificado(data: {
  clientName: string
  serviceName: string
  date: string
  time: string
  price: string
}) {
  const content = `
    <h2 style="margin:0 0 6px;font-family:Georgia,serif;font-size:24px;color:#1A2040;">¡Pago confirmado! ✅</h2>
    <p style="margin:0 0 28px;font-size:15px;color:#4A5270;">Hola <strong>${data.clientName}</strong>, recibimos y verificamos tu pago. Tu cita está confirmada.</p>

    <div style="background:#F1FAF1;border:1px solid #C8E6C9;border-radius:12px;padding:20px 24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('✂️', 'Servicio', data.serviceName)}
        ${detailRow('📅', 'Fecha', data.date)}
        ${detailRow('🕐', 'Hora', data.time)}
        ${detailRow('💰', 'Pagado', data.price)}
      </table>
    </div>

    <p style="margin:0;font-size:14px;color:#8A91AD;">¡Nos vemos pronto! 💅</p>
  `
  return base(content)
}
