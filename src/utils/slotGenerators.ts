export const generateSlots = (startTime: string, endTime: string, slotDuration: number) => {
    const slots = [];
    let start = new Date(`2026-01-01T${startTime}`);
    const end = new Date(`2026-01-01T${endTime}`);
    while (start < end) {
        const slotStart = new Date(start);
        start.setMinutes(start.getMinutes() + slotDuration);
        const slotEnd = new Date(start);
        if (slotEnd <= end) {
            slots.push({
                start_time: slotStart.toTimeString().slice(0, 5),
                end_time: slotEnd.toTimeString().slice(0, 5)
            });
        }
    }
    return slots;
};