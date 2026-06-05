import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

export interface PaymentAttributes {
    id?: number;
    appointment_id: number;
    amount: number;
    razorpay_order_id: string;
    razorpay_payment_id?: string | null;
    razorpay_signature?: string | null;
    status: | "created" | "paid" | "failed" | "refunded";
    created_at?: Date;
    updated_at?: Date;
}

export interface PaymentCreationAttributes
    extends Optional<
        PaymentAttributes,
        | "id"
        | "razorpay_payment_id"
        | "razorpay_signature"
        | "status"
    > { }

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    declare id: number;
    declare appointment_id: number;
    declare amount: number;
    declare razorpay_order_id: string;
    declare razorpay_payment_id: string | null;
    declare razorpay_signature: string | null;
    declare created_at: Date;
    declare updated_at: Date;
    declare status:
        | "created"
        | "paid"
        | "failed"
        | "refunded";
}

Payment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "appointments",
                key: "id",
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        razorpay_order_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        razorpay_payment_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        razorpay_signature: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM(
                "created",
                "paid",
                "failed",
                "refunded"
            ),
            defaultValue: "created",
        },
    },
    {
        sequelize,
        tableName: "payments",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

export default Payment;