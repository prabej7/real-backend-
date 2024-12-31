import { addHostel, deleteHostel, filter, getAll, getHostel, getHostels } from "../controllers/hostel";
import { Router } from "express";

const hostelRouter = Router();

hostelRouter.post("/hostel", addHostel)
    .get("/hostel/:id", getHostel)
    .get("/hostels", getHostels)
    .get("/all-hostels", getAll)
    .post("/filter-hostel", filter);

hostelRouter.delete("/delete-hostel/:id", deleteHostel)
export default hostelRouter;