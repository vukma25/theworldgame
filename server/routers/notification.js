import express from 'express';
import auth from '../middleware/auth.js'
import {notificationController} from '../controllers/notificationController.js';

const router = express.Router();
const { deleteNotification, readNotification, getAllNotification } = notificationController;

router.post("/delete", auth, deleteNotification);
router.post("/read", auth, readNotification);
router.post("/all", auth, getAllNotification);

export default router;