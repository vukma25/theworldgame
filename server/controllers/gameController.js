import Game from "../models/game.js"

const gameController = {
    updateNewGame: async (req, res) => {
        try {
            return res.status(200).json({ message: "ok" });
        } catch (error) {
            console.log("Server error: ", error);
            return res.status(500).json({ message: "Can not update new game" });
        }
    },

    loadGame: async (req, res) => {
        try {
            const games = await Game.find();

            return res.status(200).json({ message: "Load games successfully", games });
        } catch (error) {
            console.log("Server error: ", error);
            return res.status(500).json({ message: "Can not get game's information" });
        }
    },
    //not use
    upload: async (req, res) => {
        try {
            const { games } = req.body;
            if (!games) return res.status(400).json({ message: "Missing parameter" });

            for (let i = 0; i < games.length; i++) {
                const { name, description, source, category, tags, route } = games[i];
                await Game.create({ name, description, source, category, tags, route });
            }

            return res.status(200).json({ message: "Upload successfully" });
        } catch (error) {
            console.log("Server error: ", error);
            return res.status(500).json({ message: "Can not upload" });
        }
    }
}

export default gameController