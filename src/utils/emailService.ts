import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export class EmailService {
    async sendWelcomeEmail(email: string, name: string) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to HealPoint",
            html: `
            <h2>
                Welcome to HealPoint, ${name}!
            </h2>

            <p>
                Your account has been created successfully.
            </p>

            <p>
                You can now log in and book appointments with doctors.
            </p>

            <p>
                Thank you for choosing HealPoint.
            </p>
        `
        });
    }

    async sendPasswordResetOtp(email: string, otp: string) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            html: `
            <h2>Password Reset OTP</h2>
            <h1>${otp}</h1>
            <p>Expires in 15 minutes</p>
        `
        });
    }

    async sendAppointmentConfirmationEmail(
        email: string,
        patientName: string,
        doctorName: string,
        appointmentDate: string,
        appointmentTime: string,
        consultationType: string,
    ) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Appointment Confirmed",
            html: `
            <h2>
                Appointment Confirmed!!!
            </h2>

            <p>
                Hello ${patientName},
            </p>

            <p>
                Your appointment has been successfully booked.
            </p>

            <table
                border="1"
                cellpadding="10"
                cellspacing="0"
                style="border-collapse: collapse;"
            >
                <tr>
                    <td><strong>Doctor</strong></td>
                    <td>${doctorName}</td>
                </tr>

                <tr>
                    <td><strong>Date</strong></td>
                    <td>${appointmentDate}</td>
                </tr>

                <tr>
                    <td><strong>Time</strong></td>
                    <td>${appointmentTime}</td>
                </tr>

                <tr>
                    <td><strong>Consultation Type</strong></td>
                    <td>${consultationType}</td>
                </tr>

            </table>

            <p>
                You can join 10 min before your scheduled time!
            </p>

            <p>
                Thank you for choosing HealPoint.
            </p>
        `
        });
    }

    async sendAppointmentReminderEmail(
        email: string,
        patientName: string,
        doctorName: string,
        appointmentDate: string,
        appointmentTime: string,
        meetingRoom: string
    ) {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Appointment Reminder - Starts in 10 Minutes",
            html: `
            <h2>Appointment Reminder</h2>

            <p>Hello ${patientName},</p>

            <p>
                Your appointment with
                <strong>Dr. ${doctorName}</strong>
                will begin in 10 minutes.
            </p>

            <table
                border="1"
                cellpadding="10"
                cellspacing="0"
                style="border-collapse: collapse;"
            >
                <tr>
                    <td><strong>Date</strong></td>
                    <td>${appointmentDate}</td>
                </tr>

                <tr>
                    <td><strong>Time</strong></td>
                    <td>${appointmentTime}</td>
                </tr>

                <tr>
                    <td><strong>Meeting Link</strong></td>
                    <td>
                        <a href="${meetingRoom}">
                            Join Consultation
                        </a>
                    </td>
                </tr>
            </table>

            <p>Please join on time.</p>
        `
        });
    }
}
