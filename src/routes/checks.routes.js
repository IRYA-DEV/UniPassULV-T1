import { Router } from "express";
import { createChecksPermission, getChecksDormitorio, getChecksVigilancia, putCheckPoint } from "../controllers/checks.controllers.js";
const router = Router();

router.post("/checks", createChecksPermission);

router.get("/checksDormitorio/:Id", getChecksDormitorio);

router.get("/checksVigilancia", getChecksVigilancia);

router.put("/checks/:id", putCheckPoint);

export default router;