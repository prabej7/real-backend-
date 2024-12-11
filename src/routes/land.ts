import { addLand, deleteLand, getLand, getLands, getAll } from "@/controllers/land";
import { Router } from "express";

const landRouter = Router();

landRouter.post("/api/land", addLand)
    .get("/api/land/:id", getLand)
    .delete("/api/land/:id", deleteLand)
    .get("/api/lands", getLands)
    .get("/api/all-lands", getAll);

export default landRouter;