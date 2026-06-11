import LeaderBoard from "../models/leaderboard.js"

const leaderBroadController = {
    updateTopPlayerMinesweeper: async (req, res) => {
        try {
            const { difficulty, status, time } = req.body;

            if (!difficulty || !status || isNaN(time) || time < 0) {
                return res.status(400).json({ message: "Missing parameter" });
            }

            const exist = await LeaderBoard.findOne({ player: req.user._id });
            if (!exist) {
                await LeaderBoard.create({
                    game: "minesweeper",
                    difficulty,
                    player: req.user._id,
                    stats: { time }
                });
            } else {
                const record = await LeaderBoard.findOne({
                    player: req.user._id,
                    game: "minesweeper",
                    difficulty
                });
                if (record.stats.time > parseInt(time)) {
                    record.stats.time = parseInt(time);
                    await record.save();
                }
            }

            return res.status(200).json({ message: "Updated successfully" })
        } catch (error) {
            console.timeLog("Server error: ", error);
            return res.status(500).json({ message: "Failed in update process" });
        }
    },
    getTopPlayerMinesweeper: async (req, res) => {
        try {
            const { difficulty } = req.body;

            if (!difficulty) return res.stats(400).json({ message: "Missing parameter" });

            const topPlayers = await LeaderBoard
                .find({ game: "minesweeper", difficulty })
                .populate("player", "_id avatar username")
                .sort({ "stats.time": 1 });

            return res.status(200).json({ message: "Success", top: topPlayers });
        } catch (error) {
            console.timeLog("Server error: ", error);
            return res.status(500).json({ message: "Get top player failed" });
        }
    }
}

export default leaderBroadController