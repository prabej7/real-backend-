"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.landSchema = exports.hostelSchema = exports.roomSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().min(1, {
        message: "Email is required."
    }),
    password: zod_1.z.string().min(1, {
        message: "Password is required."
    })
});
exports.roomSchema = zod_1.z.object({
    noOfRooms: zod_1.z.number(),
    flat: zod_1.z.boolean(),
    waterfacility: zod_1.z.boolean(),
    maxPeople: zod_1.z.number(),
    payment: zod_1.z.string(),
    furnished: zod_1.z.boolean(),
    securityDeposit: zod_1.z.number(),
    noticePeriod: zod_1.z.string(),
    balcony: zod_1.z.boolean(),
    waterTank: zod_1.z.boolean(),
    wifi: zod_1.z.boolean(),
    restrictions: zod_1.z.string(),
    address: zod_1.z.string(),
    lat: zod_1.z.number(),
    lon: zod_1.z.number()
});
exports.hostelSchema = zod_1.z.object({
    id: zod_1.z.string(),
    food: zod_1.z.boolean(),
    washroom: zod_1.z.boolean(),
    cctv: zod_1.z.boolean(),
    parking: zod_1.z.boolean(),
    wifi: zod_1.z.boolean(),
    laundry: zod_1.z.boolean(),
    geyser: zod_1.z.boolean(),
    fan: zod_1.z.boolean(),
    studyTable: zod_1.z.boolean(),
    locker: zod_1.z.boolean(),
    cupboard: zod_1.z.boolean(),
    doctorOnCall: zod_1.z.boolean(),
    matress: zod_1.z.boolean(),
    prePayment: zod_1.z.boolean(),
    postPayment: zod_1.z.boolean(),
    img: zod_1.z.array(zod_1.z.string()),
    address: zod_1.z.string(),
    lat: zod_1.z.number(),
    lon: zod_1.z.number()
});
exports.landSchema = zod_1.z.object({
    id: zod_1.z.string(),
    size: zod_1.z.string(),
    parking: zod_1.z.string(),
    waterTank: zod_1.z.boolean(),
    balcony: zod_1.z.boolean(),
    furnished: zod_1.z.boolean(),
    roadSize: zod_1.z.string(),
    img: zod_1.z.array(zod_1.z.string()),
    lat: zod_1.z.number(),
    lon: zod_1.z.number()
});
