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

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const date = req.query.date as string | undefined;

        const result = await earningsService.getPaymentHistory(
            doctorId,
            page,
            limit,
            date
        );

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