import type { NextFunction, Response } from "express";
import Doctor from "../models/doctorModel.js";
import Patient from "../models/patientModel.js";

export const OwnerShip = async (req: any, res: Response, next: NextFunction) => {
    try {
        const loggedInUserId = req.user.id;
        const role = req.user.role;
        const profileId = Number(req.params.id);
        if (role === "admin") {
            return next();
        }
        let profile: any = null;
        if (role === "doctor") {
            profile = await Doctor.findByPk(profileId);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Doctor not found"
                });
            }
        }
        else if (role === "patient") {
            profile = await Patient.findByPk(profileId);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Patient not found"
                });
            }
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Unauthorized role"
            });
        }
        if (profile.user_id !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "You can access only your own account"
            });
        }
        next();
    } catch (error) {
        next(error);
    }
};