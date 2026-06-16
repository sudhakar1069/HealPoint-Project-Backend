import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { DoctorRepository } from "./doctorRepository.js";
import { DoctorService } from "./doctorService.js";
import { NotificationRepository } from "../notifications/notificationRepository.js";
import { NotificationService } from "../notifications/notificationService.js";

const doctorRepository = new DoctorRepository();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(
    notificationRepository
);

const doctorService = new DoctorService(
    doctorRepository,
    notificationService
);

export const createDoctor = asyncHandler(async (req: Request, res: Response) => {
    const result = await doctorService.createDoctor(req.body, req.file?.path);
    return res.status(201).json({
        success: true,
        message: "Doctor created successfully",
        data: result
    });
});

export const getAllDoctors = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const filters = {
            experience_years: req.query.experience_years,
            consultation_fee: req.query.consultation_fee,
            specialization: req.query.specialization,
            gender: req.query.gender,
            name: req.query.name,
            search: req.query.search,
        };

        const doctors = await doctorService.getAllDoctors(
            page,
            limit,
            filters
        );

        return res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
        });
    }
);

export const getDoctorById = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.id);
        const doctor: any = await doctorService.getDoctorById(doctorId);

        return res.status(200).json({
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        });
    }
);

export const getMyDoctorProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const doctor = await doctorService.getMyDoctorProfile(userId);

        return res.status(200).json({
            success: true,
            message: "Doctor profile fetched successfully",
            data: doctor,
        });
    }
);

export const updateDoctor = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.id);
        const result = await doctorService.updateDoctor(
            doctorId,
            req.body
        );
        return res.status(200).json({
            success: true,
            message: "Doctor profile updated successfully",
            data: result,
        });
    }
);

export const updateDoctorPhoto = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.id);
        const loggedInUserId = req.user!.id;
        const loggedInUserRole = req.user!.role;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }
        const result = await doctorService.updateDoctorPhoto(
            doctorId,
            loggedInUserId,
            loggedInUserRole,
            req.file.path
        );
        result.profile_picture = req.file.path;

        return res.status(200).json({
            success: true,
            message: "Profile photo updated successfully",
            data: result,
        });
    }
);

export const deleteDoctor = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.id);
        const result = await doctorService.deleteDoctor(doctorId);
        return res.status(200).json({
            success: true,
            message: result.message
        });
    }
);