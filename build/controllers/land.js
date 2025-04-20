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
exports.getPopularLands = exports.updateScore = exports.filter = exports.getAll = exports.getLands = exports.deleteLand = exports.getLand = exports.addLand = void 0;
const asyncHandler_middleware_1 = __importDefault(require("../middleware/asyncHandler.middleware"));
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const delete_1 = __importDefault(require("../service/delete"));
const upload_1 = require("../service/upload");
exports.addLand = [multer_1.default.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { address, balcony, city, furnished, lat, lon, parking, price, roadSize, size, waterTank, } = JSON.parse(req.body.form);
            const imageUrls = req.files
                ? yield Promise.all(req.files.map((file) => {
                    return (0, upload_1.uploadFile)(file);
                }))
                : [];
            yield client_1.default.lands.create({
                data: {
                    balcony,
                    furnished,
                    parking,
                    roadSize,
                    size,
                    waterTank,
                    user: {
                        connect: { id: req.user.id }
                    },
                    info: {
                        create: {
                            lat: String(lat),
                            lon: String(lon),
                            address,
                            city,
                            price,
                            imgs: imageUrls,
                        }
                    }
                }
            });
            res.status(200).json({ message: "Land added successfully!" });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error." });
        }
    })];
exports.getLand = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const land = yield client_1.default.lands.findUnique({ where: { id } });
        res.status(200).json({ message: "Land found!", land });
    }
    catch (err) {
        if (err.code == "P2025") {
            res.status(404).json({ error: "Land not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
exports.deleteLand = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const land = yield client_1.default.lands.findUnique({ where: { id }, include: { info: true } });
        yield client_1.default.lands.delete({ where: { id } });
        yield Promise.all(((land === null || land === void 0 ? void 0 : land.info.imgs) || []).map((img) => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, delete_1.default)(img);
        })));
        res.status(200).json({ message: "Land deleted successfully!" });
    }
    catch (error) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Land not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." });
    }
}));
exports.getLands = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const rooms = yield client_1.default.lands.findMany({
        skip,
        take: pageSize,
        where: { id: req.user.id },
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
    const lands = yield client_1.default.lands.findMany({ include: { info: true } });
    res.status(200).json({ message: "Success", lands });
}));
exports.filter = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { size, parking, waterTank, balcony, furnished, roadSize, min, max } = req.body;
    const where = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (size ? { size: size } : {})), (parking ? { parking: parking } : {})), (waterTank ? { waterTank: waterTank } : {})), (balcony ? { balcony: balcony } : {})), (furnished ? { furnished: furnished } : {})), (roadSize ? { roadSize: roadSize } : {})), { info: {
            price: {
                gte: min,
                lte: max
            }
        } });
    const lands = yield client_1.default.lands.findMany({
        where,
        include: {
            info: true
        }
    });
    res.status(200).json({ message: "Success", lands });
}));
exports.updateScore = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    yield client_1.default.lands.update({
        where: { id },
        data: { score: { increment: 1 } }
    });
    res.status(200).json({ message: "Score updated successfully!" });
}));
exports.getPopularLands = (0, asyncHandler_middleware_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lands = yield client_1.default.lands.findMany({ where: { score: { gte: 0 }, }, orderBy: { score: 'desc' }, take: 10 });
    res.status(200).json({ message: "Popular lands!", lands });
}));
