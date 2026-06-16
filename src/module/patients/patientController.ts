import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { PatientRepository } from "./patientRepository.js";
import { PatientService } from "./patientService.js";

const patientRepository = new PatientRepository();
const patientService = new PatientService(patientRepository);

export const getAllPatients = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 11;
        const filters = {
            search: req.query.search,
            gender: req.query.gender,
            blood_group: req.query.blood_group,
            is_active: req.query.is_active
        };
        const patients = await patientService.getAllPatients(
            page,
            limit,
            filters
        );
        res.status(200).json({
            success: true,
            message: "Patients fetched successfully",
            data: patients
        });
    }
);
export const getMyPatientProfile = asyncHandler(
    async (req: Request, res: Response) => {

        const userId = req.user!.id;
        const patient: any = await patientService.getMyPatientProfile(userId);

        return res.status(200).json({
            success: true,
            message: "Patient profile fetched successfully",
            data: patient,
        });
    }
);
export const updateMyPatientProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user!.id;
        const result = await patientService.updateMyPatientProfile(
            userId,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Patient profile updated successfully",
            data: result,
        });
    }
);
export const updateMyPatientPhoto = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user!.id;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Profile image is required",
            });
        }
        const result = await patientService.updateMyPatientPhoto(
            userId,
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

export const getPatientById = asyncHandler(async (req: Request, res: Response) => {
    const patientId = Number(req.params.id);
    const patient = await patientService.getPatientById(patientId);

    return res.status(200).json({
        success: true,
        message: "Patient fetched successfully",
        data: patient
    });
}
);

export const updatePatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = Number(req.params.id);
    const result = await patientService.updatePatient(
        patientId,
        req.body
    );

    return res.status(200).json({
        success: true,
        message: "Patient updated successfully",
        data: result
    });
});

export const updatePatientPhoto = asyncHandler(async (req: Request, res: Response) => {

    const patientId = Number(req.params.id);
    const loggedInUserId = req.user!.id;
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Upload image"
        });
    }

    const result = await patientService.updatePatientPhoto(
        patientId,
        loggedInUserId,
        req.file.path
    );

    result.profile_picture = req.file.path;
    return res.status(200).json({
        success: true,
        message: "Patient photo updated successfully",
        data: result
    });
}
);

export const deletePatient = asyncHandler(async (req: Request, res: Response) => {
    const patientId = Number(req.params.id);
    const result = await patientService.deletePatient(patientId);
    return res.status(200).json({
        success: true,
        message: result.message
    });
});