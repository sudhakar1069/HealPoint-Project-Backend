import type { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler.js";
import { DoctorAvailabilityRepository } from "./availabilityRepository.js";
import { DoctorAvailabilityService } from "./availabilityService.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";

const availabilityRepository = new DoctorAvailabilityRepository();
const doctorRepository = new DoctorRepository();

const availabilityService = new DoctorAvailabilityService(
    availabilityRepository,
    doctorRepository,
);

export const createAvailability = asyncHandler(
    async (req: Request, res: Response) => {

        const doctorId = req.user!.profile_id;
        const result = await availabilityService.createAvailability(doctorId, req.body);
        return res.status(201).json({
            success: true,
            message: "Availability created successfully",
            data: result
        });
    }
);

export const getDoctorAvailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.doctorId);
        const result = await availabilityService.getDoctorAvailability(doctorId);
        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getAvailabilityById = asyncHandler(
    async (req: Request, res: Response) => {
        const availabilityId = Number(req.params.id);
        const result = await availabilityService.getAvailabilityById(availabilityId);
        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const updateAvailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const availabilityId = Number(req.params.id);
        const result = await availabilityService
            .updateAvailability(doctorId, availabilityId, req.body);
        return res.status(200).json({
            success: true,
            message: "Availability updated successfully",
            data: result
        });
    }
);

export const deleteAvailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const availabilityId = Number(req.params.id);
        await availabilityService.deleteAvailability(doctorId, availabilityId);
        return res.status(200).json({
            success: true,
            message: "Availability deleted successfully"
        });
    }
);

