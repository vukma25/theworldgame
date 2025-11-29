import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: "waiting",
    rows: 6,
    cols: 6,
    moves: 0,
    cards: [],
    matches: 0,
    pairs: 18,
    useTime: false,
    duration: 60,
    firstClick: null,
    isBusy: false,
    semaphore: true
}

const memorySlice = createSlice({
    name: "memory",
    initialState,
    reducers: {
        setCard: (state, action) => {
            state.cards = action.payload
        },
        matchCard: (state, action) => {
            const { moves, matches, cards } = action.payload
            state.moves = moves
            state.matches = matches
            state.cards = cards
        },
        time: (state, action) => {
            state.useTime = action.payload
        },
        status: (state, action) => {
            state.status = action.payload
        },
        rows: (state, action) => {
            state.rows = action.payload
            state.pairs = (state.cols * action.payload) / 2
        },
        columns: (state, action) => {
            state.cols = action.payload
            state.pairs = (state.rows * action.payload) / 2
        },
        setDuration: (state, action) => {
            state.duration = action.payload
        },
        reset: (state, action) => {
            state.status = "waiting"
            state.cards = action.payload
            state.matches = 0
            state.moves = 0
            state.firstClick = null
            state.isBusy = false
            state.semaphore = true
        },
        first: (state, action) => {
            state.firstClick = action.payload
        },
        busy: (state, action) => {
            state.isBusy = action.payload
        },
        setSemaphore: (state, action) => {
            state.semaphore = action.payload
        },
    }
})

export const {
    setCard,
    matchCard,
    time,
    status,
    rows,
    columns,
    setDuration,
    reset,
    first,
    busy,
    setSemaphore
} = memorySlice.actions

export default memorySlice.reducer