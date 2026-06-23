import type { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.js";

export const errorHandler = (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction
) => {

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        status: err.status || 500
    });

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
};