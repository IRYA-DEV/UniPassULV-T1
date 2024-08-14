import { Router } from "express";
import { asignarPreceptor, createAuthorize } from "../controllers/authorize.controller.js";

const router = Router();

router.post("/authorize", createAuthorize);

router.get("/asignarPrece/:Nivel", asignarPreceptor);

export default router;
