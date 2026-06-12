export const generateMeetingRoom =
    (doctorId: number, patientId: number): string => {
        return `doctor-${doctorId}-patient-${patientId}-${Date.now()}`;
    };