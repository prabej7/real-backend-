import { addHostel, deleteHostel, getAll, getHostel, getHostels } from "@/controllers/hostel";
import { Router } from "express";

const hostelRouter = Router();

hostelRouter.post("/hostel", addHostel)
    .get("/api/hostel/:id", getHostel)
    .get("/api/hostels", getHostels)
    .get("/api/all-hostels", getAll);

hostelRouter.delete("/delete-hostel/:id", deleteHostel)
export default hostelRouter;