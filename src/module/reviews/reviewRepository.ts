import Review, { type ReviewCreationAttributes } from "../../models/reviewModel.js";
import { fn, col } from "sequelize";
import Patient from "../../models/patientModel.js";
import User from "../../models/userModel.js";
export class ReviewRepository {

    async createReview(data: ReviewCreationAttributes) {
        return await Review.create(data);
    }

    async findByAppointmentId(appointmentId: number) {
        return await Review.findOne({
            where: { appointment_id: appointmentId }
        });
    }

    async findByDoctorId(doctorId: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        return await Review.findAndCountAll({
            where: { doctor_id: doctorId },
            include: [
                {
                    model: Patient,
                    as: "patient",
                    attributes: ["id"],
                    include: [
                        {
                            model: User,
                            as: "user",
                            attributes: ["name"]
                        }
                    ]
                }
            ],
            order: [
                ["created_at", "DESC"]
            ],
            limit,
            offset
        });
    }

    async getAverageRating(doctorId: number) {
        const result: any = await Review.findOne({
            attributes: [[fn("AVG", col("rating")), "averageRating"]],
            where: {
                doctor_id: doctorId
            },
            raw: true
        });
        return Number(
            result?.averageRating || 0
        );
    }
}