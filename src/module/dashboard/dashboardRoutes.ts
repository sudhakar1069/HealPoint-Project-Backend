import express from "express";

import {
    getDashboardSummary,
    getTodayAppointmentsForDashboard,
    getWeeklyLoadForDashboard,
    getMonthlyOverviewForDashboard,
    getAdminAppointmentsOverview,
    getDoctorAvailabilityDashboard,
    getAdminEarningsReport,
    getAdminDashboardOverview
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
    "/admin/dashboard/appointmentsOverview",
    authenticate,
    authorize("admin"),
    getAdminAppointmentsOverview
);

router.get(
    "/admin/doctor-availability-dashboard",
    authenticate,
    authorize("admin"),
    getDoctorAvailabilityDashboard
);

router.get(
    "/admin/dashboard/earnings-report",
    authenticate,
    authorize("admin"),
    getAdminEarningsReport
);

router.get(
    "/admin/dashboard-overview",
    authenticate,
    authorize("admin"),
    getAdminDashboardOverview
);

export default router;