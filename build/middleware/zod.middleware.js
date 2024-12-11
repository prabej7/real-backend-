"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateData = void 0;
const zod_1 = require("zod");
const validateData = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((issue) => ({
                    message: `${issue.path.join('/')} is ${issue.message}`,
                }));
                res.status(200).json({ error: 'Invalid data', details: errorMessages });
            }
            else {
                console.log(error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    };
};
exports.validateData = validateData;
