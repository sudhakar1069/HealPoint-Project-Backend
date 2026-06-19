import type { NextFunction, Request, Response } from "express";
import SpecialAvailability from "../models/specialAvailabilityModel.js";

export const specialAvailabilityOwnership = async (
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

        if (role !== "doctor") {
            return res.status(403).json({
                success: false,
                message: "Only doctors can modify special availability"
            });
        }

        const specialAvailabilityId = Number(req.params.id);

        const specialAvailability = await SpecialAvailability.findByPk(
            specialAvailabilityId,
            {
                include: ["doctor"]
            }
        );

        if (!specialAvailability) {
            return res.status(404).json({
                success: false,
                message: "Special availability not found"
            });
        }

        const doctor = specialAvailability.doctor;

        if (!doctor || doctor.user_id !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "You can modify only your own special availability"
            });
        }

        next();

    } catch (error) {
        next(error);
    }
};
