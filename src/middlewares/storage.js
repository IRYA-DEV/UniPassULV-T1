import multer from "multer";
import fs from 'fs';
import path from 'path';

const guardar = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './public/uploads';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
    }
});

const filtro = (req, file, cb) => {
    if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const Subirimagen = multer({ storage: guardar, fileFilter: filtro });
