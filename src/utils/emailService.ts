import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailService {
    private async sendEmail(
        to: string,
        subject: string,
        html: string
    ) {
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM!,
            to,
            subject,
            html,
        });

        if (error) {
            throw new Error(error.message);
        }
    }

    async sendWelcomeEmail(email: string, name: string) {
        await this.sendEmail(
            email,
            "Welcome to HealPoint",
            `
            <h2>Welcome to HealPoint, ${name}!</h2>

            <p>Your account has been created successfully.</p>

            <p>You can now log in and book appointments with doctors.</p>

            <p>Thank you for choosing HealPoint.</p>
            `
        );
    }

    async sendPasswordResetOtp(email: string, otp: string) {
        await this.sendEmail(
            email,
            "Password Reset OTP",
            `
            <h2>Password Reset OTP</h2>

            <h1>${otp}</h1>

            <p>Expires in 15 minutes</p>
            `
        );
    }

    async sendAppointmentConfirmationEmail(
        email: string,
        patientName: string,
        doctorName: string,
        appointmentDate: string,
        appointmentTime: string,
        consultationType: string,
    ) {
        await this.sendEmail(
            email,
            "Appointment Confirmed",
            `
            <h2>Appointment Confirmed!!!</h2>

            <p>Hello ${patientName},</p>

            <p>Your appointment has been successfully booked.</p>

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

            <p>You can join 10 minutes before your scheduled time!</p>

            <p>Thank you for choosing HealPoint.</p>
            `
        );
    }

    async sendAppointmentReminderEmail(
        email: string,
        patientName: string,
        doctorName: string,
        appointmentDate: string,
        appointmentTime: string,
        meetingRoom: string
    ) {
        await this.sendEmail(
            email,
            "Appointment Reminder - Starts in 10 Minutes",
            `
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
                        <a href="https://meet.jit.si/${meetingRoom}">
                            Join Consultation
                        </a>
                    </td>
                </tr>
            </table>

            <p>Please join on time.</p>
            `
        );
    }

    async sendAppointmentCancellationEmail(
    email: string,
    patientName: string,
    doctorName: string,
    appointmentDate: string,
    appointmentTime: string
) {
    await this.sendEmail(
        email,
        "Appointment Cancelled",
        `
        <h2>Appointment Cancelled</h2>

        <p>Hello ${patientName},</p>

        <p>
            We sincerely apologize for the inconvenience.
        </p>

        <p>
            Unfortunately, your appointment with
            <strong>Dr. ${doctorName}</strong>
            has been cancelled due to the doctor's unavailability.
        </p>

        <table
            border="1"
            cellpadding="10"
            cellspacing="0"
            style="border-collapse: collapse;"
        >
            <tr>
                <td><strong>Doctor</strong></td>
                <td>Dr. ${doctorName}</td>
            </tr>

            <tr>
                <td><strong>Date</strong></td>
                <td>${appointmentDate}</td>
            </tr>

            <tr>
                <td><strong>Time</strong></td>
                <td>${appointmentTime}</td>
            </tr>
        </table>

        <p>
            We kindly request you to log in to HealPoint and check the doctor's
            available slots to book another appointment at your convenience.
        </p>

        <p>
            If you have already completed the payment, your refund will be
            processed shortly.
        </p>

        <p>
            We truly appreciate your patience and understanding, and we apologize
            once again for the inconvenience caused.
        </p>

        <p>
            Thank you for choosing HealPoint.
        </p>
        `
    );
}
}