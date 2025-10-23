import { createSlice } from "@reduxjs/toolkit";
import SUDOKU_VARIANTS from '../../Pages/Sudoku/Variant'

const initialState = {
    "status": "waiting",
    "puzzle": [],
    "answers": [],
    "gameOver": false,
    "isWin": false,
    "squareActivating": null,
    "errors": {
        "times": 0,
        "square": []
    },
    "semaphore": true, //cờ hiệu để dừng thời gian
    "variant": {
        "size": 9,
        "difficulty": SUDOKU_VARIANTS[9].difficulties[1].cellsToRemove
    },
    "loading": false
}

const sudokuSlice = createSlice({
    name: "sudoku",
    initialState,
    reducers: {
        start: (state) => {
            state.status = "playing"
            state.semaphore = false
        },
        selectSquare: (state, action) => {
            state.squareActivating = action.payload
        },
        fillSquare: (state, action) => {
            state.puzzle = action.payload.puzzle
            state.answers = action.payload.answers
            state.errors = action.payload.errors
        },
        newGame: (state, action) => {
            const { puzzle, answers } = action.payload ?? { puzzle: [], answers: [] }
            state.status = "waiting"
            state.puzzle = puzzle
            state.answers = answers
            state.gameOver = false
            state.squareActivating = null
            state.errors.times = 0
            state.errors.square = []
            state.semaphore = true
        },
        setGameOver: (state, action) => {
            const { gameOver, isWin } = action.payload
            state.gameOver = gameOver
            state.isWin = isWin
            state.squareActivating = null
            state.semaphore = true
        },
        selectVariant: (state, action) => {
            const { size, difficulty } = action.payload
            state.variant = {
                size,
                difficulty
            }
        },
        loading: (state, action) => {
            state.loading = action.payload
        },
        unmountSquare: (state) => {
            state.squareActivating = null
        }
    }
})

export const {
    start,
    selectSquare,
    fillSquare,
    newGame,
    setGameOver,
    selectVariant,
    loading,
    unmountSquare
} = sudokuSlice.actions

export default sudokuSlice.reducer