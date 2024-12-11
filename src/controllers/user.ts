import { Response, Request } from 'express';
import prisma from '../config/client';
import { hashSync, compareSync } from 'bcrypt';
import { getData, getToken } from '../service/auth';


export const register = async (req: Request, res: Response) => {
    try {
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

        return;

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error." })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
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

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." })
        return;
    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const token = req.params.token;
        if (!token) {
            res.status(401).json({ error: "Token is required." });
            return;
        }

        const decoded = getData(token);
        if (!decoded) {
            res.status(401).json({ error: "Invalid or expired token." });
            return;
        }
        const { id } = decoded as { id: string };



        const user = await prisma.users.findFirst({ where: { id } });

        if (!user) {
            res.status(404).json({ error: "User not found." });
            return;
        }

   
        res.status(200).json({ message: "Success", user: user });
        return;

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error." });
        return;
    }
}

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.users.findMany();
        res.status(200).json({ users: allUsers });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error." });
        return;
    }
}