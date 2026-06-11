import express from "express";
import minesweeperRouter from "./minesweeper.js";
import auth from "../../middleware/auth.js"
import gameController from "../../controllers/gameController.js";

const router = express.Router();
const { loadGame } = gameController

router.use("/minesweeper", auth, minesweeperRouter);
router.get("/info", auth, loadGame);

export default router;