import express from "express";

import {
    getDashboardSummary,
    getTodayAppointmentsForDashboard,
    getWeeklyLoadForDashboard,
    getMonthlyOverviewForDashboard,
    getAdminDashboard,
    getDoctorAvailabilityDashboard
} from "./dashboardController.js";

import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";

const router = express.Router();

router.get(
    "/doctor/dashboard/summary",
    authenticate,
    authorize("doctor"),
    getDashboardSummary
);

router.get(
    "/doctor/dashboard/today-appointments",
    authenticate,
    authorize("doctor"),
    getTodayAppointmentsForDashboard
);

router.get(
    "/doctor/dashboard/weekly-load",
    authenticate,
    authorize("doctor"),
    getWeeklyLoadForDashboard
);

router.get(
    "/doctor/dashboard/monthly-overview",
    authenticate,
    authorize("doctor"),
    getMonthlyOverviewForDashboard
);

router.get(
    "/admin/dashboard",
    authenticate,
    authorize("admin"),
    getAdminDashboard
);

router.get(
    "/admin/doctor-availability-dashboard",
    authenticate,
    authorize("admin"),
    getDoctorAvailabilityDashboard
);
export default router;