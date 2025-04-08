import { Router } from "express";
import {
    addRoom,
    deleteRoom,
    getAll,
    getRoom,
    getRooms,
    filter
} from "../controllers/room";
import { auth } from "src/middleware/auth";

const roomRouter = Router()

roomRouter.post("/room",auth, addRoom)
    .get("/room/:id",auth, getRoom)
    .delete("/room/:id",auth, deleteRoom)
    .get("/rooms",auth, getRooms)
    .get("/all-rooms",auth, getAll)

roomRouter.post("/filter-room", filter);

export default roomRouter;