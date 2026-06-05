import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { SpecialAvailabilityRepository } from "./specialAvailabilityRepository.js";
import { SpecialAvailabilityService } from "./specialAvailabilityService.js";

const doctorRepository = new DoctorRepository();
const specialAvailabilityRepository = new SpecialAvailabilityRepository();
const specialAvailabilityService = new SpecialAvailabilityService(
    specialAvailabilityRepository,
    doctorRepository
);


export const createSpecialAvailability = asyncHandler(async (req: Request, res: Response) => {
    const doctorId = req.user!.profile_id;
    const result = await specialAvailabilityService
        .createSpecialAvailability(doctorId, req.body);

    return res.status(201).json({
        success: true,
        message: "Special availability created successfully",
        data: result
    });
}
);

export const getDoctorSpecialAvailabilities = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const result = await specialAvailabilityService
            .getDoctorSpecialAvailabilities(doctorId);
        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getSpecialAvailabilityById = asyncHandler(
    async (req: Request, res: Response) => {

        const specialAvailabilityId = Number(req.params.id);
        const result = await specialAvailabilityService
            .getSpecialAvailabilityById(specialAvailabilityId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const updateSpecialAvailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const specialAvailabilityId = Number(req.params.id);
        const result = await specialAvailabilityService
            .updateSpecialAvailability(doctorId, specialAvailabilityId, req.body);

        return res.status(200).json({
            success: true,
            message: "Special availability updated successfully",
            data: result
        });
    }
);

export const deleteSpecialAvailability = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const specialAvailabilityId = Number(req.params.id);
        await specialAvailabilityService
            .deleteSpecialAvailability(doctorId, specialAvailabilityId);

        return res.status(200).json({
            success: true,
            message: "Special availability deleted successfully"
        });
    }
);