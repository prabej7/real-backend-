import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required."
    }),
    password: z.string().min(1, {
        message: "Password is required."
    })
})

export const roomSchema = z.object({
    noOfRooms: z.number(),
    flat: z.boolean(),
    waterfacility: z.boolean(),
    maxPeople: z.number(),
    payment: z.string(),
    furnished: z.boolean(),
    securityDeposit: z.number(),
    noticePeriod: z.string(),
    balcony: z.boolean(),
    waterTank: z.boolean(),
    wifi: z.boolean(),
    restrictions: z.string(),
    address: z.string(),
    lat: z.number(),
    lon: z.number()
});

export const hostelSchema = z.object({
    food: z.boolean(),
    washroom: z.boolean(),
    cctv: z.boolean(),
    parking: z.boolean(),
    wifi: z.boolean(),
    laundry: z.boolean(),
    geyser: z.boolean(),
    fan: z.boolean(),
    studyTable: z.boolean(),
    locker: z.boolean(),
    cupboard: z.boolean(),
    doctorOnCall: z.boolean(),
    matress: z.boolean(),
    prePayment: z.boolean(),
    postPayment: z.boolean(),
    address: z.string(),
    lat: z.number(),
    lon: z.number()
});

export const landSchema = z.object({
    id: z.string(),
    size: z.string(),
    parking: z.string(),
    waterTank: z.boolean(),
    balcony: z.boolean(),
    furnished: z.boolean(),
    roadSize: z.string(),
    img: z.array(z.string()),
    lat: z.number(),
    lon: z.number()
});

