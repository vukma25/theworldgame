
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth']
}


const rootReducer = combineReducers({
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
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['chess/setChess', FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.chess'],
                // Ignore these paths in the state
                ignoredPaths: ['chess.chess'],
            },
        }),
})

export let persistor = persistStore(store)