import jwt from "jsonwebtoken";

interface JwtPayload {
    id: number;
    role?: string;
    profile_id?: number | null;
}
export const generateAccessToken = (user: JwtPayload): string => {
    return jwt.sign(
        { id: user.id, role: user.role, profile_id: user.profile_id },
        process.env.JWT_SECRET!,
        {
            expiresIn: "45m",
        }
    );
};
export const generateRefreshToken = (user: JwtPayload): string => {
    return jwt.sign(
        { id: user.id, role: user.role, profile_id: user.profile_id },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d",
        }
    );
};