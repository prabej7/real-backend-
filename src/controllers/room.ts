import { Request, Response } from 'express';
import prisma from '../config/client';
import upload from '../middleware/multer';
import { uploadFile } from '../service/upload';
import deleteFile from '../service/delete';
import asyncHandler from '../middleware/asyncHandler.middleware';

export const addRoom = [
    upload.array('images', 5),

    async (req: Request, res: Response) => {
        try {
            const {
                noOfRooms,
                maxPeople,
                paymentMode,
                noticePeriod,
                restrictions,
                securityDeposit,
                balcony,
                flat,
                furnished,
                waterFacility,
                waterTank,
                wifi,
                address,
                lat,
                lon,
                price,
                city,
                token,
            } = JSON.parse(req.body.form);



            // Handle file uploads
            const imageUrls = req.files
                ? await Promise.all(
                    (req.files as Express.Multer.File[]).map((file) => uploadFile(file))
                )
                : [];

            // Create the room entry
            await prisma.rooms.create({
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
                        connect: { id: req.user.id },
                    },
                    info: {
                        create: {
                            address,
                            city,
                            lat: String(lat),
                            lon: String(lon),
                            price,
                            imgs: imageUrls as string[],
                        },
                    },
                },
            });

            res.status(201).json({ message: 'Room added successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error.' });
        }
    },
];


export const getRoom = asyncHandler(async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const room = await prisma.rooms.findUnique({
            where: { id },
        })
        res.status(200).json({ message: "Success", room });
    }
    catch (err: any) {
        if (err.code == "P2025") {
            res.status(404).json({ error: "Room not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." })
    }
})

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        try {

            const room = await prisma.rooms.findUnique({ where: { id }, select: { info: true } });

            await prisma.rooms.delete({
                where: { id }
            });

            await Promise.all(
                (room?.info.imgs || []).map(async (img) => {
                    await deleteFile(img);
                })
            );

            res.status(200).json({ message: "Room deleted successfully!" });
        } catch (error) {
            res.status(404).json({ error: "Failed to delete the room." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
})

export const getRooms = asyncHandler(async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;


    const rooms = await prisma.rooms.findMany({
        skip,
        take: pageSize,
        where: {
            usersId: req.user.id
        },
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
    try {
        const rooms = await prisma.rooms.findMany({ include: { info: true } });
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
});

export const filter = asyncHandler(async (req: Request, res: Response) => {

    const { balcony,
        flat,
        furnished,
        waterfacility,
        wifi,
        max,
        min,
        noOfRooms
    } = req.body as {
        flat: boolean;
        waterfacility: boolean;
        furnished: boolean;
        balcony: boolean;
        wifi: boolean;
        min: number;
        max: number;
        noOfRooms: number
    };

    const rooms = await prisma.rooms.findMany({
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


});

export const updateScore = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body as { id: string };
    await prisma.rooms.update({
        where: { id },
        data: { score: { increment: 1 } }
    });

    res.status(200).json({ message: "Score updated successfully!" });
});

export const getPopularRooms = asyncHandler(async (req: Request, res: Response) => {
    const rooms = await prisma.rooms.findMany({
        where:
            { score: { gte: 0 }, },
        orderBy: { score: 'desc' },
        take: 10,
        include: { info: true }
    });
    res.status(200).json({ message: "Popular rooms!", rooms });
})

export const getRecommendation = asyncHandler(async (req: Request, res: Response) => {
    const { city } = req.body as { city: string };
    const room = await prisma.rooms.findMany({
        where: { info: { city }, score: { gte: 0 } },
        orderBy: { score: 'desc' },
        take: 1,
        include: { info: true }
    });
    if (room.length == 0) {
        const randomRoom = await prisma.rooms.findFirst({
            where: {
                score: {
                    gte: 0,
                },
            },
            include: { info: true }
        });

        res.status(200).json({
            message: "No top-rated rooms found in this city. Here's a random recommendation instead.",
            room: randomRoom,
        });
        return;
    }

    res.status(200).json({ message: "Success", room: room[0] });
});