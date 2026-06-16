import { sequelize } from "./config/db.js";
import app from "./app.js";
import { startPaymentExpiryJob } from "./utils/paymentExpiryJob.js";
import { startConsultationExpiryJob } from "./utils/consultationExpiryJob.js";
import { startAppointmentReminderJob } from "./utils/appointmentReminderJob.js";
const port = process.env.PORT || 8080;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("database connected successfully")
        try {
            startPaymentExpiryJob();
            console.log("Payment expiry job started");

            startConsultationExpiryJob();
            console.log("Consultation expiry job started");

            startAppointmentReminderJob();
            console.log("Appointment reminder job started");
        } catch (err) {
            console.error("Job startup error:", err);
        }
        app.listen(port, () => {
            console.log(`server running on port ${port}`)
        })
    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};
startServer();