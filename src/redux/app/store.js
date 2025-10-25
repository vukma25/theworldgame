import { configureStore } from "@reduxjs/toolkit";
import mineSweeperReducer from "../features/minesweeper";
import memoryReducer from "../features/memory";
import sudokuReducer from "../features/sudoku";
import wordleReduer from "../features/wordle";
import fastFingerReducer from "../features/fastfinger"
import navbarReducer from "../features/navbar"
import modalReducer from "../features/modal";

export const store = configureStore({
    reducer: {
        memory: memoryReducer,
        minesweeper: mineSweeperReducer,
        sudoku: sudokuReducer,
        wordle: wordleReduer,
        fastfinger: fastFingerReducer,
        navbar: navbarReducer,
        modal: modalReducer
    }
})