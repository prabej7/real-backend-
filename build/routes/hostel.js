"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("src/middleware/auth");
const hostel_1 = require("../controllers/hostel");
const express_1 = require("express");
const hostelRouter = (0, express_1.Router)();
hostelRouter.post("/hostel", auth_1.auth, hostel_1.addHostel)
    .get("/hostel/:id", auth_1.auth, hostel_1.getHostel)
    .get("/hostels", auth_1.auth, hostel_1.getHostels)
    .get("/all-hostels", auth_1.auth, hostel_1.getAll)
    .post("/filter-hostel", auth_1.auth, hostel_1.filter)
    .delete("/delete-hostel/:id", auth_1.auth, hostel_1.deleteHostel);
exports.default = hostelRouter;
