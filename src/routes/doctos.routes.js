import { Router } from "express";
import { deleteFileDoc, getDocumentsByUser, saveDocument, getProfile, uploadProfile, getExpedientesAlumnos, getArchivosAlumno } from "../controllers/doctos.controller.js";
import { Subirimagen } from "../middlewares/storage.js"; 
import multer from "multer";

const router = Router();

router.get("/doctosProfile/:id", getProfile);

router.get("/doctos/:Id", getDocumentsByUser);

router.post("/doctosMul", Subirimagen.single('Archivo'), saveDocument)

router.put("/doctosMul/updateProfile", Subirimagen.single('Archivo'), uploadProfile)

router.delete("/doctosMul/:Id", deleteFileDoc);

router.get("/getExpediente/:IdDormi", getExpedientesAlumnos)

router.get("/getArchivos/:Dormitorio/:Nombre/:Apellidos", getArchivosAlumno);

export default router;
