import { addLand, deleteLand, getLand, getLands, getAll } from "../controllers/land";
import { Router } from "express";

const landRouter = Router();

landRouter.post("/land", addLand)
    .get("/land/:id", getLand)
    .delete("/land/:id", deleteLand)
    .get("/lands", getLands)
    .get("/all-lands", getAll);

export default landRouter;