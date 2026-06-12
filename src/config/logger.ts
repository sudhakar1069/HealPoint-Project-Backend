import winston from "winston";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    transports: [
        new winston.transports.File({
            filename: `${logDir}/error.log`,
            level: "error",
        }),

        new winston.transports.File({
            filename: `${logDir}/combined.log`,
        }),
    ],

    exceptionHandlers: [
        new winston.transports.File({
            filename: `${logDir}/exceptions.log`,
        }),
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message }) =>
                        `[${timestamp}] ${level}: ${message}`
                )
            ),
        })
    );
}

export default logger;