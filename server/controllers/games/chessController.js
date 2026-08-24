import { isValidObjectId } from "mongoose"
import message from "../../models/message.js";
import gameMatching from "../../services/gameMatching.js";
// import Socs from "../../services/socketService.js";
import { ChessMatch } from "../../models/chess.js"

const chessController = {
    // tìm trận cờ vua
    chessGameMatching: async (req, res) => {
        try {
            const uid = req?.user?._id;
            const gameType = req?.gameType;

            if (!id || !gameType) return res.status(400).json({ message: "Thiếu thông tin" });

            const { status } = await gameMatching.matching({ id: uid, gameType }, "chess");

            switch (status) {
                case "ok":
                    return res.status(204);

                case "waiting":
                    return res.status(200).json({ message: "Đang trong quá trình chờ tìm trận" });

                default:
                    return res.status(404).json({ message: "Không tìm được trận đấu phù hợp" });;
            }

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    // lấy trạng thái về trận đấu, thông tin về đối thủ khi tìm thấy trận
    getInfoChessMatch: async (req, res) => {
        try {
            const { chessMatchId } = req?.params;
            const userId = req?.user?._id;
            if (!chessMatchId || !isValidObjectId(chessMatchId) || !userId) return res.status(400).json({ message: "Thiếu thông tin" });

            const chessMatch = await ChessMatch.findOne({ _id: chessMatchId })
                .populate([
                    { path: "white", select: "_id username avatar" },
                    { path: "black", select: "_id username avatar" },
                ]);
            if (!chessMatch) return res.status(404).json({ message: "Không tìm thấy trận đấu nào đang diễn ra" });
            if (!chessMatch.white._id.equals(userId) && !chessMatch.black._id.equals(userId)) {
                return res.status(403).json({ message: "Bạn không có quyền xem thông tin trận đấu này" });
            }

            return res.status(200).json({ message: "Lấy thông tin trận đấu thành công", detailInfo: chessMatch });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    },
    // duy trì trạng thái khi người dùng thoát ra vào lại
    remainStateChessMatch: async (req, res) => {
        try {
            // do something
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
    }


}

export default chessController;