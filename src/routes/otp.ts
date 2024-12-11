import { Router } from "express";
import { getOtp, verifyOtp } from "../controllers/auth";

const authRouter = Router();

authRouter.get("/otp/:email", getOtp);
authRouter.post("/verify-otp", verifyOtp);

export default authRouter;