import { Router } from "express";
import {
    addRoom,
    deleteRoom,
    getAll,
    getRoom,
    getRooms,
    filter
} from "../controllers/room";

const roomRouter = Router()

roomRouter.post("/room", addRoom)
    .get("/room/:id", getRoom)
    .delete("/room/:id", deleteRoom)
    .get("/rooms", getRooms)
    .get("/all-rooms", getAll)

roomRouter.post("/filter-room", filter);

export default roomRouter;