"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const authRouter = (0, express_1.Router)();
authRouter.get("/otp/:email", auth_1.getOtp);
authRouter.post("/verify-otp", auth_1.verifyOtp);
exports.default = authRouter;
