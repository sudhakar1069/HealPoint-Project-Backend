import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface AppointmentAttributes {
    id?: number;
    doctor_id: number;
    patient_id: number;
    appointment_date: string;
    start_time: string;
    end_time: string;
    consultation_type: string;
    reason?: string;
    status: "pending_payment" | "confirmed" | "cancelled" | "completed";
    payment_expires_at: Date | null;
    meeting_room?: string | null;
    consultation_status?: "scheduled" | "ongoing" | "completed" | "missed";
    consultation_started_at?: Date | null;
    consultation_ended_at?: Date | null;
    review_given?: boolean;
    reminder_sent?: boolean;
}

export interface AppointmentCreationAttributes
    extends Optional<AppointmentAttributes, "id" | "status" | "payment_expires_at"> { }

class Appointment extends Model<
    AppointmentAttributes,
    AppointmentCreationAttributes
> implements AppointmentAttributes {

    declare id: number;
    declare doctor_id: number;
    declare patient_id: number;
    declare appointment_date: string;
    declare start_time: string;
    declare end_time: string;
    declare consultation_type: string;
    declare reason?: string;
    declare status: "pending_payment" | "confirmed" | "cancelled" | "completed";
    declare payment_expires_at: Date | null;
    declare meeting_room?: string | null;
    declare consultation_status?: "scheduled" | "ongoing" | "completed" | "missed";
    declare consultation_started_at?: Date | null;
    declare consultation_ended_at?: Date | null;
    declare review_given?: boolean;
    declare reminder_sent?: boolean;
}

Appointment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        doctor_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "doctors",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        patient_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "patients",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        appointment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        start_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },

        end_time: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        consultation_type: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                "pending_payment",
                "confirmed",
                "cancelled",
                "completed"
            ),
            allowNull: false,
            defaultValue: "pending_payment",
        },
        payment_expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        meeting_room: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        consultation_status: {
            type: DataTypes.ENUM(
                "scheduled",
                "ongoing",
                "completed",
                "missed",
            ),
            allowNull: false,
            defaultValue: "scheduled"
        },
        consultation_started_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        consultation_ended_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        review_given: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        reminder_sent: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    },
    {
        sequelize,
        tableName: "appointments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: []
    }
);

export default Appointment;