import { Router } from "express";
import { getBedroomStudent } from "../controllers/bedroom.controller.js";

const router = Router();

router.get("/dormitorio/:Sexo/:NivelAcademico", getBedroomStudent);

export default router;
