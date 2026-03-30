import { transporter } from "../utils/mailer.js";

export const sendMail = async ({ to, subject, html }) => {
    try {
       const info= await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME || "GymSaaS"}" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log("Email enviado correctamente", info.messageId)
    } catch (error) {
       console.error("❌ Error enviando email:", error.message);
       throw error;
    }
}