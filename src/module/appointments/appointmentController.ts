import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { AppointmentRepository } from "./appointmentRepository.js";
import { AppointmentService } from "./appointmentService.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { PatientRepository } from "../patients/patientRepository.js";
import { SlotRepository } from "../slots/slotRepository.js";
import { SlotService } from "../slots/slotService.js";


const appointmentRepository = new AppointmentRepository();
const doctorRepository = new DoctorRepository();
const patientRepository = new PatientRepository();
const slotRepository = new SlotRepository();

const slotService = new SlotService(
    slotRepository,
    doctorRepository
);

const appointmentService = new AppointmentService(
    appointmentRepository,
    doctorRepository,
    patientRepository,
    slotService
);

export const bookAppointment = asyncHandler(async (req: any, res: Response) => {
    const patientId = req.user.profile_id;
    const result = await appointmentService.bookAppointment(patientId, req.body);
    return res.status(201).json({
        success: true,
        message: "Appointment booked successfully",
        data: result
    });
}
);
export const getAllAppointments = asyncHandler(
    async (req: Request, res: Response) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const patientName = req.query.patientName as string;

        const month = req.query.month
            ? Number(req.query.month)
            : undefined;

        const year = req.query.year
            ? Number(req.query.year)
            : undefined;

        const result = await appointmentService.getAllAppointments(
            page,
            limit,
            patientName,
            month,
            year
        );

        res.status(200).json({
            success: true,
            ...result
        });
    }
);
export const getDoctorAppointments = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorUserId = req.user!.id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const patientName = req.query.patientName as string;

        const month = req.query.month
            ? Number(req.query.month)
            : undefined;

        const year = req.query.year
            ? Number(req.query.year)
            : undefined;

        const result = await appointmentService.getDoctorAppointments(
            doctorUserId,
            page,
            limit,
            patientName,
            month,
            year
        );

        res.status(200).json({
            success: true,
            ...result
        });
    }
);
export const getPatientAppointments = asyncHandler(
    async (req: Request, res: Response) => {
        const patientUserId = req.user!.id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const doctorName = req.query.doctorName as string;

        const month = req.query.month
            ? Number(req.query.month)
            : undefined;

        const year = req.query.year
            ? Number(req.query.year)
            : undefined;

        const result =
            await appointmentService.getPatientAppointments(
                patientUserId,
                page,
                limit,
                doctorName,
                month,
                year
            );

        res.status(200).json({
            success: true,
            ...result
        });
    }
);

export const getAppointmentById = asyncHandler(async (req: Request, res: Response) => {

    const appointment = await appointmentService
        .getAppointmentDetails(Number(req.params.id));

    return res.status(200).json({
        success: true,
        appointment,
    });
});

export const joinConsultation = asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
        throw new Error("Unauthorized");
    }

    const appointmentId = Number(req.params.id);
    const profileId = req.user.profile_id;
    const role = req.user.role;

    const result = await appointmentService
        .joinConsultation(appointmentId, profileId, role);

    res.status(200).json({
        success: true,
        data: result
    });
}
);

export const startConsultation = asyncHandler(
    async (req: Request, res: Response) => {

        const appointmentId = Number(req.params.id);
        const result = await appointmentService.startConsultation(
            appointmentId, req.user!.profile_id);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const completeConsultation = asyncHandler(
    async (req: Request, res: Response) => {

        const appointmentId = Number(req.params.id);
        const doctorId = req.user!.profile_id;
        const result = await appointmentService
            .completeConsultation(appointmentId, doctorId);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);