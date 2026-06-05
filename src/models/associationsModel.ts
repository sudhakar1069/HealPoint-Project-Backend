import { User } from "./userModel.js";
import Doctor from "./doctorModel.js";
import DoctorAvailability from "./availabilityModel.js";
import Patient from "./patientModel.js";
import DoctorUnavailability from "./unavailabilityModel.js";
import SpecialAvailability from "./specialAvailabilityModel.js";
import Appointment from "./appointmentModel.js";
import Payment from "./paymentModel.js";

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

Doctor.hasMany(DoctorUnavailability, {
    foreignKey: "doctor_id",
    as: "unavailabilities",
});

SpecialAvailability.belongsTo(Doctor, {
    foreignKey: "doctor_id",
    as: "doctor",
});

Doctor.hasMany(SpecialAvailability, {
    foreignKey: "doctor_id",
    as: "specialAvailabilities",
});
Appointment.hasOne(Payment, {
    foreignKey: "appointment_id",
    as: "payment",
});

Payment.belongsTo(Appointment, {
    foreignKey: "appointment_id",
    as: "appointment",
});
Appointment.belongsTo(Doctor, {
    foreignKey: "doctor_id",
    as: "doctor",
});

Doctor.hasMany(Appointment, {
    foreignKey: "doctor_id",
    as: "appointments",
});

Appointment.belongsTo(Patient, {
    foreignKey: "patient_id",
    as: "patient",
});

Patient.hasMany(Appointment, {
    foreignKey: "patient_id",
    as: "appointments",
});