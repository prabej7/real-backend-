import { addLand, deleteLand, getLand, getLands, getAll, filter } from "../controllers/land";
import { Router } from "express";

const landRouter = Router();

landRouter.post("/land", addLand)
    .get("/land/:id", getLand)
    .delete("/land/:id", deleteLand)
    .get("/lands", getLands)
    .get("/all-lands", getAll)
    .post("/filter-land", filter);

export default landRouter;