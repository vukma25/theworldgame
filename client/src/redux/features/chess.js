import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chess: null,
    chessGameId: null,
    settings: {
        showHints: true,
        autoRotate: false,
        animation: true,
        showCoordinates: false,
        showBorder: true,
        lightSquareColor: '#FFFFFF',
        darkSquareColor: '#5309B3'
    },
    settingsBoard: false,
    mode: {},
    aiThinking: false,
    playerSide: 'w',
    status: {
        cur: '',
        des: ''
    }
}

const chessSlice = createSlice({
    name: "chess",
    initialState,
    reducers: {
        setChess: (state, action) => {
            state.chess = action.payload
        },
        setChessGameId: (state, action) => {
            state.chessGameId = action.payload
        },
        setSettings: (state, action) => {
            state.settings = action.payload
        },
        setSettingsBoard: (state, action) => {
            state.settingsBoard = action.payload
        },
        setMode: (state, action) => {
            state.mode = action.payload
        },
        setAiThinking: (state, action) => {
            state.aiThinking = action.payload
        },
        setPlayerSide: (state, action) => {
            state.playerSide = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        }
    }
})

export const {
    setChess,
    setSettings,
    setSettingsBoard,
    setMode,
    setAiThinking,
    setPlayerSide,
    setStatus, setChessGameId,
} = chessSlice.actions

export default chessSlice.reducer