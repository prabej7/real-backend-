"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularRooms = exports.updateScore = exports.filter = exports.getAll = exports.getRooms = exports.deleteRoom = exports.getRoom = exports.addRoom = void 0;
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const upload_1 = require("../service/upload");
const delete_1 = __importDefault(require("../service/delete"));
const asyncHandler_middleware_1 = __importDefault(require("../middleware/asyncHandler.middleware"));
exports.addRoom = [
    multer_1.default.array('images', 5),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { noOfRooms, maxPeople, paymentMode, noticePeriod, restrictions, securityDeposit, balcony, flat, furnished, waterFacility, waterTank, wifi, address, lat, lon, price, city, token, } = JSON.parse(req.body.form);
            // Handle file uploads
            const imageUrls = req.files
                ? yield Promise.all(req.files.map((file) => (0, upload_1.uploadFile)(file)))
                : [];
            // Create the room entry
            yield client_1.default.rooms.create({
                data: {
                    balcony,
                    flat,
                    furnished,
                    waterfacility: waterFacility,
                    maxPeople,
                    noOfRooms,
                    noticePeriod: String(noticePeriod),
                    payment: paymentMode,
                    restrictions,
                    securityDeposit,
                    waterTank,
                    wifi,
                    user: {
                        connect: { id: req.user.id },
                    },
                    info: {
                        create: {
                            address,
                            city,
                            lat: String(lat),
                            lon: String(lon),
                            price,
                            imgs: imageUrls,
                        },
                    },
                },
            });
            res.status(201).json({ message: 'Room added successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error.' });
        }
    }),
];
exports.getRoom = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const room = yield client_1.default.rooms.findUnique({
            where: { id },
        });
        res.status(200).json({ message: "Success", room });
    }
    catch (err) {
        if (err.code == "P2025") {
            res.status(404).json({ error: "Room not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
exports.deleteRoom = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        try {
            const room = yield client_1.default.rooms.findUnique({ where: { id }, select: { info: true } });
            yield client_1.default.rooms.delete({
                where: { id }
            });
            yield Promise.all(((room === null || room === void 0 ? void 0 : room.info.imgs) || []).map((img) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, delete_1.default)(img);
            })));
            res.status(200).json({ message: "Room deleted successfully!" });
        }
        catch (error) {
            res.status(404).json({ error: "Failed to delete the room." });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
exports.getRooms = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const rooms = yield client_1.default.rooms.findMany({
        skip,
        take: pageSize,
        where: {
            usersId: req.user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            info: true
        }
    });
    const totalCount = yield client_1.default.rooms.count();
    res.status(200).json({
        data: rooms,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
    });
}));
exports.getAll = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield client_1.default.rooms.findMany({ include: { info: true } });
        res.status(200).json({ rooms });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
exports.filter = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { balcony, flat, furnished, waterfacility, wifi, max, min, noOfRooms } = req.body;
    const rooms = yield client_1.default.rooms.findMany({
        where: {
            flat: Boolean(flat),
            furnished: Boolean(furnished),
            waterfacility: Boolean(waterfacility),
            wifi: Boolean(wifi),
            noOfRooms: Number(noOfRooms),
            balcony: Boolean(balcony),
            info: {
                price: {
                    gte: Number(min),
                    lte: Number(max)
                }
            }
        },
        include: { info: true }
    });
    res.status(200).json({ message: "Success", rooms });
}));
exports.updateScore = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    yield client_1.default.rooms.update({
        where: { id },
        data: { score: { increment: 1 } }
    });
    res.status(200).json({ message: "Score updated successfully!" });
}));
exports.getPopularRooms = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rooms = yield client_1.default.rooms.findMany({ where: { score: { gt: 0 }, }, orderBy: { score: 'desc' }, take: 10 });
    res.status(200).json({ message: "Popular rooms!", rooms });
}));
