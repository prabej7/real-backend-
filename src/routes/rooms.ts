import { Router } from "express";
import {
    addRoom,
    deleteRoom,
    getAll,
    getRoom,
    getRooms,
    filter,
    updateScore,
    getPopularRooms
} from "../controllers/room";
import { auth } from "../middleware/auth";

const roomRouter = Router()

roomRouter.post("/room", auth, addRoom)
    .get("/room/:id", auth, getRoom)
    .delete("/room/:id", auth, deleteRoom)
    .get("/rooms", auth, getRooms)
    .get("/all-rooms", auth, getAll)
    .get("/popular-rooms", auth, getPopularRooms)
    .post("/filter-room", filter)
    .post("/room-score", auth, updateScore)

export default roomRouter;