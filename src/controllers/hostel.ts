import { Request, Response } from "express";
import { uploadFile } from "../service/upload";
import prisma from "../config/client";
import upload from "../middleware/multer";
import deleteFile from "../service/delete";
import asyncHandler from '../middleware/asyncHandler.middleware';

export const addHostel = [upload.array("images", 5), async (req: Request, res: Response) => {
    try {
        const {
            name,
            food,
            washroom,
            cctv,
            parking,
            wifi,
            laundry,
            geyser,
            fan,
            studyTable,
            locker,
            cupboard,
            doctorOnCall,
            matress,
            prePayment,
            postPayment,
            lat,
            lon,
            address,
            city,
            price,

        } = JSON.parse(req.body.form);



        const imageUrls = req.files
            ? await Promise.all(
                (req.files as Express.Multer.File[]).map((file) => {
                    return uploadFile(file)
                })
            )
            : [];

        await prisma.hostels.create({
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
                        imgs: imageUrls as string[]
                    }
                }
            }
        });

        res.status(200).json({ message: "Hostel created successfully" });
    } catch (error) {
        res.status(200).json({ error: "Internal Server Error." })
    }
}];

export const getHostel = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const hostel = await prisma.hostels.findUnique({
            where: { id },
        });
        res.status(200).json({ message: "Success", hostel });
    } catch (error: any) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Hostel not found!" });
        }
    }
})


export const deleteHostel = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const hostel = await prisma.hostels.findUnique({ where: { id }, include: { info: true } });
        await prisma.hostels.delete({ where: { id } });

        await Promise.all(
            (hostel?.info.imgs || [])?.map(async (img) => {
                await deleteFile(img);
            })
        )
    } catch (error) {
        res.status(404).json({ error: "Failed to delete the hostel." });
    }
});

export const getHostels = asyncHandler(async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const rooms = await prisma.hostels.findMany({
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


    const totalCount = await prisma.rooms.count();

    res.status(200).json({
        data: rooms,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
    });

});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
    const hostels = await prisma.hostels.findMany({ include: { info: true } });
    res.status(200).json({ message: "Success", hostels });
})

export const filter = asyncHandler(async (req: Request, res: Response) => {
    type FormField = {
        food: boolean;
        washroom: boolean;
        cctv: boolean;
        parking: boolean;
        wifi: boolean;
        laundry: boolean;
        geyser: boolean;
        fan: boolean;
        studyTable: boolean;
        locker: boolean;
        cupboard: boolean;
        doctorOnCall: boolean;
        matress: boolean;
        min: number;
        max: number;
    }

    const {
        cctv,
        cupboard,
        doctorOnCall,
        fan,
        food,
        geyser,
        laundry,
        locker,
        matress,
        max,
        min,
        parking,
        studyTable,
        washroom,
        wifi
    } = req.body as FormField;


    const hostels = await prisma.hostels.findMany({
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
});

export const updateScore = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body as { id: string }
    await prisma.hostels.update({
        where: { id },
        data: { score: { increment: 1 } }
    });

    res.status(200).json({ message: "Score updated successfully!" });
})

export const getPopularHostels = asyncHandler(async (req: Request, res: Response) => {
    const hostels = await prisma.hostels.findMany({ where: { score: { gte: 0 }, }, orderBy: { score: 'desc' }, take: 10 });

    res.status(200).json({ message: "Popular hostels!", hostels });
})