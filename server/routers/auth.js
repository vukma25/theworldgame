import express from 'express';
import auth from '../middleware/auth.js';
import authController from '../controllers/authController.js';

const router = express.Router();
const { register, login, logout, refresh, verifyAction } = authController;

router.post('/register', register);
router.post('/login', login);
router.post('/logout', auth, logout);
router.post('/logout/force', logout);
router.post('/refresh', refresh);
router.post('/verify/action', auth, verifyAction);

export default router