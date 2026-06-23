import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { DoctorUnavailabilityRepository } from "./unavailabilityRepository.js";
import { DoctorUnavailabilityService } from "./unavailabilityService.js";
import { AppointmentRepository } from "../appointments/appointmentRepository.js";

const doctorRepository = new DoctorRepository();

const doctorUnavailabilityRepository = new DoctorUnavailabilityRepository();
const appointmentRepository = new AppointmentRepository();
const doctorUnavailabilityService = new DoctorUnavailabilityService(
    doctorUnavailabilityRepository,
    doctorRepository,
    appointmentRepository
);

export const createUnavailability = asyncHandler(
    async (req: Request, res: Response) => {

        const doctorId = req.user!.profile_id;
        const result = await doctorUnavailabilityService
            .createUnavailability(doctorId, req.body);

        return res.status(201).json({
            success: true,
            message: "Unavailability created successfully",
            data: result
        });
    }
);

export const getDoctorUnavailabilities = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.doctorId);
        const result = await doctorUnavailabilityService
            .getDoctorUnavailabilities(doctorId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getDoctorUnavailabilityById = asyncHandler(
    async (req: Request, res: Response) => {

        const unavailabilityId = Number(req.params.id);
        const result = await doctorUnavailabilityService
            .getDoctorUnavailabilityById(unavailabilityId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const deleteUnavailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const unavailabilityId = Number(req.params.id);

        await doctorUnavailabilityService
            .deleteUnavailability(doctorId, unavailabilityId);

        return res.status(200).json({
            success: true,
            message: "Unavailability deleted successfully"
        });
    }
);