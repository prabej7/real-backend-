"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const room_1 = require("../controllers/room");
const roomRouter = (0, express_1.Router)();
roomRouter.post("/room", room_1.addRoom)
    .get("/room/:id", room_1.getRoom)
    .delete("/room/:id", room_1.deleteRoom)
    .get("/rooms", room_1.getRooms)
    .get("/all-rooms", room_1.getAll);
exports.default = roomRouter;
