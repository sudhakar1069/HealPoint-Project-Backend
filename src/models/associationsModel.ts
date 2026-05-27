import { User } from "./userModel.js";
import Doctor from "./doctorModel.js";
import DoctorAvailability from "./availabilityModel.js";
import DoctorUnAvailability from "./availabilityModel.js";
import Patient from "./patientModel.js";
import DoctorUnavailability from "./unavailabilityModel.js";

User.hasOne(Doctor, {
    foreignKey: "user_id",
    as: "doctorProfile"
});

Doctor.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});

Doctor.hasMany(DoctorAvailability, {
    foreignKey: "doctor_id",
    as: "availabilities"
});

DoctorAvailability.belongsTo(Doctor, {
    foreignKey: "doctor_id",
    as: "doctor"
});

User.hasOne(Patient, {
    foreignKey: "user_id",
    as: "patient",
});

Patient.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});

DoctorUnavailability.belongsTo(Doctor, {
    foreignKey: "doctor_id",
    as: "doctor",
});

Doctor.hasMany(DoctorUnAvailability, {
    foreignKey: "doctor_id",
    as: "unavailabilities",
});