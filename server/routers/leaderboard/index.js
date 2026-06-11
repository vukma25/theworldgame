import express from 'express'
import minesweeperRouter from './minesweeper.js'
import auth from "../../middleware/auth.js"

const router = express.Router();

router.use("/minesweeper", auth, minesweeperRouter);

export default router;