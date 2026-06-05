import type { NextFunction, Request, Response } from "express";
import DoctorUnavailability from "../models/unavailabilityModel.js";

export const unavailabilityOwnership = async (
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

        const { id: loggedInUserId, role } = req.user;

        if (role === "admin") {
            return next();
        }

        if (role !== "doctor") {
            return res.status(403).json({
                success: false,
                message: "Only doctors can modify unavailability"
            });
        }

        const unavailabilityId = Number(req.params.id);
        const unavailability = await DoctorUnavailability.findByPk(
            unavailabilityId,
            {
                include: ["doctor"]
            }
        );

        if (!unavailability) {
            return res.status(404).json({
                success: false,
                message: "Unavailability not found"
            });
        }

        const doctor = unavailability.doctor;

        if (!doctor || doctor.user_id !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "You can modify only your own unavailability"
            });
        }
        next();

    } catch (error) {
        next(error);
    }
};