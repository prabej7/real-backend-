import { sign, verify } from 'jsonwebtoken'

const secret = process.env.JWT_SECRET;

type Payload = {
    email: string;
    id: string
}

export const getToken = (payLoad: Payload | any) => {
    if (!secret) return "Please provide the JWT Secret!"
    return sign(payLoad, secret);
}

export const getData = (token: string): string | object | null => {
    try {
        const decoded = verify(token, secret as string);
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}
