import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
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