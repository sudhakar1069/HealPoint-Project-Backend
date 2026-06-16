import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { SlotRepository } from "./slotRepository.js";
import { SlotService } from "./slotService.js";
import { DoctorRepository } from "../doctors/doctorRepository.js";

const slotRepository = new SlotRepository();
const doctorRepository = new DoctorRepository();
const slotService = new SlotService(slotRepository, doctorRepository);

export const getDoctorSlots = asyncHandler(async (req: Request, res: Response) => {
    const doctorId = Number(req.params.doctorId);
    const date = req.query.date as string;

    if (!date) {
        throw new Error("Date is required");
    }
    const result = await slotService.getDoctorSlots(doctorId, date);
    return res.status(200).json({
        success: true,
        data: result
    });
}
);