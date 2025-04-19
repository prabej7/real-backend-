import { auth } from "../middleware/auth";
import {
    addHostel,
    deleteHostel,
    filter,
    getAll,
    getHostel,
    getHostels,
    getPopularHostels,
    updateScore
} from "../controllers/hostel";
import { Router } from "express";

const hostelRouter = Router();

hostelRouter.post("/hostel", auth, addHostel)
    .get("/hostel/:id", auth, getHostel)
    .get("/hostels", auth, getHostels)
    .get("/all-hostels", auth, getAll)
    .get("/hostel-score", auth, updateScore)
    .get("/popular-hostels", auth, getPopularHostels)
    .post("/filter-hostel", auth, filter)
    .delete("/delete-hostel/:id", auth, deleteHostel);

export default hostelRouter;