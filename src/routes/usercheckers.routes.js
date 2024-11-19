import { Router } from "express";
import { buscarCheckers, cambiarActividad, EliminarChecker } from "../controllers/usercheckers.controller.js";

const router = Router();

router.get("/buscarCheckers/:CorreoEmpleado", buscarCheckers);

router.put("/DesactivarChecker/:IdLogin", cambiarActividad);

router.delete("/EliminarChecker/:IdLogin", EliminarChecker);

export default router;