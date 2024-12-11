import { getCounts, getMonthlyUser } from "@/controllers/stats";
import { Router } from "express";

const statsRouter = Router();

statsRouter.get("/api/stats/count", getCounts).get("/stats/users", getMonthlyUser);

export default statsRouter;