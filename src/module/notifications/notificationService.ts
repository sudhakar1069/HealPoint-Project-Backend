import { NotificationRepository } from "./notificationRepository.js";

export class NotificationService {

    constructor(private notificationRepository: NotificationRepository) { }

    async addDoctorNotification(doctorName: string,specialization:string) {
        return await this.notificationRepository.createNotification({
            title: "New Doctor Added",
            message: `Dr. ${doctorName} - ${specialization} joined HealPoint.`,
            type: "doctor",
        });
    }

    async addDepartmentNotification(department: string) {
        return await this.notificationRepository.createNotification({
            title: "New Specialization Added",
            message: `${department} Department is now available.`,
            type: "specialization",
        });
    }

    async getAllNotifications(page: number, limit: number) {
        return await this.notificationRepository.getNotifications(
            page,
            limit
        );
    }

    async readNotifications() {
        return await this.notificationRepository.markAllRead();
    }
}