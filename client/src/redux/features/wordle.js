import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lengthWord: 4,
    targetWord: '', // từ được random từ kho từ: đoán
    currentGuess: '', // từ đang đoán hiện tại
    guesses: [], // chuỗi lịch sử các từ đã đoán
    gameStatus: 'playing',
    currentRow: 0,
    keyboardStatus: {}
}

const wordleSlice = createSlice({
    name: "wordle",
    initialState,
    reducers: {
        selectLen: (state, action) => {
            state.lengthWord = action.payload
        },
        clearGuess: (state) => {
            state.currentGuess = ''
        },
        typingKey: (state, action) => {
            state.currentGuess += action.payload
        },
        deleteKey: (state) => {
            state.currentGuess = state.currentGuess.slice(0, -1)
        },
        guessesChain: (state, action) => {
            state.guesses = action.payload
        },
        jumpRow: (state, action) => {
            state.currentRow = action.payload
        },
        setStatus: (state, action) => {
            state.gameStatus = action.payload
        },
        keyboard: (state, action) => {
            state.keyboardStatus = action.payload
        },
        restart: (state, action) => {
            state.gameStatus = "playing"
            state.targetWord = action.payload
            state.currentGuess = ''
            state.guesses = []
            state.gameStatus = 'playing'
            state.currentRow = 0
            state.keyboardStatus = {}
        }
    }
})

export const {
    selectLen,
    clearGuess,
    typingKey,
    deleteKey,
    guessesChain,
    jumpRow,
    setStatus,
    keyboard,
    restart
} = wordleSlice.actions

export default wordleSlice.reducer