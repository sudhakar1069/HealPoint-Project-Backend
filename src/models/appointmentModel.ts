    import { DataTypes, Model, type Optional } from "sequelize";
    import { sequelize } from "../config/db.js";

    interface AppointmentAttributes {
        id?: number;
        doctor_id: number;
        patient_id: number;
        appointment_date: string;
        start_time: string;
        end_time: string;
        status: "pending" | "confirmed" | "completed" | "cancelled";
    }

    interface AppointmentCreationAttributes
        extends Optional<AppointmentAttributes, "id" | "status"> { }

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
        declare status: "pending" | "confirmed" | "completed" | "cancelled";
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

            status: {
                type: DataTypes.ENUM(
                    "pending",
                    "confirmed",
                    "completed",
                    "cancelled"
                ),
                allowNull: false,
                defaultValue: "pending",
            },
        },
        {
            sequelize,
            tableName: "appointments",
            timestamps: true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            indexes: [
                {
                    unique: true,
                    fields: ["doctor_id", "appointment_date", "start_time"],
                    name: "unique_doctor_appointment_slot",
                },
            ],
        }
    );

    export default Appointment;