import { createSlice } from "@reduxjs/toolkit";
import { maps } from "../../Pages/Snake/Static";

const initialState = {
    mode: "no_limit",
    status: "waiting",
    size: 24,
    snake: [[10, 4], [10, 3], [10, 2]],
    food: {type: "normal", fd: [5, 7]},
    speed: 150,
    direction: "RIGHT",
    pause: false,
    score: 0,
    extraScore: 0,
    map: null
}

const snakeSlice = createSlice({
    name: "snake",
    initialState,
    reducers: {
        changeDirection: (state, action) => {
            state.direction = action.payload
        },
        spawnFood: (state, action) => {
            state.food = action.payload
        },
        setSnake: (state, action) => {
            state.snake = action.payload
        },
        setStatus: (state, action) => {
            state.status = action.payload
        },
        setSpeed: (state, action) => {
            state.speed = action.payload
        },
        setPause: (state) => {
            state.pause = !state.pause
        },
        setSize: (state, action) => {
            const { sk, fd, size } = action.payload
            state.size = size
            state.snake = sk
            state.food = fd
        },
        setMode: (state, action) => {
            state.mode = action.payload

            if (action.payload !== "map") {
                state.size = 24
                state.map = null
                return
            }

            state.map = 0
        },
        setMap: (state, action) => {
            const id = action.payload

            state.snake = maps[id].snake
            state.food = maps[id].food
            state.direction = maps[id].direction
            state.map = id
        },
        snakeAte: (state, action) => {
            const { type, score } = action.payload
            if (type === 'normal') {
                state.score += score
            } else {
                state.extraScore += score
            }
        },
        setNewGame: (state, action) => {
            const { snake, food, direction } = action.payload

            state.snake = snake
            state.status = "waiting"
            state.food = food
            state.pause = false
            state.score = 0
            state.direction = direction
        },
    }
})

export const {
    changeDirection,
    spawnFood,
    setSnake,
    setStatus,
    setSpeed,
    setPause,
    setSize,
    setMode,
    setMap,
    snakeAte,
    setNewGame
} = snakeSlice.actions

export default snakeSlice.reducer