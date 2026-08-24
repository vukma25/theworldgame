import Chess from "../models/chess.js";
import { ChessMatch } from "../models/chess.js";
import Caro from "../models/caro.js";
import Socs from "./socketService.js";
import redis from "./redisService.js";

// Constants
const semaphores = {
    "1": "Thiếu, sai thông tin, hoặc lỗi nói chung",
    "2": "Thành công",
    "3": "Thất bại"
};

const BLITZ = 3 * 60 * 100;  // 3 phút
const RAPID = 10 * 60 * 100; // 10 phút
const THRESHOLD = 50; // Chênh lệch Elo tối đa để match
const MATCH_TIMEOUT = 600; // 10 phut timeout nếu không tìm thấy đối thủ

const client = redis.getRedisClient();

// Redis key patterns
const REDIS_KEYS = {
    // Sử dụng Sorted Set để lưu người chơi đang chờ theo Elo
    // Key: gameMatching:chess:waiting, Score: Elo, Member: JSON player info
    CHESS_WAITING: "gameMatching:chess:waiting",
    CARO_WAITING: "gameMatching:caro:waiting",

    // Hash để lưu thông tin chi tiết người chơi đang chờ
    // Key: gameMatching:chess:player:{userId}
    CHESS_PLAYER: (userId) => `gameMatching:chess:player:${userId}`,
    CARO_PLAYER: (userId) => `gameMatching:caro:player:${userId}`,

    // Lock để tránh race condition khi match
    MATCH_LOCK: "gameMatching:lock"
};

class GameMatching {
    constructor() {
        // Không cần pendingPlayer trong memory nữa
        // Tất cả sẽ lưu trong Redis
    }

    /**
     * Thêm người chơi vào hàng đợi Redis
     * @param {string} type - Loại game: 'chess' hoặc 'caro'
     * @param {Object} player - Thông tin người chơi
     * @returns {Promise<boolean>}
     */
    async _addNewPendingPlayer(type, player) {
        try {
            const key = type === 'chess' ? REDIS_KEYS.CHESS_WAITING : REDIS_KEYS.CARO_WAITING;
            const playerKey = type === 'chess'
                ? REDIS_KEYS.CHESS_PLAYER(player.id)
                : REDIS_KEYS.CARO_PLAYER(player.id);

            // Lưu thông tin chi tiết người chơi
            const playerData = JSON.stringify({
                id: player.id,
                stat: player.stat,
                joinedAt: Date.now()
            });

            // Dùng pipeline để atomic operation
            const pipeline = client.multi();

            // Thêm vào Sorted Set với score là Elo
            pipeline.zAdd(key, [player.stat.elo, player.id]);

            // Lưu thông tin chi tiết vào Hash với TTL
            pipeline.set(playerKey, playerData, { EX: MATCH_TIMEOUT });

            await pipeline.exec();

            console.log(`[GameMatching] Added player ${player.id} to ${type} waiting queue`);
            return true;
        } catch (err) {
            console.error(`[GameMatching] Error adding pending player: ${err.message}`);
            return false;
        }
    }

    /**
     * Lấy thông tin người chơi cờ vua từ database
     * @param {string} userId - ID người chơi
     * @param {string} type - Loại game
     * @returns {Promise<Object|null>}
     */
    async _fetchChessPlayerInfo(userId, type) {
        if (!userId) return null;

        try {
            const chessPlayerInfo = await Chess.findById(userId)
                .select("gameType")
                .lean(); // Sử dụng lean() để tối ưu performance

            // Filter theo gameType
            if (!chessPlayerInfo || !chessPlayerInfo.gameType) return null;

            // Lấy thông tin của gameType cụ thể
            const gameInfo = chessPlayerInfo.gameType.find(g => g.name === type);
            if (!gameInfo) return null;

            return {
                id: userId,
                stat: gameInfo
            };
        } catch (error) {
            console.error(`[GameMatching] Error fetching chess player: ${error.message}`);
            return null;
        }
    }

