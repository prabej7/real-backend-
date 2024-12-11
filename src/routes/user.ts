import { Router } from "express";
import { register, login, getUser, getAllUser } from "../controllers/user";
import { validateData } from "../middleware/zod.middleware";
import { registerSchema } from "../validations/valudations";

const router = Router();

router.route("/register").post(validateData(registerSchema), register);
router.route("/login").post(validateData(registerSchema), login);
router.route("/user/:token").get(getUser);
router.route("/users/").get(getAllUser);

export default router;