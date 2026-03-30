import nodemailer from "nodemailer";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // APP PASSWORD de Gmail
  },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

export async function verifySMTP() {
  try {
    await transporter.verify();
    console.log("✅ SMTP Gmail conectado correctamente");
  } catch (error) {
    console.error("❌ Error verify SMTP:", error);
  }
}