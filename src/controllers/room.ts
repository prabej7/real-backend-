import { Request, Response } from 'express';
import prisma from '../config/client';
import upload from '../middleware/multer';
import { uploadFile } from '../service/upload';
import deleteFile from '../service/delete';
import { getData } from '../service/auth';

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

            // Get user data from token
            const { id } = getData(token) as { email: string; id: string };

            // Validate user
            const user = await prisma.users.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ error: 'User not found.' });
                return;
            }

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
                        connect: { id: user.id }, // Correct user connection
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


export const getRoom = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        try {
            const room = await prisma.rooms.findUnique({ where: { id } });
            res.status(200).json({ message: "Success", room });
        } catch (error) {
            res.status(404).json({ error: "Room not found!" });
            return;
        }

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

export const deleteRoom = async (req: Request, res: Response) => {
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
}

export const getRooms = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 10;
        const token = req.query.token as string;
        const { id } = getData(token) as { id: string };
        const skip = (page - 1) * pageSize;


        const rooms = await prisma.rooms.findMany({
            skip,
            take: pageSize,
            where: {
                usersId: id
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const getAll = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.rooms.findMany({ include: { info: true } });
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}

export const filter = async (req: Request, res: Response) => {
    try {
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
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error." });
    }
}
