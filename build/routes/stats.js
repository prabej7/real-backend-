"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("src/middleware/auth");
const stats_1 = require("../controllers/stats");
const express_1 = require("express");
const statsRouter = (0, express_1.Router)();
statsRouter.get("/stats/count", auth_1.auth, stats_1.getCounts).get("/stats/users", auth_1.auth, stats_1.getMonthlyUser);
exports.default = statsRouter;
