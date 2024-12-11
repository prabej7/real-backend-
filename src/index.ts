import "tsconfig-paths/register";
import express from 'express';
import { hostelRouter, landRouter, otpRouter, roomRouter, statsRouter, userRoutes } from './routes';
import cors from 'cors'
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cors())

app.use(userRoutes);
app.use(roomRouter);
app.use(hostelRouter);
app.use(landRouter);
app.use(otpRouter);
app.use(statsRouter);

app.get("/", (req: any, res: any) => {
    return res.status(200).json({ message: "PONG" })
})

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))