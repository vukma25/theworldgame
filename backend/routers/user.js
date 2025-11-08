import express from 'express'
import auth from '../middleware/auth.js'
import userController from '../controllers/userController.js'

const router = express.Router();
const { fetchUser } = userController;

router.get('/fetchUser', auth, fetchUser);

export default router;
