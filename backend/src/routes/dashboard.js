const express = require('express');
const router = express.Router();
const DashboardController = require('../app/controller/DashboardController');

router.get("/stats", DashboardController.getDashboardStats);
router.get("/chart", DashboardController.getRevenueChart);
router.get("/activities", DashboardController.getRecentActivities);
router.get("/today-revenue", DashboardController.getTodayRevenue);

module.exports = router;