    /**
     * Tìm đối thủ cho người chơi cờ vua
     * @param {Object} player - Thông tin người chơi
     * @param {Object} filter - Bộ lọc match
     * @returns {Promise<Object>} - { semaphore, competitor }
     */
    async _chessGameMatching(player, filter) {
        try {
            const { classify, classifyGame, elo, gameType } = filter;
            if (classify === null || elo === null || gameType === null) {
                return { semaphore: 1 };
            }

            const key = REDIS_KEYS.CHESS_WAITING;

            // Tìm người chơi có Elo gần nhất trong khoảng THRESHOLD
            // Sử dụng ZRANGE để lấy người chơi trong khoảng Elo
            const minElo = Math.max(0, elo - THRESHOLD);
            const maxElo = classify ? elo + THRESHOLD : 0;

            // Lấy danh sách người chơi trong khoảng Elo, giới hạn 30 người
            const candidates = await client.zRange(key, minElo, maxElo, { BY: "SCORE", LIMIT: 30 });

            if (candidates.length === 0) {
                return { semaphore: 3 };
            }

            // Lọc và tìm người chơi phù hợp
            let bestMatch = null;
            let minDiff = Infinity;

            for (const candidateId of candidates) {
                // Lấy thông tin chi tiết của ứng viên
                const playerKey = REDIS_KEYS.CHESS_PLAYER(candidateId);
                const playerData = await client.get(playerKey);

                if (!playerData) {
                    // Nếu không có dữ liệu, remove khỏi queue
                    await client.zRem(key, candidateId);
                    continue;
                }

                try {
                    const candidate = JSON.parse(playerData);

                    // Kiểm tra classify và classifyGame
                    if (!classify && classify === candidate.stat.classify) {
                        const tcm = candidate.stat.totalClassifyMatch || 0;
                        if (classifyGame - 1 <= tcm && tcm <= classifyGame + 1) {
                            return {
                                semaphore: 2,
                                competitor: candidate
                            };
                        }
                    } else if (classify && classify === candidate.stat.classify) {
                        const diff = Math.abs(elo - candidate.stat.elo);
                        if (diff < minDiff) {
                            minDiff = diff;
                            bestMatch = candidate;
                        }
                    }
                } catch (err) {
                    console.error(`[GameMatching] Error parsing candidate data: ${err.message}`);
                    await client.zRem(key, candidateId);
                }
            }

            if (bestMatch) {
                return {
                    semaphore: 2,
                    competitor: bestMatch
                };
            }

            return { semaphore: 3 };
        } catch (err) {
            console.error(`[GameMatching] Error in chess matching: ${err.message}`);
            return { semaphore: 1 };
        }
    }

    /**
     * Tạo match cờ vua mới
     * @param {Object} participants - Thông tin người tham gia
     * @param {string} mode - Chế độ chơi: 'blitz' hoặc 'rapid'
     * @returns {Promise<Object>} - { chessMatchId }
     */
    async _createChessMatch(participants, mode) {
        try {
            const { white, black } = participants;

            const chessMatch = new ChessMatch({
                mode,
                white: white.id,
                whiteElo: white.elo,
                black: black.id,
                blackElo: black.elo,
                time: mode === "blitz" ? BLITZ : RAPID,
                createdAt: new Date()
            });

            await chessMatch.save();
            console.log(`[GameMatching] Created chess match ${chessMatch._id} between ${white.id} and ${black.id}`);

            return chessMatch._id
        } catch (err) {
            console.error(`[GameMatching] Error creating chess match: ${err.message}`);
            throw err;
        }
    }

    /**
     * Xóa người chơi khỏi hàng đợi Redis
     * @param {string} type - Loại game
     * @param {string} userId - ID người chơi
     */
    async _removePlayerFromQueue(type, userId) {
        try {
            const key = type === 'chess' ? REDIS_KEYS.CHESS_WAITING : REDIS_KEYS.CARO_WAITING;
            const playerKey = type === 'chess'
                ? REDIS_KEYS.CHESS_PLAYER(userId)
                : REDIS_KEYS.CARO_PLAYER(userId);

            const pipeline = client.multi();
            pipeline.zRem(key, userId);
            pipeline.del(playerKey);
            await pipeline.exec();

            console.log(`[GameMatching] Removed player ${userId} from ${type} queue`);
        } catch (err) {
            console.error(`[GameMatching] Error removing player from queue: ${err.message}`);
        }
    }

