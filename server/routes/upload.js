import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { verificarToken, authorize } from '../helpers/auth.js';

const router = express.Router();

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } 
})

// Subida exclusiva para administradores
router.post('/', verificarToken, authorize(["admin"]), upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Ningún archivo subido.' });
  }
  
  // Guardamos un path relativo estándar
  const url = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url });
});

export const uploadRoutes = router;
