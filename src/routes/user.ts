import { Router } from "express";
import { register, login, getUser, getAllUser } from "../controllers/user";
import { validateData } from "../middleware/zod.middleware";
import { registerSchema } from "../validations/valudations";

const router = Router();

router.route("/api/register").post(validateData(registerSchema), register);
router.route("/api/login").post(validateData(registerSchema), login);
router.route("/api/user/:token").get(getUser);
router.route("/api/users/").get(getAllUser);

export default router;