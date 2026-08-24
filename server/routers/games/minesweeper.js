import express from "express";
import minesweeperController from "../../controllers/games/minesweeperController.js";

const router = express.Router();
const { saveResult, getStatistics } = minesweeperController

router.post("/save", saveResult);
router.get("/statistic", getStatistics)

export default router;