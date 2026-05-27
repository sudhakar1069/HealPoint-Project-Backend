import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../config/db.js";

interface SpecializationAttributes {
    id: number;
    name: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface SpecializationCreationAttributes
    extends Optional<SpecializationAttributes, "id" | "description" > { }

export class Specialization
    extends Model<SpecializationAttributes, SpecializationCreationAttributes>
    implements SpecializationAttributes {
    declare id: number;
    declare name: string;
    declare description?: string;
    declare readonly createdAt: Date;
    declare readonly updatedAt: Date;
}

Specialization.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Specialization",
        tableName: "specializations",
        timestamps: true,
    }
);

export default Specialization;