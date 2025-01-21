import { Router } from "express";
import { AdvancePermission, asignarPreceptor, createAuthorize, definirAutorizacion, verificarValidacion } from "../controllers/authorize.controller.js";

const router = Router();

router.post("/authorize", createAuthorize);

router.get("/asignarPrece/:Nivel", asignarPreceptor);

router.put("/autorizarPermission/:Id", definirAutorizacion);

router.get("/validarAuthorize/:Id", verificarValidacion);

router.get("/progresAuthorize/:Id", AdvancePermission);

export default router;
