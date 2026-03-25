import cron from "node-cron";
import Client from "../schemas/client.js";

const runMembershipJob = async () => {
    console.log("Running membership job...");

    const now = new Date();
    const next2days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

    const clients = await Client.find({ delete: false }).populate("plan");

    for (const client of clients) {

        let newStatus = client.status;

        if (!client.plan || !client.membershipEnd) {
            newStatus = "sin_plan";
        } 
        else if (client.membershipEnd < now) {
            newStatus = "vencido";
        } 
        else if (
            client.membershipEnd < next2days &&
            client.plan?.durationDays > 1
        ) {
            newStatus = "vence_pronto";
        } 
        else {
            newStatus = "activo";
        }

        // 🔥 solo guarda si cambió
        if (client.status !== newStatus) {
            client.status = newStatus;
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