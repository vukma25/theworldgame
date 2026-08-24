import Minesweeper from "../../models/minesweeper.js"

const HISTORY_LIMIT = 30;

const minesweeperController = {
    saveResult: async (req, res) => {
        try {
            const { difficulty, status, time } = req.body;

            if (!difficulty || !status || isNaN(time) || time < 0) {
                return res.status(400).json({ message: "Missing parameter" });
            }

            const exist = await Minesweeper.findOne({ player: req.user._id });
            if (!exist) {
                await Minesweeper.create({
                    player: req.user._id,
                    listResults: [{
                        difficulty,
                        status,
                        time: parseInt(time)
                    }]
                });
            } else {
                const record = await Minesweeper.findOne({ player: req.user._id });
                if (record.listResults.length >= HISTORY_LIMIT) {
                    const newListResults = [...record.listResults.slice(1), {
                        difficulty,
                        status,
                        time: parseInt(time)
                    }];

                    record.listResults = newListResults;

                } else {
                    record.listResults = [...record.listResults, {
                        difficulty,
                        status,
                        time: parseInt(time)
                    }];
                }

                await record.save();
            }

            return res.status(200).json({ message: "Saved the game" })
        } catch (error) {
            console.timeLog("Server error: ", error);
            return res.status(500).json({ message: "Failed in saving process" });
        }
    },
    getStatistics: async (req, res) => {
        try {
            const uid = req?.user?._id
            if (!uid) return res.status(400).json({ message: "Thiếu thông tin" });

            const statistics = await Minesweeper.findOne({ player: uid }).select("listResults -_id");

            return res.status(200).json(statistics);

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    }
}

export default minesweeperController;