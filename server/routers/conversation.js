import express from 'express';
import auth from '../middleware/auth.js';
import { conversationController } from '../controllers/conversationController.js';

const router = express.Router();
const { createPrivateConversation, getAllConversation, updateModel } = conversationController;


router.post('/create/private', auth, createPrivateConversation);
router.post('/all', auth, getAllConversation);
router.get('/update', updateModel);

export default router;