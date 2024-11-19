import { Router } from "express";
import { cambiarActivo, createPosition, getInfoCargo, getInfoDelegado } from "../controllers/position.controller.js";

const router = Router();

router.get("/InfoCargo/:Id", getInfoCargo)

router.get("/InfoDelegado/:Id", getInfoDelegado)

router.post("/createPosition", createPosition);

router.put("/activarCargo/:Id", cambiarActivo) 

export default router;

