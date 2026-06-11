import express from 'express'
import leaderBroadController from '../../controllers/leaderboardController.js';


const router = express.Router();
const { updateTopPlayerMinesweeper, getTopPlayerMinesweeper } = leaderBroadController;

router.post("/update", updateTopPlayerMinesweeper);
router.post("/top-player", getTopPlayerMinesweeper);

export default router;