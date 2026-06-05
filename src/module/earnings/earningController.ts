import type { Request, Response } from "express";

import { asyncHandler } from "../../middleware/asyncHandler.js";

import { EarningsRepository } from "./earningRepository.js";
import { EarningsService } from "./earningService.js";

import { DoctorRepository } from "../doctors/doctorRepository.js";

const earningsRepository = new EarningsRepository();
const doctorRepository = new DoctorRepository();

const earningsService = new EarningsService(
    earningsRepository,
    doctorRepository
);

export const getEarningsSummary = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const result = await earningsService.getEarningsSummary(doctorId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getPaymentHistory = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const result = await earningsService.getPaymentHistory(doctorId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getMonthlyEarnings = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = req.user!.profile_id;
        const result = await earningsService.getMonthlyEarnings(doctorId);

        return res.status(200).json({
            success: true,
            data: result
        });
    }
);