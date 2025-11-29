import express from 'express';
import auth from '../middleware/auth.js';
import{ conversationController } from '../controllers/conversationController.js';

const router = express.Router();
const { createPrivateConversation, getAllConversation } = conversationController;


router.post('/create/private', auth, createPrivateConversation);
router.post('/all', auth, getAllConversation);

export default router;