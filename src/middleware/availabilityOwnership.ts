import type { NextFunction, Request, Response } from "express";

import DoctorAvailability from "../models/availabilityModel.js";

export const availabilityOwnership = async (
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
                message: "Only doctors can modify availability"
            });
        }

        const availabilityId = Number(req.params.id);
        const availability = await DoctorAvailability.findByPk(
            availabilityId,
            {
                include: ["doctor"]
            }
        );

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability not found"
            });
        }
        const doctor = availability.doctor;
        if (
            !doctor || doctor.user_id !== loggedInUserId
        ) {
            return res.status(403).json({
                success: false,
                message: "You can modify only your own availability"
            });
        }
        next();

    } catch (error) {
        next(error);
    }
};