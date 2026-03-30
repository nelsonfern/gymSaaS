export const welcomeTemplate = ({name}) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    <h2>¡Bienvenido/a, ${name}! 💪</h2>
    <p>Tu registro en <b>${process.env.MAIL_FROM_NAME || "GymSaaS"}</b> fue exitoso.</p>
    <p>Nos alegra tenerte con nosotros.</p>
    <hr />
    <p style="font-size: 12px; color: #666;">Este correo fue enviado automáticamente.</p>
  </div>
`;

export const paymentTemplate = ({ name, amount, planName, paymentType, date, originalPrice, discount, note }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    <h2>Pago registrado ✅</h2>
    <p>Hola <b>${name}</b>, registramos tu pago correctamente.</p>
    <ul>
      <li><b>Plan:</b> ${planName} || Precio: ${originalPrice}</li>
      <li><b>Monto:</b> $${amount}</li>
      <li><b>Descuento:</b> $${discount}</li>
      <li><b>Tipo de pago:</b> ${paymentType}</li>
      ${note ? `<li><b>Observación:</b> ${note}</li>` : ""}
      <li><b>Fecha:</b> ${date}</li>
    </ul>
    <p>¡Gracias por entrenar con nosotros! 💪</p>
  </div>
`;

export const expiredTemplate = ({ name, endDate }) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #222;">
    <h2>Tu membresía ha vencido ❌</h2>
    <p>Hola <b>${name}</b>, tu membresía venció.</p>
    <p><b>Fecha de vencimiento:</b> ${endDate}</p>
    <p>Podés renovarla cuando quieras. ¡Te esperamos! 💪</p>
  </div>
`;