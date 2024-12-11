import { Router } from "express";
import { getOtp, verifyOtp } from "../controllers/auth";

const authRouter = Router();

authRouter.get("/api/otp/:email", getOtp);
authRouter.post("/api/verify-otp", verifyOtp);

export default authRouter;