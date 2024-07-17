import { Router } from "express";
import { createDocument, deleteDocument, deleteFileDoc, getDocumentsByUser, saveProfile } from "../controllers/doctos.controller.js";
import { Subirimagen } from "../Middleware/storage.js"; 
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

//router.get("/doctos", getDocuments);

//router.get("/doctos/:id", getDocument);

router.get("/doctos/:Id", getDocumentsByUser);

router.post("/doctos", upload.single('file'), createDocument);

router.post("/doctosMul", Subirimagen.single('Archivo'), saveProfile)

router.delete("/doctosMul/:Id", deleteFileDoc);

router.delete("/doctos/:Id", deleteDocument);

export default router;
