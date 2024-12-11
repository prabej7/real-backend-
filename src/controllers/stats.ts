import prisma from "@/config/client";
import { Request, Response } from "express";

export const getCounts = async (req: Request, res: Response) => {
    try {
        const roomCount = await prisma.rooms.count();
        const hostelCount = await prisma.hostels.count();
        const landCount = await prisma.lands.count();

        res.status(200).json({ roomCount, hostelCount, landCount });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
    }
}

export const getMonthlyUser  = async (req: Request, res: Response) => {
    try {
        const chartData: { month: string, verified: number, unverified: number }[] = [];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        for (const month of months) {
            const startDate = new Date(`2024-${String(months.indexOf(month) + 1).padStart(2, '0')}-01T00:00:00Z`);
            const endDate = new Date(`2024-${String(months.indexOf(month) + 1).padStart(2, '0')}-01T00:00:00Z`);
            endDate.setMonth(endDate.getMonth() + 1); // Move to the first day of the next month

            const [verifiedUsers, unverifiedUsers] = await Promise.all([
                prisma.users.count({
                    where: {
                        createdAt: {
                            gte: startDate,
                            lt: endDate
                        },
                        verified: true
                    }
                }),
                prisma.users.count({
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
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: "Internal Server Error." });
    }
}