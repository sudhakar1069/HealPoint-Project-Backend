import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";

import { SpecializationRepository } from "./departmentRepository.js";
import { SpecializationService } from "./specializationService.js";
import { NotificationRepository } from "../notifications/notificationRepository.js";
import { NotificationService } from "../notifications/notificationService.js";

const specializationRepository = new SpecializationRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

const specializationService = new SpecializationService(specializationRepository, notificationService);

export const createSpecialization = asyncHandler(async (req: Request, res: Response) => {
    const specialization = await specializationService.createSpecialization(req.body);
    res.status(201).json({
        success: true,
        message: "Specialization created successfully",
        specialization,
    });
}
);

export const getAllSpecializations = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = (req.query.search as string) || "";
    const result = await specializationService.getAllSpecializations(
        page,
        limit,
        search
    );

    res.status(200).json({
        success: true,
        ...result,
    });
}
);

export const getSpecializationById = asyncHandler(async (req: Request, res: Response) => {
    const specialization = await specializationService.getSpecializationById(
        Number(req.params.id)
    );
    res.status(200).json({
        success: true,
        specialization,
    });
}
);

export const updateSpecialization = asyncHandler(async (req: Request, res: Response) => {
    const specialization = await specializationService.updateSpecialization(
        Number(req.params.id),
        req.body
    );

    res.status(200).json({
        success: true,
        message: "Specialization updated successfully",
        specialization,
    });
}
);

export const deleteSpecialization = asyncHandler(async (req: Request, res: Response) => {
    const response = await specializationService.deleteSpecialization(
        Number(req.params.id)
    );
    res.status(200).json({
        success: true,
        ...response,
    });
}
);