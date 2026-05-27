import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { NotificationRepository } from "./notificationRepository.js";
import { NotificationService } from "./notificationService.js";

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

export const createDoctorNotification = asyncHandler(
    async (req: Request, res: Response) => {
        const { doctorName ,specialization} = req.body;
        const notification = await notificationService.addDoctorNotification(
            doctorName,specialization
        );
        res.status(201).json({
            success: true,
            message: "Doctor notification created successfully",
            notification,
        });
    }
);

export const createDepartmentNotification = asyncHandler(
    async (req: Request, res: Response) => {
        const { departmentName } = req.body;
        const notification = await notificationService.addDepartmentNotification(
            departmentName
        );
        res.status(201).json({
            success: true,
            message: "Department notification created successfully",
            notification,
        });
    }
);

export const getNotifications = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await notificationService.getAllNotifications(
            page,
            limit
        );

        res.status(200).json({
            success: true,
            ...result,
        });
    }
);

export const markNotificationsRead = asyncHandler(
    async (req: Request, res: Response) => {
        await notificationService.readNotifications();
        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    }
);