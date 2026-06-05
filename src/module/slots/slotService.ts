import { DoctorRepository } from "../doctors/doctorRepository.js";
import { SlotRepository } from "./slotRepository.js";
import { generateSlots } from "../../utils/slotGenerators.js";
import type { DoctorSlot } from "../../types/slot.types.js";

export class SlotService {
    constructor(
        private slotRepository: SlotRepository,
        private doctorRepository: DoctorRepository
    ) { }

    private getDayOfWeek(date: string): string {
        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];

        return days[new Date(date).getDay()]!;
    }

    private isTimeOverlapping(
        slotStart: string,
        slotEnd: string,
        blockStart: string,
        blockEnd: string
    ): boolean {
        const toMinutes = (time: string) => {
            const [hours, minutes] = time.split(":");
            return Number(hours) * 60 + Number(minutes);
        };

        const slotStartMin = toMinutes(slotStart);
        const slotEndMin = toMinutes(slotEnd);
        const blockStartMin = toMinutes(blockStart);
        const blockEndMin = toMinutes(blockEnd);

        return slotStartMin < blockEndMin && slotEndMin > blockStartMin;
    }

    private isPastSlot(
        date: string,
        slotStartTime: string,
        bufferMinutes = 10
    ): boolean {
        const now = new Date();

        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        const selectedDate = new Date(date);

        const selectedDay = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        );

        if (selectedDay < today) {
            return true;
        }

        if (selectedDay > today) {
            return false;
        }

        const bookingCutoff = new Date(now);
        bookingCutoff.setMinutes(
            bookingCutoff.getMinutes() + bufferMinutes
        );

        const slotDateTime = new Date(
            `${date}T${slotStartTime}:00`
        );
        return slotDateTime < bookingCutoff;
    }

    async getDoctorSlots(doctorId: number, date: string) {
        const doctor = await this.doctorRepository.getDoctorById(doctorId);

        if (!doctor) {
            throw new Error("Doctor not found");
        }

        // const today = new Date();
        // today.setHours(0, 0, 0, 0);

        // const selectedDate = new Date(date);
        // selectedDate.setHours(0, 0, 0, 0);

        // if (selectedDate < today) {
        //     return [];
        // }

        const dayOfWeek = this.getDayOfWeek(date);

        const weeklyAvailability = await this.slotRepository.getWeeklyAvailability(
            doctorId,
            dayOfWeek
        );

        const weeklyData = weeklyAvailability[0];

        const specialAvailabilities =
            await this.slotRepository.getSpecialAvailability(doctorId, date);

        const availabilities = specialAvailabilities.length > 0
            ? specialAvailabilities
            : weeklyAvailability;

        if (availabilities.length === 0) {
            return [];
        }

        const unavailabilities = await this.slotRepository.getUnavailability(
            doctorId,
            date
        );

        const bookedAppointments = await this.slotRepository.getBookedAppointments(
            doctorId,
            date
        );

        const finalSlots: DoctorSlot[] = [];

        for (const availability of availabilities) {
            if (
                !availability.start_time ||
                !availability.end_time ||
                !availability.slot_duration
            ) {
                continue;
            }

            const generatedSlots = generateSlots(
                availability.start_time,
                availability.end_time,
                availability.slot_duration
            );

            for (const slot of generatedSlots) {
                let status: "available" | "booked" | "unavailable" = "available";

                const isBooked = bookedAppointments.some((appointment) => {
                    if (!appointment.start_time || !appointment.end_time) {
                        return false;
                    }

                    return this.isTimeOverlapping(
                        slot.start_time,
                        slot.end_time,
                        appointment.start_time,
                        appointment.end_time
                    );
                });

                if (isBooked) {
                    status = "booked";
                }

                if (
                    status === "available" &&
                    this.isPastSlot(date, slot.start_time)
                ) {
                    status = "unavailable";
                }

                if (
                    status === "available" &&
                    weeklyData?.break_start &&
                    weeklyData?.break_end
                ) {
                    const isBreakOverlap = this.isTimeOverlapping(
                        slot.start_time,
                        slot.end_time,
                        String(weeklyData.break_start),
                        String(weeklyData.break_end)
                    );

                    if (isBreakOverlap) {
                        continue;
                    }
                }

                if (status === "available") {
                    for (const unavailability of unavailabilities) {
                        if (unavailability.is_full_day) {
                            status = "unavailable";
                            break;
                        }

                        if (!unavailability.start_time || !unavailability.end_time) {
                            continue;
                        }

                        const isUnavailableOverlap = this.isTimeOverlapping(
                            slot.start_time,
                            slot.end_time,
                            unavailability.start_time,
                            unavailability.end_time
                        );

                        if (isUnavailableOverlap) {
                            status = "unavailable";
                            break;
                        }
                    }
                }

                finalSlots.push({ ...slot, status });
            }
        }

        return finalSlots;
    }
}