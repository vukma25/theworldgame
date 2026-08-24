import express from "express";
import chessController from "../../controllers/games/chessController.js";

const router = express.Router();
const {
    chessGameMatching, getInfoChessMatch,
} = chessController

router.post("/matching", chessGameMatching);
router.get("/game-details", getInfoChessMatch);

export default router;