import { Response, Request } from 'express';
import prisma from '../config/client';
import { hashSync, compareSync } from 'bcrypt';
import { getToken } from '../service/auth';
import  asyncHandler  from '../middleware/asyncHandler.middleware';


export const register = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const isUser = await prisma.users.findFirst({ where: { email: email } });

    if (isUser) {
        res.status(409).json({ error: "User already Exists." })
        return;
    }

    const newUser = await prisma.users.create({
        data: {
            email: email,
            password: hashSync(password, 12),
            username: email
        }
    });

    res.status(200).json({
        message: "Success", token: getToken({
            email: newUser.email,
            id: newUser.id
        })
    })

})

export const login = asyncHandler(async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await prisma.users.findFirst({ where: { email: email } });

    if (!user) {
        res.status(404).json({ error: "User does't exists." })
        return;
    }

    if (compareSync(password, user.password)) {

        const token = getToken({
            email: user.email,
            id: user.id
        });



        res.status(200).json({ message: "Success", token: token })
        return;
    }

    res.status(401).json({ error: "Email or password is incorrect!" })
    return;


});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(req.user);
})

export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const allUsers = await prisma.users.findMany();
    res.status(200).json({ users: allUsers });
})