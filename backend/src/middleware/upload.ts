import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const LOGO_DIR = 'uploads/logos';
const RESUME_DIR = 'uploads/resumes';

[LOGO_DIR, RESUME_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.fieldname === 'resume' ? RESUME_DIR : LOGO_DIR;
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'image/jpeg', 
    'image/png', 
    'image/webp',
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only images, PDF, and DOC/DOCX are allowed.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

