import type { NextFunction, Request, Response } from "express";
import DoctorAvailability from "../models/availabilityModel.js";
export const availabilityOwnership = async (
    req: any,
    res: Response,
    next: NextFunction) => {
    try {
        const loggedInUserId = req.user.id;
        const role = req.user.role;
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
        const availability = await DoctorAvailability.findByPk(availabilityId,
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
        const doctor: any = (availability as any).doctor;
        if (doctor.user_id !== loggedInUserId) {
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