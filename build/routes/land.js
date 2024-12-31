"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const land_1 = require("../controllers/land");
const express_1 = require("express");
const landRouter = (0, express_1.Router)();
landRouter.post("/land", land_1.addLand)
    .get("/land/:id", land_1.getLand)
    .delete("/land/:id", land_1.deleteLand)
    .get("/lands", land_1.getLands)
    .get("/all-lands", land_1.getAll)
    .post("/filter-land", land_1.filter);
exports.default = landRouter;
