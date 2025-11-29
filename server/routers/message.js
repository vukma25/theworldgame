import express from 'express';
import auth from '../middleware/auth.js';
import { messageController } from '../controllers/messageController.js'

const router = express.Router();
const { sendMessage, readMessage, getMessagesByConversation, deleteAllMessage } = messageController;

router.post('/send', auth, sendMessage);
router.post('/read', auth, readMessage);
router.post('/all/:conversationId', auth, getMessagesByConversation)
router.get('/delete/all', deleteAllMessage)

export default router;


