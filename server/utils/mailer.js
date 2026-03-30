import nodeMailer from "nodemailer";
import dns from "node:dns";

// Fuerza a Node.js a utilizar redes IPv4 en lugar de IPv6 al enviar emails.
// Esto soluciona de raíz el error ENETUNREACH en plataformas como Render que no soportan conexión saliente IPv6.
dns.setDefaultResultOrder("ipv4first");

export const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Render puede bloquear ciertas conexiones TLS por defecto, usar STARTTLS en puerto 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // Evita a veces problemas de certificados en hosting gratuito
    }
});