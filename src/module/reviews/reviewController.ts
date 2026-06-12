import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { ReviewRepository } from "./reviewRepository.js";
import { ReviewService } from "./reviewService.js";
import { AppointmentRepository } from "../appointments/appointmentRepository.js";

const reviewRepository = new ReviewRepository();
const appointmentRepository = new AppointmentRepository();

const reviewService = new ReviewService(
    reviewRepository,
    appointmentRepository
);

export const addReview = asyncHandler(async (req: Request, res: Response) => {
    const patientId = req.user!.profile_id;
    const { appointmentId, rating, review } = req.body;
    const result = await reviewService.addReview(
        Number(patientId),
        Number(appointmentId),
        Number(rating),
        review
    );

    return res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: result
    });
}
);

export const getDoctorReviews = asyncHandler(
    async (req: Request, res: Response) => {
        const doctorId = Number(req.params.doctorId);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const reviews = await reviewService.getDoctorReviews(doctorId, page, limit);

        return res.status(200).json({
            success: true,
            data: reviews
        });
    }
);