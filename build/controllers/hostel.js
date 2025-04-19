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
exports.getPopularHostels = exports.updateScore = exports.filter = exports.getAll = exports.getHostels = exports.deleteHostel = exports.getHostel = exports.addHostel = void 0;
const upload_1 = require("../service/upload");
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const delete_1 = __importDefault(require("../service/delete"));
const asyncHandler_middleware_1 = __importDefault(require("../middleware/asyncHandler.middleware"));
exports.addHostel = [multer_1.default.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, food, washroom, cctv, parking, wifi, laundry, geyser, fan, studyTable, locker, cupboard, doctorOnCall, matress, prePayment, postPayment, lat, lon, address, city, price, } = JSON.parse(req.body.form);
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
                        connect: { id: req.user.id }
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
exports.getHostel = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const hostel = yield client_1.default.hostels.findUnique({
            where: { id },
        });
        res.status(200).json({ message: "Success", hostel });
    }
    catch (error) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Hostel not found!" });
        }
    }
}));
exports.deleteHostel = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = req.params.id;
    try {
        const hostel = yield client_1.default.hostels.findUnique({ where: { id }, include: { info: true } });
        yield client_1.default.hostels.delete({ where: { id } });
        yield Promise.all((_a = ((hostel === null || hostel === void 0 ? void 0 : hostel.info.imgs) || [])) === null || _a === void 0 ? void 0 : _a.map((img) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, delete_1.default)(img);
        })));
    }
    catch (error) {
        res.status(404).json({ error: "Failed to delete the hostel." });
    }
}));
exports.getHostels = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const rooms = yield client_1.default.hostels.findMany({
        skip,
        take: pageSize,
        where: { usersId: req.user.id },
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
    const hostels = yield client_1.default.hostels.findMany({ include: { info: true } });
    res.status(200).json({ message: "Success", hostels });
}));
exports.filter = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cctv, cupboard, doctorOnCall, fan, food, geyser, laundry, locker, matress, max, min, parking, studyTable, washroom, wifi } = req.body;
    const hostels = yield client_1.default.hostels.findMany({
        where: {
            food,
            washroom,
            cctv, cupboard,
            doctorOnCall, fan,
            geyser,
            laundry,
            locker,
            matress,
            parking,
            studyTable,
            wifi,
            info: {
                price: {
                    gte: min,
                    lte: max
                }
            }
        },
        include: { info: true }
    });
    res.status(200).json({ message: "Success", hostels });
}));
exports.updateScore = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    yield client_1.default.hostels.update({
        where: { id },
        data: { score: { increment: 1 } }
    });
    res.status(200).json({ message: "Score updated successfully!" });
}));
exports.getPopularHostels = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hostels = yield client_1.default.hostels.findMany({ where: { score: { gt: 0 }, }, orderBy: { score: 'desc' }, take: 10 });
    res.status(200).json({ message: "Popular hostels!", hostels });
}));
