import type { NextFunction, Request, Response } from "express";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

export const OwnerShip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const loggedInUserId = req.user.id;
        const role = req.user.role;
        const profileId = Number(req.params.id);

        if (role === "admin") {
            return next();
        }

        if (role === "doctor") {
            const doctor = await Doctor.findByPk(profileId);

            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found"
                });
            }

            if (doctor.user_id !== loggedInUserId) {
                return res.status(403).json({
                    success: false,
                    message: "You can access only your own account"
                });
            }
        }

        else if (role === "patient") {
            const patient = await Patient.findByPk(profileId);

            if (!patient) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found"
                });
            }

            if (patient.user_id !== loggedInUserId) {
                return res.status(403).json({
                    success: false,
                    message: "You can access only your own account"
                });
            }
        }

        else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role"
            });
        }

        next();

    } catch (error) {
        next(error);
    }
};