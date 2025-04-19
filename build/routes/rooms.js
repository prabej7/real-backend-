"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_1 = require("../controllers/room");
const auth_1 = require("../middleware/auth");
const roomRouter = (0, express_1.Router)();
roomRouter.post("/room", auth_1.auth, room_1.addRoom)
    .get("/room/:id", auth_1.auth, room_1.getRoom)
    .delete("/room/:id", auth_1.auth, room_1.deleteRoom)
    .get("/rooms", auth_1.auth, room_1.getRooms)
    .get("/all-rooms", auth_1.auth, room_1.getAll)
    .get("/popular-rooms", auth_1.auth, room_1.getPopularRooms)
    .post("/filter-room", room_1.filter)
    .post("/room-score", auth_1.auth, room_1.updateScore);
exports.default = roomRouter;
