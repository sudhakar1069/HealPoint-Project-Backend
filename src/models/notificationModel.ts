import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface NotificationAttributes {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
}

interface NotificationCreation
    extends Optional<NotificationAttributes, "id" | "is_read"> { }

export class Notification extends Model<NotificationAttributes, NotificationCreation>

    implements NotificationAttributes {
    declare id: number;
    declare title: string;
    declare message: string;
    declare type: string;
    declare is_read: boolean;

}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        is_read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,

        },
    },

    {
        sequelize,
        tableName: "notifications",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",

    }

);
