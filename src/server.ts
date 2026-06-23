import { sequelize } from "./config/db.js";
import app from "./app.js";
import { startPaymentExpiryJob } from "./utils/paymentExpiryJob.js";
import { startConsultationExpiryJob } from "./utils/consultationExpiryJob.js";
import { startAppointmentReminderJob } from "./utils/appointmentReminderJob.js";
import logger from "./utils/logger.js";
const port = process.env.PORT || 8080;
const startServer = async () => {
    try {
        await sequelize.authenticate();
        logger.info("database connected successfully")
        try {
            startPaymentExpiryJob();
            logger.info("Payment expiry job started");

            startConsultationExpiryJob();
            logger.info("Consultation expiry job started");

            startAppointmentReminderJob();
            logger.info("Appointment reminder job started");
        } catch (err) {
            logger.error("Job startup error:", err);
        }
        app.listen(port, () => {
            logger.info(`server running on port ${port}`)
        })
    } catch (err) {
        logger.error("Server startup failed:", err);
        process.exit(1);
    }
};
startServer();