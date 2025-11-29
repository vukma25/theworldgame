import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "waiting",
    name: "Caro",
    size: 15,
    board: Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => 0)),
    turn: 1,
    player: 1,
    mode: "AI",
    aiDifficulty: "medium",
    aiThinking: false,
    line: null,
    winner: "Undetermined"
}

const caroSlice = createSlice({
    name: "caro",
    initialState,
    reducers: {
        move: (state, action) => {
            state.board = action.payload
            state.turn = state.turn === 1 ? 2 : 1
        },
        aiThinking: (state, action) => {
            state.aiThinking = action.payload
        },
        setMode: (state, action) => {
            state.mode = action.payload
        },
        setAIDifficulty: (state, action) => {
            state.aiDifficulty = action.payload
        },
        setCaroVariant: (state, action) => {
            const { name, board, size } = action.payload

            state.name = name
            state.board = board
            state.size = size
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setNewGame: (state) => {
            state.status = "waiting"
            state.board = Array.from({ length: state.size }, () => Array.from({ length: state.size }, () => 0))
            state.turn = 1
            state.line = null
            state.winner = "Undetermined"
        },
        setLine: (state, action) => {
            const line = action.payload
            state.line = line

            if (!line) return

            const { r, c } = line[0]
            const winner = state.board[r][c] === 1 ? 'X' : 'O'
            state.winner = winner

        },
        setPlayerSide: (state, action) => {
            state.player = action.payload
        }
    }
})

export const {
    move, aiThinking, setMode, setAIDifficulty,
    setCaroVariant, setStatus, setNewGame, setLine,
    setPlayerSide
} = caroSlice.actions

export default caroSlice.reducer