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
exports.addRoom = void 0;
const client_1 = __importDefault(require("../config/client"));
const addRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { noOfRooms, maxPeople, paymentmode, noticePeriod, restrictions, securityDeposite, balcony, flat, furnished, waterFacility, waterTank, wifi, token, address, lat, lon, price, city, } = JSON.parse(req.body.form);
        const newRoom = yield client_1.default.rooms.create({
            data: {
                address,
                balcony, flat,
                furnished,
                waterfacility: waterFacility,
                lat,
                lon,
                maxPeople,
                noOfRooms,
                noticePeriod,
                payment: paymentmode,
                restrictions,
                securityDeposit: securityDeposite,
                waterTank,
                wifi
            }
        });
    }
    catch (error) {
        return res.status(200).json({ error: "Internal Server Error." });
    }
});
exports.addRoom = addRoom;
