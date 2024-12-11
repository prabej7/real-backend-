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
exports.getAll = exports.getHostels = exports.deleteHostel = exports.getHostel = exports.addHostel = void 0;
const upload_1 = require("../service/upload");
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const delete_1 = __importDefault(require("../service/delete"));
const auth_1 = require("../service/auth");
exports.addHostel = [multer_1.default.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, food, washroom, cctv, parking, wifi, laundry, geyser, fan, studyTable, locker, cupboard, doctorOnCall, matress, prePayment, postPayment, lat, lon, address, city, price, token } = JSON.parse(req.body.form);
            const { id } = (0, auth_1.getData)(token);
            const user = yield client_1.default.users.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ error: "User not found!" });
            }
            const imageUrls = req.files
                ? yield Promise.all(req.files.map((file) => {
                    return (0, upload_1.uploadFile)(file);
                }))
                : [];
            yield client_1.default.hostels.create({
                data: {
                    name,
                    cctv,
                    food,
                    geyser,
                    fan,
                    studyTable,
                    locker,
                    cupboard,
                    doctorOnCall,
                    matress,
                    prePayment,
                    postPayment,
                    parking,
                    laundry,
                    wifi,
                    washroom,
                    user: {
                        connect: { id: user === null || user === void 0 ? void 0 : user.id }
                    },
                    info: {
                        create: {
                            address,
                            city,
                            lat: String(lat),
                            lon: String(lon),
                            price,
                            imgs: imageUrls
                        }
                    }
                }
            });
            res.status(200).json({ message: "Hostel created successfully" });
        }
        catch (error) {
            res.status(200).json({ error: "Internal Server Error." });
        }
    })];
const getHostel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        try {
            const hostel = yield client_1.default.hostels.findUnique({ where: { id } });
            res.status(200).json({ message: "Success", hostel });
        }
        catch (error) {
            res.status(404).json({ error: "Hostel not found!" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getHostel = getHostel;
const deleteHostel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const id = req.params.id;
        try {
            const hostel = yield client_1.default.hostels.findUnique({ where: { id }, include: { info: true } });
            console.log(hostel === null || hostel === void 0 ? void 0 : hostel.info.imgs);
            yield client_1.default.hostels.delete({ where: { id } });
            yield Promise.all((_a = ((hostel === null || hostel === void 0 ? void 0 : hostel.info.imgs) || [])) === null || _a === void 0 ? void 0 : _a.map((img) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, delete_1.default)(img);
            })));
        }
        catch (error) {
            res.status(404).json({ error: "Failed to delete the hostel." });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.deleteHostel = deleteHostel;
const getHostels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const token = req.query.token;
        const { id } = (0, auth_1.getData)(token);
        const rooms = yield client_1.default.hostels.findMany({
            skip,
            take: pageSize,
            where: { usersId: id },
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
exports.getHostels = getHostels;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hostels = yield client_1.default.hostels.findMany({ include: { info: true } });
        res.status(200).json({ message: "Success", hostels });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getAll = getAll;
