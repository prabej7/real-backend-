import { Router } from "express";
import { register, login, getUser, getAllUser } from "../controllers/user";
import { validateData } from "../middleware/zod.middleware";
import { registerSchema } from "../validations/valudations";
import { auth } from "src/middleware/auth";

const router = Router();

router.route("/register").post(validateData(registerSchema), register);
router.route("/login").post(validateData(registerSchema), login);
router.route("/user/").get(auth, getUser);
router.route("/users/").get(auth, getAllUser);

export default router;