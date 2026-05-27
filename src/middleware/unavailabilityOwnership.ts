import type {
    NextFunction,
    Request,
    Response
} from "express";

import DoctorUnavailability from "../models/unavailabilityModel.js";

export const unavailabilityOwnership = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const loggedInUserId = req.user.id;
        const role = req.user.role;

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
        const doctor: any = (unavailability as any).doctor;
        if (doctor.user_id !== loggedInUserId) {
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