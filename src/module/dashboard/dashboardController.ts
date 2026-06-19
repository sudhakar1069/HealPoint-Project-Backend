import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";
import { PaymentRepository } from "../payment/paymentRepository.js";
import { ReviewRepository } from "../reviews/reviewRepository.js";
import { DashboardService } from "./dashboardService.js";
import { DashboardRepository } from "./dashboardRepository.js";

const dashboardRepository = new DashboardRepository();
const doctorRepository = new DoctorRepository();
const paymentRepository = new PaymentRepository();
const reviewRepository = new ReviewRepository();

const dashboardService = new DashboardService(
    dashboardRepository,
    doctorRepository,
    paymentRepository,
    reviewRepository
);

export const getDoctorDashboardSummary = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorUserId = req.user!.id;
        const result = await dashboardService.getDoctorDashboardSummary(doctorUserId);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getTodayAppointmentsForDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorUserId = req.user!.id;
        const result = await dashboardService.getTodayAppointmentsForDashboard(doctorUserId);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getWeeklyLoadForDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorUserId = req.user!.id;
        const result = await dashboardService.getWeeklyLoadForDashboard(doctorUserId);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getMonthlyOverviewForDashboard = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorUserId = req.user!.id;

        const year = req.query.year
            ? Number(req.query.year)
            : new Date().getFullYear();

        const result = await dashboardService.getMonthlyOverviewForDashboard(doctorUserId, year);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getAdminAppointmentsOverview = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await dashboardService.getAdminDashboard(page, limit);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getDoctorAvailabilityDashboard =
    asyncHandler(async (req: Request, res: Response) => {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const dateQuery = req.query.date;

        const date = typeof dateQuery === "string"
            ? dateQuery
            : new Date().toISOString().split("T")[0]!;
        const result = await dashboardService.getDoctorAvailabilityDashboard(
            date,
            page,
            limit
        );

        res.status(200).json({
            success: true,
            data: result
        });
    });

export const getAdminEarningsReport = asyncHandler(
    async (req: Request, res: Response) => {
        const period = typeof req.query.period === "string"
            ? req.query.period
            : "year";

        const result = await dashboardService.getAdminEarningsReport(period);
        res.status(200).json({
            success: true,
            data: result
        });
    }
);

export const getAdminDashboardOverview = asyncHandler(
    async (req: Request, res: Response) => {

        const year = req.query.year
            ? Number(req.query.year)
            : new Date().getFullYear();

        const result = await dashboardService.getAdminDashboardOverview(year);

        res.status(200).json({
            success: true,
            data: result
        });
    }
);