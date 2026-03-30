import cron from "node-cron";
import Client from "../schemas/client.js";
import { sendMail } from "../services/sendMail.js";
import { expiredTemplate } from "../services/emailTemplate.js";

const runMembershipJob = async () => {
    console.log("Running membership job...");

    const now = new Date();
    const next2days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const clients = await Client.find({ delete: false }).populate("plan");

    for (const client of clients) {
        let newStatus = client.status;

        if (!client.plan || !client.membershipEnd) {
            newStatus = "sin_plan";
        } else if (client.membershipEnd < now) {
            newStatus = "vencido";
            // Enviar email solo una vez por cada vez que vence
            if (client.allowEmail && client.email && !client.expiringMailSent) {
                await sendMail({
                    to: client.email,
                    subject: "Tu membresía ha vencido ❌",
                    html: expiredTemplate({
                        name: client.name,
                        endDate: new Date(client.membershipEnd).toLocaleDateString("es-AR")
                    })
                }).catch(err => console.error("Error expired mail:", err.message));
                client.expiringMailSent = true;
            }
        } else if (
            client.membershipEnd < next2days &&
            client.plan?.durationDays > 1
        ) {
            newStatus = "vence_pronto";
        } else {
            newStatus = "activo";
        }

        // Si el estado cambió, lo guardamos y reseteamos el flag de mail enviado
        // (ya que si pasa a 'vencido' nuevamente, querremos enviar otro mail en el futuro)
        if (client.status !== newStatus) {
            client.status = newStatus;
            // Si el nuevo estado NO es vencido, reseteamos para que cuando vuelva a vencer se envíe el mail
            if (newStatus !== "vencido") {
                client.expiringMailSent = false;
            }
            await client.save();
        } else if (client.isModified("expiringMailSent")) {
            // Si el estado no cambió pero sí el flag (venció y enviamos el mail)
            await client.save();
        }
    }
};  

export const startMembershipJob = () => {
    // 🔹 Corre al iniciar el server
    runMembershipJob();

    // 🔹 Corre todos los días a las 00:00
    cron.schedule("0 0 * * *", runMembershipJob);
};