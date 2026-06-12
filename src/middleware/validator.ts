import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod/v3";
import { ZodError } from "zod/v3";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (err: unknown) {
            if (err instanceof ZodError) {
                return res.status(400).json({
                    message: "Invalid credentials",
                    error: err.issues.map((e) => ({
                        field: e.path[0],
                        message: e.message,
                    })),
                });
            }
            next(err);
        }
    };
};