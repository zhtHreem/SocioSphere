import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const here = path.dirname(fileURLToPath(import.meta.url));

// Serverless hosts (Vercel, Lambda) have a read-only code directory and no persistent disk.
// Never let that stop the whole API from starting: uploads are simply switched off there.
const SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
export const UPLOAD_DIR = process.env.UPLOAD_DIR || (SERVERLESS ? path.join(os.tmpdir(), 'uploads') : path.join(here, '..', '..', 'uploads'));
let uploadsEnabled = !SERVERLESS;
if (uploadsEnabled) {
  try { fs.mkdirSync(UPLOAD_DIR, { recursive: true }); }
  catch (err) { uploadsEnabled = false; console.warn('Uploads disabled, cannot create', UPLOAD_DIR, '-', err.code); }
}

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' };

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR), // a function: multer does not touch the disk when it is configured
    // never trust the client's file name: random name, extension from the checked mime type
    filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + EXT[file.mimetype]),
  }),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(EXT[file.mimetype] ? null : new Error('Only JPG, PNG, WebP or GIF images are allowed'), Boolean(EXT[file.mimetype])),
});

// Logged-in users can attach a picture to a chat message.
// NOTE: files are written to local disk. Serverless hosts (e.g. Vercel) have no persistent disk,
// so move this to object storage (S3 / Cloudinary) before deploying there.
router.post('/', authMiddleware, (req, res) => {
  if (!uploadsEnabled) return res.status(503).json({ error: 'Photo uploads are not available on this deployment yet.' });
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No image received' });
    res.status(201).json({ url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` });
  });
});

export default router;
