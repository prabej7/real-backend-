import { auth } from "../middleware/auth";
import { addHostel, deleteHostel, filter, getAll, getHostel, getHostels } from "../controllers/hostel";
import { Router } from "express";

const hostelRouter = Router();

hostelRouter.post("/hostel", auth, addHostel)
    .get("/hostel/:id", auth, getHostel)
    .get("/hostels", auth, getHostels)
    .get("/all-hostels", auth, getAll)
    .post("/filter-hostel", auth, filter)
    .delete("/delete-hostel/:id", auth, deleteHostel);
    
export default hostelRouter;