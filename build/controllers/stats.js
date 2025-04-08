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
exports.getMonthlyUser = exports.getCounts = void 0;
const asyncHandler_1 = __importDefault(require("src/middleware/asyncHandler"));
const client_1 = __importDefault(require("../config/client"));
exports.getCounts = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roomCount = yield client_1.default.rooms.count();
    const hostelCount = yield client_1.default.hostels.count();
    const landCount = yield client_1.default.lands.count();
    res.status(200).json({ roomCount, hostelCount, landCount });
}));
exports.getMonthlyUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chartData = [];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (const month of months) {
        const startDate = new Date(`2024-${String(months.indexOf(month) + 1).padStart(2, '0')}-01T00:00:00Z`);
        const endDate = new Date(`2024-${String(months.indexOf(month) + 1).padStart(2, '0')}-01T00:00:00Z`);
        endDate.setMonth(endDate.getMonth() + 1);
        const [verifiedUsers, unverifiedUsers] = yield Promise.all([
            client_1.default.users.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    },
                    verified: true
                }
            }),
            client_1.default.users.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lt: endDate
                    },
                    verified: false
                }
            })
        ]);
        chartData.push({ month, verified: verifiedUsers, unverified: unverifiedUsers });
    }
    res.status(200).json(chartData);
}));
