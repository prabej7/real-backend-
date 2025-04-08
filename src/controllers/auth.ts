import { Response, Request } from 'express'
import { getToken, getData } from '../service/auth';
import sendMail from '../service/mailer';
import prisma from '../config/client';
import  asyncHandler  from '../middleware/asyncHandler.middleware';

export const getOtp = asyncHandler(async (req: Request, res: Response) => {

    const email = req.params.email;
    const otp = Math.floor(Math.random() * 1000000);
    await sendMail(email, otp);
    const token = getToken({ otp, email });
    res.status(200).json({ token });

})

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {

    const { otp, token } = req.body;

    const { otp: actualOtp, email } = getData(token) as { otp: number, email: string };

    if (otp == actualOtp) {
        await prisma.users.update({
            where: { email },
            data: {
                verified: true
            }
        });
        res.status(200).json({ message: "Verified" });
    } else {
        res.status(401).json({ error: "Invalid or expired otp." })
    }

})