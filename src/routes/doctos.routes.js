import { Router } from "express";
import { deleteFileDoc, getDocumentsByUser, saveDocument, getProfile } from "../controllers/doctos.controller.js";
import { Subirimagen } from "../Middleware/storage.js"; 
import multer from "multer";

//const storage = multer.memoryStorage();
//const upload = multer({ storage: storage });

const router = Router();

//router.get("/doctos", getDocuments);

router.get("/doctosProfile/:id", getProfile);

router.get("/doctos/:Id", getDocumentsByUser);

//router.post("/doctos", upload.single('file'), createDocument);

router.post("/doctosMul", Subirimagen.single('Archivo'), saveDocument)

//router.post("/doctosMulProfile", Subirimagen.single('Archivo'), saveProfile)

router.delete("/doctosMul/:Id", deleteFileDoc);

//router.delete("/doctos/:Id", deleteDocument);

export default router;
