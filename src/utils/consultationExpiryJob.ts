import cron from "node-cron";

import { AppointmentRepository } from "../module/appointments/appointmentRepository.js";
import { AppointmentService } from "../module/appointments/appointmentService.js";
import { DoctorRepository } from "../module/doctors/doctorRepository.js";
import { PatientRepository } from "../module/patients/patientRepository.js";
import { SlotRepository } from "../module/slots/slotRepository.js";
import { SlotService } from "../module/slots/slotService.js";
import { PaymentRepository } from "../module/payment/paymentRepository.js";
import { ReviewRepository } from "../module/reviews/reviewRepository.js";

const appointmentRepository = new AppointmentRepository();

const slotService = new SlotService(
    new SlotRepository(),
    new DoctorRepository()
);

const appointmentService = new AppointmentService(
     appointmentRepository, new DoctorRepository(), new PatientRepository(),
    slotService, new PaymentRepository(),new ReviewRepository()
);

export const startConsultationExpiryJob = () => {

    cron.schedule("* * * * *", async () => {
        try {
            await appointmentService.expireMissedConsultations();
            // console.log("[CONSULTATION EXPIRY JOB] checked");

        } catch (error) {
            console.error("[CONSULTATION EXPIRY JOB ERROR]", error
            );
        }
    }
    );
};