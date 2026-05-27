
import { Notification } from "../../models/notificationModel.js";

export class NotificationRepository {

    async createNotification(data: any) {
        return await Notification.create(data);
    }

    async getNotifications(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const result = await Notification.findAndCountAll({
            limit,
            offset,
            order: [["created_at", "DESC"]],
        });

        return {
            total: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            notifications: result.rows,
        };
    }

    async markAllRead() {
        return await Notification.update(
            { is_read: true, },
            { where: { is_read: false, }, }
        );
    }

    async findUnreadNotifications() {
        return await Notification.findAll({
            where: { is_read: false, },
            order: [["created_at", "DESC"]],
        });
    }

    async findById(id: number) {
        return await Notification.findByPk(id);
    }

    async delete(id: number) {
        return await Notification.destroy({
            where: { id },
        });
    }
}