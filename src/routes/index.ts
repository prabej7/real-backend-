import userRoutes from "./user";
import roomRouter from "./rooms"
import { Router } from "express";
import otpRouter from "./otp"
import hostelRouter from "./hostel";
import landRouter from "./land";
import statsRouter from "./stats";

const router = Router();

router.use(userRoutes);
router.use(roomRouter);
router.use(hostelRouter);
router.use(landRouter);
router.use(otpRouter);
router.use(statsRouter);

export default router;