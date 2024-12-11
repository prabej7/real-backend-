import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';

export const validateData = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {

                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('/')} is ${issue.message}`,
                }));

                res.status(200).json({ error: 'Invalid data', details: errorMessages });
            } else {
                console.log(error)

                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };
};