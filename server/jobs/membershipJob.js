import cron from "node-cron";
import Client from "../schemas/client.js";

export const startMembershipJob = () => {
    cron.schedule("0 0 * * *", async () => {
        console.log("Running membership job...")

        const now = new Date()

        await Client.updateMany(
            { membershipEnd: { $lt: now } },
            { status: "expired" }
        )
    })
}