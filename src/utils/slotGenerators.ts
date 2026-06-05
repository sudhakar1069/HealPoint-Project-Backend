export const generateSlots = (startTime: string, endTime: string, slotDuration: number) => {

    const slots = [];
    let current = new Date(`2026-01-01T${startTime}`);
    const end = new Date(`2026-01-01T${endTime}`);
    while (current < end) {
        const slotStart = new Date(current);
        const slotEnd = new Date(current);
        slotEnd.setMinutes(
            slotEnd.getMinutes() + slotDuration
        );
        if (slotEnd > end) {
            break;
        }
        slots.push({
            start_time: slotStart.toTimeString().slice(0, 5),
            end_time: slotEnd.toTimeString().slice(0, 5)
        });
        current = slotEnd;
    }
    return slots;
};