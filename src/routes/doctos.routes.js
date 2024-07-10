import { Router } from "express";
import { createDocument, deleteDocument, getDocument, getDocuments } from "../controllers/doctos.controller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router();

router.get("/doctos", getDocuments);

router.get("/doctos/:id", getDocument);

router.post("/doctos", upload.single('file'), createDocument);

router.delete("/doctos/:Id", deleteDocument);

export default router;