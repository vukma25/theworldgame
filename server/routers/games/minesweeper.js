import express from "express";
import minesweeperController from "../../controllers/minesweeperController.js";

const router = express.Router();
const { saveResult } = minesweeperController

router.post("/save", saveResult);

export default router;