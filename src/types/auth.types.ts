export interface JwtUserPayload {
    id: number;
    role: "admin" | "doctor" | "patient";
    profile_id: number | null;
}