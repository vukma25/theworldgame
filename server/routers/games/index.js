import express from "express";
import minesweeperRouter from "./minesweeper.js";
import chessRouter from "./chess.js"
import auth from "../../middleware/auth.js"
import gameController from "../../controllers/gameController.js";

const router = express.Router();
const { loadGame } = gameController

router.use("/minesweeper", auth, minesweeperRouter);
router.use("/chess", auth, chessRouter);
router.get("/info", loadGame);

export default router;