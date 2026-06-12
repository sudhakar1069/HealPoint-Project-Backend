import { AppointmentRepository } from "../appointments/appointmentRepository.js";
import { ReviewRepository } from "./reviewRepository.js";

export class ReviewService {

    constructor(
        private reviewRepository: ReviewRepository,
        private appointmentRepository: AppointmentRepository
    ) { }

    async addReview(
        patient_id: number,
        appointment_id: number,
        rating: number,
        review?: string
    ) {
        const appointment = await this.appointmentRepository.getAppointmentById(appointment_id);

        if (!appointment)
            throw new Error("Appointment not found");

        if (appointment.patient_id !== patient_id)
            throw new Error(
                "You can review only your own appointments"
            );

        if (appointment.status !== "completed")
            throw new Error(
                "Review can only be submitted after appointment completion"
            );

        if (appointment.review_given)
            throw new Error(
                "Review already submitted"
            );

        if (rating < 1 || rating > 5)
            throw new Error(
                "Rating must be between 1 and 5"
            );

        const reviewData = {
            appointment_id: appointment.id,
            doctor_id: appointment.doctor_id,
            patient_id: patient_id,
            rating,
            ...(review !== undefined && { review })
        };

        const createdReview = await this.reviewRepository.createReview(reviewData);
        await appointment.update({ review_given: true });
        return createdReview;
    }

    async getDoctorReviews(doctorId: number, page: number, limit: number) {
        const result = await this.reviewRepository.findByDoctorId(doctorId, page, limit);
        return {
            count: result.count,
            rows: result.rows.map((review:any) => ({
                id: review.id,
                rating: review.rating,
                review: review.review,
                patientName: review.patient?.user?.name,
                createdAt: review.created_at
            }))
        };
    }

    async getReviewByAppointment(appointmentId: number) {
        const review = await this.reviewRepository.findByAppointmentId(appointmentId);
        if (!review)
            throw new Error("Review not found");
        return review;
    }
}