    /**
     * Xử lý matching cho game cờ vua
     * @param {Object} info - Thông tin người chơi
     * @param {string} type - Loại game
     * @returns {Promise<Object>}
     */
    async _handleChessMatching(info) {
        const { id, gameType } = info;
        if (!id || !gameType) return { status: "error", res: null };

        // Lấy thông tin người chơi từ database
        const player = await this._fetchChessPlayerInfo(id, gameType);
        if (!player) {
            console.log(`[GameMatching] Player ${id} not found`);
            return { status: "error", res: null };
        }

        // Lấy filter từ stat của player
        const filter = {
            classify: player.stat.classify || false,
            classifyGame: player.stat.totalClassifyMatch || 0,
            elo: player.stat.elo || 0,
            gameType: gameType
        };

        // Tìm đối thủ
        const { semaphore, competitor } = await this._chessGameMatching(player, filter);

        if (semaphore === 1) {
            console.log(`[GameMatching] ${semaphores[semaphore]} for player ${id}`);
            return { status: "error", res: null };
        }

        if (semaphore === 2 && competitor) {
            // Tìm thấy đối thủ, tạo match
            try {
                const chessMatchId = await this._createChessMatch(
                    {
                        white: {
                            id: player.id,
                            elo: player.stat.elo
                        },
                        black: {
                            id: competitor.id,
                            elo: competitor.stat.elo
                        }
                    },
                    gameType
                );

                // Xóa cả 2 người chơi khỏi hàng đợi
                await Promise.all([
                    this._removePlayerFromQueue('chess', player.id),
                    this._removePlayerFromQueue('chess', competitor.id)
                ]);

                // Gửi thông báo qua socket
                Socs.emitToUser(player.id, "create:chess:match", { matchId: chessMatchId });

                Socs.emitToUser(competitor.id, "create:chess:match", { matchId: chessMatchId });

                console.log(`[GameMatching] Match created successfully: ${chessMatchId}`);
                return { status: "ok", res: chessMatchId };

            } catch (err) {
                console.error(`[GameMatching] Error creating match: ${err.message}`);
                // Nếu tạo match thất bại, thêm lại người chơi vào hàng đợi
                await this._addNewPendingPlayer('chess', player);
                return null;
            }
        }

        if (semaphore === 3) {
            // Không tìm thấy đối thủ, thêm vào hàng đợi
            const added = await this._addNewPendingPlayer('chess', player);
            if (added) {
                console.log(`[GameMatching] Player ${id} added to waiting queue`);
            }
            return { status: "waiting", res: null };
        }

        return { status: "error", res: null };
    }

    /**
     * Xử lý matching cho game caro
     * @param {Object} info - Thông tin người chơi
     * @returns {Promise<Object|null>}
     */
    async _handleCaroMatching(info) {
        // TODO: Implement caro matching logic
        // Tương tự như chess nhưng với Caro model
        console.log('[GameMatching] Caro matching not implemented yet');
        return null;
    }

    /**
     * Main matching function
     * @param {Object} info - Thông tin người chơi { id, gameType }
     * @param {string} type - Loại game: 'chess' hoặc 'caro'
     * @returns {Promise<Object|null>}
     */
    async matching(info, type) {
        try {
            console.log(`[GameMatching] Matching request for ${type} from user ${info.id}`);

            switch (type) {
                case "chess":
                    return await this._handleChessMatching(info);

                case "caro":
                    return await this._handleCaroMatching(info);

                default:
                    console.log(`[GameMatching] Unknown game type: ${type}`);
                    return null;
            }
        } catch (err) {
            console.error(`[GameMatching] Error in gameMatching: ${err.message}`);
            // Nếu có lỗi, đảm bảo xóa player khỏi queue để tránh bị stuck
            if (info && info.id) {
                await this._removePlayerFromQueue(type, info.id);
            }
            return null;
        }
    }

    /**
     * Cleanup - Xóa tất cả người chơi hết hạn trong hàng đợi
     * Nên chạy scheduled job mỗi vài phút
     */
    async cleanupExpiredPlayers() {
        try {
            const now = Date.now();
            const keys = [REDIS_KEYS.CHESS_WAITING, REDIS_KEYS.CARO_WAITING];

            for (const key of keys) {
                const players = await client.zRange(key, 0, -1);
                for (const playerId of players) {
                    const playerKey = key === REDIS_KEYS.CHESS_WAITING
                        ? REDIS_KEYS.CHESS_PLAYER(playerId)
                        : REDIS_KEYS.CARO_PLAYER(playerId);

                    const data = await client.get(playerKey);
                    if (data) {
                        try {
                            const player = JSON.parse(data);
                            // Nếu đã quá timeout, xóa khỏi queue
                            if (now - player.joinedAt > MATCH_TIMEOUT * 1000) {
                                await this._removePlayerFromQueue(
                                    key === REDIS_KEYS.CHESS_WAITING ? 'chess' : 'caro',
                                    playerId
                                );
                                console.log(`[GameMatching] Removed expired player ${playerId}`);
                            }
                        } catch (err) {
                            console.error(`[GameMatching] Error parsing player data: ${err.message}`);
                        }
                    } else {
                        // Nếu không có data, xóa khỏi queue
                        await client.zRem(key, playerId);
                    }
                }
            }
        } catch (err) {
            console.error(`[GameMatching] Error in cleanup: ${err.message}`);
        }
    }
}

// Export singleton instance
const gameMatching = new GameMatching();

// Khởi chạy cleanup job mỗi 30 giây (tùy chọn)
setInterval(() => {
    gameMatching.cleanupExpiredPlayers();
}, MATCH_TIMEOUT * 1000);

export default gameMatching;