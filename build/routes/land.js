"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middleware/auth");
const land_1 = require("../controllers/land");
const express_1 = require("express");
const landRouter = (0, express_1.Router)();
landRouter.post("/land", auth_1.auth, land_1.addLand)
    .get("/land/:id", auth_1.auth, land_1.getLand)
    .delete("/land/:id", auth_1.auth, land_1.deleteLand)
    .get("/lands", auth_1.auth, land_1.getLands)
    .get("/all-lands", auth_1.auth, land_1.getAll)
    .get("/land-score", auth_1.auth, land_1.updateScore)
    .get("/popular-lands", auth_1.auth, land_1.getPopularLands)
    .post("/filter-land", auth_1.auth, land_1.filter);
exports.default = landRouter;
