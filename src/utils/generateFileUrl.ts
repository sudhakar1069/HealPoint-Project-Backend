import type { Request } from "express";
export const generateFileUrl = (req: Request, filename?: string | null) => {
    if (!filename) return null;
    return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};