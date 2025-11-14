import { configureStore } from "@reduxjs/toolkit";
import mineSweeperReducer from "../features/minesweeper";
import chessReducer from "../features/chess"
import memoryReducer from "../features/memory";
import sudokuReducer from "../features/sudoku";
import wordleReduer from "../features/wordle";
import fastFingerReducer from "../features/fastfinger"
import snakeReducer from "../features/snake"
import caroReducer from "../features/caro"
import authSlice from "../features/auth"
import navbarReducer from "../features/navbar"
import modalReducer from "../features/modal";

export const store = configureStore({
    reducer: {
        memory: memoryReducer,
        chess: chessReducer,
        minesweeper: mineSweeperReducer,
        sudoku: sudokuReducer,
        wordle: wordleReduer,
        fastfinger: fastFingerReducer,
        snake: snakeReducer,
        caro: caroReducer,
        auth: authSlice,
        navbar: navbarReducer,
        modal: modalReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['chess/setChess'],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.chess'],
                // Ignore these paths in the state
                ignoredPaths: ['chess.chess'],
            },
        }),
})