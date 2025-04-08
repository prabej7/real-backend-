import asyncHandler from "src/middleware/asyncHandler";
import prisma from "../config/client";
import upload from "../middleware/multer";
import { getData } from "../service/auth";
import deleteFile from "../service/delete";
import { uploadFile } from "../service/upload";
import { Request, Response } from "express";

export const addLand = [upload.array("images", 5), async (req: Request, res: Response) => {
    try {

        const {
            address,
            balcony,
            city,
            furnished,
            lat,
            lon,
            parking,
            price,
            roadSize,
            size,
            waterTank,

        } = JSON.parse(req.body.form);
        const imageUrls = req.files
            ? await Promise.all(
                (req.files as Express.Multer.File[]).map((file) => {
                    return uploadFile(file)
                })
            )
            : [];

        await prisma.lands.create({
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
                        imgs: imageUrls as string[],
                    }
                }
            }
        });

        res.status(200).json({ message: "Land added successfully!" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error." });
    }
}];

export const getLand = asyncHandler(async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const land = await prisma.lands.update({ where: { id }, data: { score: { increment: 1 } } });
        res.status(200).json({ message: "Land found!", land });
    } catch (err: any) {
        if (err.code == "P2025") {
            res.status(404).json({ error: "Land not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." });
    }
});

export const deleteLand = asyncHandler(async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const land = await prisma.lands.findUnique({ where: { id }, include: { info: true } });
        await prisma.lands.delete({ where: { id } });

        await Promise.all(
            (land?.info.imgs || []).map(async (img) => {
                await deleteFile(img);
            })
        );

        res.status(200).json({ message: "Land deleted successfully!" });

    } catch (error: any) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Land not found!" });
            return;
        }
        res.status(500).json({ error: "Internal Server Error." });
    }
})

export const getLands = asyncHandler(async (req: Request, res: Response) => {

    const page = parseInt(req.query.page as string) || 1;
    const pageSize = 10;

    const skip = (page - 1) * pageSize;

    const { id: usersId } = getData(req.query.token as string) as { id: string };

    const rooms = await prisma.lands.findMany({
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


    const totalCount = await prisma.rooms.count();

    res.status(200).json({
        data: rooms,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
    });

});

export const getAll = asyncHandler(async (req: Request, res: Response) => {

    const lands = await prisma.lands.findMany({ include: { info: true } });
    res.status(200).json({ message: "Success", lands });

})

export const filter = asyncHandler(async (req: Request, res: Response) => {

    const { size, parking, waterTank, balcony, furnished, roadSize, min, max } = req.body;

    const where = {
        ...(size ? { size: size } : {}),
        ...(parking ? { parking: parking } : {}),
        ...(waterTank ? { waterTank: waterTank } : {}),
        ...(balcony ? { balcony: balcony } : {}),
        ...(furnished ? { furnished: furnished } : {}),
        ...(roadSize ? { roadSize: roadSize } : {}),
        info: {
            price: {
                gte: min,
                lte: max
            }
        }
    };

    const lands = await prisma.lands.findMany({
        where,
        include: {
            info: true
        }
    });

    res.status(200).json({ message: "Success", lands });

});