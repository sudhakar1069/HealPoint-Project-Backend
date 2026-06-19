import cron from "node-cron";

import { AppointmentRepository } from "../module/appointments/appointmentRepository.js";
import { AppointmentService } from "../module/appointments/appointmentService.js";
import { DoctorRepository } from "../module/doctors/doctorRepository.js";
import { PatientRepository } from "../module/patients/patientRepository.js";
import { SlotRepository } from "../module/slots/slotRepository.js";
import { SlotService } from "../module/slots/slotService.js";
import { PaymentRepository } from "../module/payment/paymentRepository.js";

const appointmentRepository = new AppointmentRepository();

const slotService = new SlotService(
    new SlotRepository(),
    new DoctorRepository()
);

const appointmentService = new AppointmentService(
    appointmentRepository,
    new DoctorRepository(),
    new PatientRepository(),
    slotService,
    new PaymentRepository(),
);

export const startAppointmentReminderJob = () => {
    cron.schedule("* * * * *", async () => {
         console.log("[REMINDER JOB] Running", new Date().toISOString());
        try {
            await appointmentService.sendUpcomingAppointmentReminders();
        } catch (error) {
            console.error("[APPOINTMENT REMINDER JOB ERROR]", error);
        }
    });
};