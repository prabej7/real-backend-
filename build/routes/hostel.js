"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hostel_1 = require("../controllers/hostel");
const express_1 = require("express");
const hostelRouter = (0, express_1.Router)();
hostelRouter.post("/hostel", hostel_1.addHostel)
    .get("/hostel/:id", hostel_1.getHostel)
    .get("/hostels", hostel_1.getHostels)
    .get("/all-hostels", hostel_1.getAll)
    .post("/filter-hostel", hostel_1.filter);
hostelRouter.delete("/delete-hostel/:id", hostel_1.deleteHostel);
exports.default = hostelRouter;
