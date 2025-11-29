import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    'status': 'waiting',
    'targetParagraph': [],
    'userInput': [],
    'currentIndex': 0,
    'startTime': null,
    'wpm': 0,
    'accuracy': 100,
    'incorrectChars': 0,
    'correctChars': 0,
    'totalChars': 0,
    'options': {
        'duration': 60,
        'useUpper': false,
        'useMarkAndArticle': false
    }
}

const fastFingerSlice = createSlice({
    name: "fastFinger",
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload
        },
        typing: (state, action) => {
            const {
                buffer,
                newIndex,
                correct,
                incorrect,
                wpm,
                accuracy
            } = action.payload

            state.userInput = [...state.userInput, buffer]
            state.currentIndex = newIndex
            state.wpm = wpm
            state.accuracy = accuracy
            state.incorrectChars = incorrect
            state.correctChars = correct
            state.totalChars = state.totalChars + state.targetParagraph[newIndex - 1].length
        },
        changeOptions: (state, action) => {
            state.options = Object.assign(state.options, action.payload)
        },
        newGame: (state, action) => {
            state.targetParagraph = action.payload
            state.userInput = []
            state.currentIndex = 0
            state.startTime = Date.now()
            state.wpm = 0
            state.accuracy = 100
            state.incorrectChars = 0
            state.correctChars = 0
            state.totalChars = 0
        },
        exit: (state) => {
            state.status = 'waiting'
            state.targetParagraph = []
            state.userInput = []
            state.currentIndex = 0
            state.startTime = null
            state.wpm = 0
            state.accuracy = 100
            state.incorrectChars = 0
            state.correctChars = 0
            state.totalChars = 0
        }
    }
})

export const {
    setStatus,
    typing,
    changeOptions,
    newGame,
    exit
} = fastFingerSlice.actions

export default fastFingerSlice.reducer