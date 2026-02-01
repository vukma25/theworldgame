import express from 'express';
import auth from '../middleware/auth.js';
import { messageController } from '../controllers/messageController.js'

const router = express.Router();
const {
    sendMessage, readMessage, getMessagesByConversation,
    deleteAllMessage, editMessage, deleteMessage, pinMessage, unPinMessage
} = messageController;

router.post('/send', auth, sendMessage);
router.post('/read', auth, readMessage);
router.post('/all/:conversationId', auth, getMessagesByConversation);
router.post('/edit', auth, editMessage);
router.post('/delete', auth, deleteMessage);
router.post('/pin', auth, pinMessage);
router.post('/unpin', auth, unPinMessage);

// test not use
router.get('/delete/all', deleteAllMessage);

export default router;


