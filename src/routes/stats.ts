import { auth } from "src/middleware/auth";
import { getCounts, getMonthlyUser } from "../controllers/stats";
import { Router } from "express";

const statsRouter = Router();

statsRouter.get("/stats/count", auth, getCounts).get("/stats/users", auth, getMonthlyUser);

export default statsRouter;