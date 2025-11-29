import express from 'express'
import auth from '../middleware/auth.js'
import userController from '../controllers/userController.js'

const router = express.Router();
const { fetchUser, getAllUser, sendFriendRequest, handleFriendRequest } = userController;

router.get('/fetchUser', auth, fetchUser);
router.get('/getAllUser', getAllUser);
router.post('/friendRequest/:userId', auth, sendFriendRequest);
router.post('/friendRequest', auth, handleFriendRequest);

export default router;
