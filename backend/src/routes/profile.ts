import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  changePassword
} from '../controllers/profileController';

const router = express.Router();

// Configure multer for file uploads (using memory storage for cloud deployment)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = file.originalname ? /\.(jpeg|jpg|png|gif)$/i.test(file.originalname) : false;
    const mimetype = /^image\/(jpeg|jpg|png|gif)$/.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// All routes require authentication
router.use(authenticate);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// PUT /api/profile - Update user profile
router.put('/', updateProfile);

// POST /api/profile/upload-image - Upload profile image
router.post('/upload-image', upload.single('image'), uploadProfileImage);

// PUT /api/profile/password - Change password
router.put('/password', changePassword);

export default router;
