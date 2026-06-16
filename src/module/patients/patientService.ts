import bcrypt from "bcrypt";
import { sequelize } from "../../config/db.js";
import { PatientRepository } from "./patientRepository.js";

export class PatientService {
    constructor(private patientRepository: PatientRepository) { }
    async getAllPatients(
        page: number = 1,
        limit: number = 10,
        filters: any = {}
    ) {
        const filterData = {
            search: filters.search || undefined,
            gender: filters.gender || undefined,
            blood_group: filters.blood_group || undefined,
            is_active: filters.is_active !== undefined
                ? filters.is_active === "true" || filters.is_active === true : undefined
        };

        const result = await this.patientRepository.getAllPatients(
            page,
            limit,
            filterData
        );

        return {
            total: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            patients: result.rows
        };
    }

    async getPatientById(id: number) {
        const patient = await this.patientRepository.getPatientById(id);
        if (!patient) {
            throw new Error("Patient not found");
        }
        return patient;
    }

    async updatePatient(id: number, data: any) {
        const transaction = await sequelize.transaction();
        try {
            const existingPatient = await this.patientRepository.getPatientById(id);
            if (!existingPatient) {
                throw new Error("Patient not found");
            }

            if (
                data.name ||
                data.phone_number ||
                data.email ||
                data.gender
            ) {

                await this.patientRepository.updateUser(existingPatient.user_id,
                    {
                        name: data.name,
                        phone_number: data.phone_number,
                        email: data.email,
                        gender: data.gender,
                    },
                    transaction
                );
            }

            if (data.password) {
                const hashedPassword = await bcrypt.hash(data.password, 10);
                await this.patientRepository.updateUser(existingPatient.user_id,
                    {
                        password: hashedPassword
                    },
                    transaction
                );
            }

            await this.patientRepository.updatePatient(id,
                {
                    dob: data.dob,
                    age: data.age,
                    blood_group: data.blood_group,
                    address: data.address,
                },
                transaction
            );
            await transaction.commit();
            const updatedPatient = await this.patientRepository.getPatientById(id)
            return { patient: updatedPatient };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updatePatientPhoto(
        patientId: number,
        loggedInUserId: number,
        imageUrl: string
    ) {
        const patient = await this.patientRepository.getPatientById(patientId);
        if (!patient) { throw new Error("Patient not found"); }
        if (patient.user_id !== loggedInUserId) {
            throw new Error("You can update only your own profile");
        }
        await this.patientRepository.updateUser(
            patient.user_id,
            {
                profile_picture: imageUrl
            },
            null
        );
        return {
            profile_picture: imageUrl
        };
    }

    async getMyPatientProfile(userId: number) {
        const patient = await this.patientRepository.getPatientByUserId(userId);
        if (!patient) {
            throw new Error("Patient profile not found");
        }
        return patient;
    }
    async updateMyPatientProfile(userId: number, data: any) {
        const patient = await this.patientRepository.getPatientByUserId(userId);
        if (!patient) {
            throw new Error("Patient not found");
        }

        return await this.updatePatient(patient.id, data);
    }
    async updateMyPatientPhoto(userId: number, filename: string) {

        const patient = await this.patientRepository.getPatientByUserId(userId);
        if (!patient) {
            throw new Error("Patient not found");
        }
        await this.patientRepository.updateUser(
            patient.user_id,
            {
                profile_picture: filename
            },
            null
        );
        return {
            profile_picture: filename
        };
    }

    async deletePatient(id: number) {
        const transaction = await sequelize.transaction();
        try {
            const patient = await this.patientRepository.getPatientById(id);

            if (!patient) {
                throw new Error("Patient not found");
            }
            await this.patientRepository.deletePatient(id, transaction);
            await this.patientRepository.deleteUser(
                patient.user_id,
                transaction
            );
            await transaction.commit();
            return {
                message: "Patient deleted successfully"
            };

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}