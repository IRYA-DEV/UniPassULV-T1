import { Router } from "express";
import { newUser } from "../controllers/register.controller.js";

const router = Router();

router.post("/register", newUser);

export default router;
