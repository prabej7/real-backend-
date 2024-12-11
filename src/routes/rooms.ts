import { Router } from "express";
import { addRoom, deleteRoom, getAll, getRoom, getRooms } from "../controllers/room";

const roomRouter = Router()

roomRouter.post("/room", addRoom)
    .get("/room/:id", getRoom)
    .delete("/room/:id", deleteRoom)
    .get("/rooms", getRooms)
    .get("/all-rooms", getAll);

export default roomRouter;