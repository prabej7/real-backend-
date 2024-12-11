"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stats_1 = require("../controllers/stats");
const express_1 = require("express");
const statsRouter = (0, express_1.Router)();
statsRouter.get("/stats/count", stats_1.getCounts).get("/stats/users", stats_1.getMonthlyUser);
exports.default = statsRouter;
