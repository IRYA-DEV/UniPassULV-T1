import { Router } from "express";
import { createTutor, deleteTutor, getTutor, getTutores, updateTutor } from '../controllers/tutor.controllers.js'

const router = Router();

router.get("/tutores", getTutores);

router.get("/tutores/:Id", getTutor);

router.post("/tutores", createTutor);

router.put("/tutores/:Id", updateTutor);

router.delete("/tutores/:Id", deleteTutor);

export default router