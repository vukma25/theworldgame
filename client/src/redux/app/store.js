
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
import charReducer from "../features/chat"
import authSlice from "../features/auth"
import navbarReducer from "../features/navbar"
import modalReducer from "../features/modal";
import socketReducer from "../features/socket"
import eventSocketReducer from "../features/eventSocket"
import userReducer from "../features/user"


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth', 'event']
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
    chat: charReducer,
    auth: authSlice,
    navbar: navbarReducer,
    modal: modalReducer,
    socket: socketReducer,
    event: eventSocketReducer,
    user: userReducer,
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: ['chess/setChess','socket/connectSocket', 'message/send/pending',
                    'message/send/fulfilled', 'message/send/rejected', 'message/read/pending', 'message/read/pending', 'message/read/pending',
                    FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // Ignore these field paths in all actions
                ignoredActionPaths: ['payload.chess', 'payload.socket', 'payload.user'],
                // Ignore these paths in the state
                ignoredPaths: ['chess.chess', 'socket.socket', 'user'],
            },
        }),
})

export let persistor = persistStore(store)