import { auth } from "../middleware/auth";
import {
    addLand,
    deleteLand,
    getLand,
    getLands,
    getAll,
    filter,
    updateScore,
    getPopularLands
} from "../controllers/land";
import { Router } from "express";

const landRouter = Router();

landRouter.post("/land", auth, addLand)
    .get("/land/:id", auth, getLand)
    .delete("/land/:id", auth, deleteLand)
    .get("/lands", auth, getLands)
    .get("/all-lands", auth, getAll)
    .get("/land-score", auth, updateScore)
    .get("/popular-lands", auth, getPopularLands)
    .post("/filter-land", auth, filter);

export default landRouter;