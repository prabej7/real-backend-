import { Request, Response } from "express";
import { uploadFile } from "../service/upload";
import prisma from "../config/client";
import upload from "../middleware/multer";
import deleteFile from "@/service/delete";
import { getData } from "@/service/auth";

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
            token
        } = JSON.parse(req.body.form);

        const { id } = getData(token) as { id: string, email: string };
        const user = await prisma.users.findUnique({ where: { id } });

        if (!user) {
            res.status(404).json({ error: "User not found!" });
        }

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
                    connect: { id: user?.id }
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

export const getHostel = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        try {
            const hostel = await prisma.hostels.findUnique({ where: { id } });
            res.status(200).json({ message: "Success", hostel });
        } catch (error) {
            res.status(404).json({ error: "Hostel not found!" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}

export const deleteHostel = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        try {
            const hostel = await prisma.hostels.findUnique({ where: { id }, include: { info: true } });
            console.log(hostel?.info.imgs);
            await prisma.hostels.delete({ where: { id } });

            await Promise.all(
                (hostel?.info.imgs || [])?.map(async (img) => {
                    await deleteFile(img);
                })
            )
        } catch (error) {
            res.status(404).json({ error: "Failed to delete the hostel." });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}

export const getHostels = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = 10;

        const skip = (page - 1) * pageSize;

        const token = req.query.token as string;
        const { id } = getData(token) as { id: string }

        const rooms = await prisma.hostels.findMany({
            skip,
            take: pageSize,
            where: { usersId: id },
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
}

export const getAll = async (req: Request, res: Response) => {
    try {
        const hostels = await prisma.hostels.findMany({ include: { info: true } });
        res.status(200).json({ message: "Success", hostels });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
    }
}
