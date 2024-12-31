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
exports.filter = exports.getAll = exports.getLands = exports.deleteLand = exports.getLand = exports.addLand = void 0;
const client_1 = __importDefault(require("../config/client"));
const multer_1 = __importDefault(require("../middleware/multer"));
const auth_1 = require("../service/auth");
const delete_1 = __importDefault(require("../service/delete"));
const upload_1 = require("../service/upload");
exports.addLand = [multer_1.default.array("images", 5), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { address, balcony, city, furnished, lat, lon, parking, price, roadSize, size, waterTank, token, } = JSON.parse(req.body.form);
            const { id } = (0, auth_1.getData)(token);
            const user = yield client_1.default.users.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
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
                        connect: { id: user.id }
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
const getLand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        try {
            const land = yield client_1.default.lands.findUnique({ where: { id } });
            res.status(200).json({ message: "Land found!", land });
        }
        catch (error) {
            res.status(404).json({ error: "Land not found!" });
        }
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getLand = getLand;
const deleteLand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        try {
            const land = yield client_1.default.lands.findUnique({ where: { id }, include: { info: true } });
            yield client_1.default.lands.delete({ where: { id } });
            yield Promise.all(((land === null || land === void 0 ? void 0 : land.info.imgs) || []).map((img) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, delete_1.default)(img);
            })));
            res.status(200).json({ message: "Land deleted successfully!" });
        }
        catch (error) {
            res.status(404).json({ error: "Land not found!" });
        }
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.deleteLand = deleteLand;
const getLands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const { id: usersId } = (0, auth_1.getData)(req.query.token);
        const rooms = yield client_1.default.lands.findMany({
            skip,
            take: pageSize,
            where: { usersId },
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
exports.getLands = getLands;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lands = yield client_1.default.lands.findMany({ include: { info: true } });
        res.status(200).json({ message: "Success", lands });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.getAll = getAll;
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});
exports.filter = filter;
