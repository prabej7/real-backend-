import { Router } from "express";
import { addRoom, deleteRoom, getAll, getRoom, getRooms } from "@/controllers/room";

const roomRouter = Router()

roomRouter.post("/room", addRoom)
    .get("/api/room/:id", getRoom)
    .delete("/api/room/:id", deleteRoom)
    .get("/api/rooms", getRooms)
    .get("/api/all-rooms", getAll);

export default roomRouter;