import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { PaymentRepository } from "./paymentRepository.js";
import { PaymentService } from "./paymentService.js";
import { AppointmentRepository } from "../appointments/appointmentRepository.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";

const paymentRepository = new PaymentRepository();
const appointmentRepository = new AppointmentRepository();
const doctorRepository = new DoctorRepository();
const paymentService = new PaymentService(
    paymentRepository,
    appointmentRepository,
    doctorRepository
);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {

    const patientId = req.user!.profile_id;
    const appointment_id = req.body.appointment_id
    const order = await paymentService.createOrder(patientId, appointment_id);

    return res.status(200).json({
        success: true,
        data: order,
    });
}
);

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    const result = await paymentService.verifyPayment(req.body);
    return res.status(200).json(
        result
    );
});


export const getPaymentByAppointment = asyncHandler(async (req: Request, res: Response) => {

    const payment = await paymentService.getPaymentByAppointment(
        Number(req.params.appointmentId)
    );

    return res.status(200).json({
        success: true,
        payment
    });
}
);







