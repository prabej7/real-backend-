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
exports.filter = exports.getAll = exports.getRooms = exports.deleteRoom = exports.getRoom = exports.addRoom = void 0;
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const upload_1 = require("../service/upload");
const delete_1 = __importDefault(require("../service/delete"));
const auth_1 = require("../service/auth");
exports.addRoom = [
    multer_1.default.array('images', 5),
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { noOfRooms, maxPeople, paymentMode, noticePeriod, restrictions, securityDeposit, balcony, flat, furnished, waterFacility, waterTank, wifi, address, lat, lon, price, city, token, } = JSON.parse(req.body.form);
            // Get user data from token
            const { id } = (0, auth_1.getData)(token);
            // Validate user
            const user = yield client_1.default.users.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ error: 'User not found.' });
                return;
            }
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
                        connect: { id: user.id }, // Correct user connection
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
const getRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        try {
            const room = yield client_1.default.rooms.findUnique({ where: { id } });
            res.status(200).json({ message: "Success", room });
        }
        catch (error) {
            res.status(404).json({ error: "Room not found!" });
            return;
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getRoom = getRoom;
const deleteRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.deleteRoom = deleteRoom;
const getRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const token = req.query.token;
        const { id } = (0, auth_1.getData)(token);
        const skip = (page - 1) * pageSize;
        const rooms = yield client_1.default.rooms.findMany({
            skip,
            take: pageSize,
            where: {
                usersId: id
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});
exports.getRooms = getRooms;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rooms = yield client_1.default.rooms.findMany({ include: { info: true } });
        res.status(200).json({ rooms });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getAll = getAll;
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.filter = filter;
