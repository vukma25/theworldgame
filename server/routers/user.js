import express from 'express'
import auth from '../middleware/auth.js'
import { upload } from '../middleware/multer.js';
import userController from '../controllers/userController.js'

const router = express.Router();
const {
    fetchMe, fetchMeDetail, fetchAnotherUser, getAllUser,
    sendFriendRequest, handleFriendRequest, uploadAvatar,
    updateProfile, withdrawFriendRequest, unfriend
} = userController;

router.get('/fetchMe', auth, fetchMe);
router.get('/fetchMe/detail', auth, fetchMeDetail);
router.get('/fetchUser/:id', auth, fetchAnotherUser);
router.post('/upload/avatar', auth, upload.single('avatar'), uploadAvatar);
router.post('/update/profile', auth, updateProfile);
router.get('/getAllUser', getAllUser);
router.post('/unfriend', auth, unfriend);
router.post('/friendRequest/withdraw', auth, withdrawFriendRequest);
router.post('/friendRequest/:userId', auth, sendFriendRequest);
router.post('/friendRequest', auth, handleFriendRequest);

export default router;
