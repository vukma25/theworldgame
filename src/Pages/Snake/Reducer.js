import ACTIONS from './Actions'
import { maps } from './Static'

export const defaultState = {
    mode: "no_limit",
    status: "waiting",
    size: 24,
    snake: [[10, 4], [10, 3], [10, 2]],
    food: [5, 7],
    speed: 150,
    direction: "RIGHT",
    pause: false,
    score: 0,
    map: null
}

export const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.LISTEN_STATUS:
            const status = action.payload
            return {
                ...state,
                status,
            }

        case ACTIONS.SPAWN_FOOD:
            return {
                ...state,
                food: action.payload
            }
        case ACTIONS.SNAKE_STATE:
            return {
                ...state,
                snake: action.payload
            }
        case ACTIONS.CHANGE_DIRECT:
            return {
                ...state,
                direction: action.payload
            }
        case ACTIONS.SETTING_SIZE:
            const { sk, fd, size } = action.payload

            return {
                ...state,
                snake: sk,
                food: fd,
                size
            }
        case ACTIONS.SETTING_MODE:
            if (action.payload !== "map") {
                return {
                    ...state,
                    mode: action.payload,
                    size: 24,
                    map: null
                }
            }
            return {
                ...state,
                mode: action.payload,
                map: 0
            }


        case ACTIONS.SELECT_MAP:
            const id = action.payload

            return {
                ...state,
                snake: maps[id].snake,
                food: maps[id].food,
                direction: maps[id].direction,
                map: id
            }
        case ACTIONS.SNAKE_ATE:
            return {
                ...state,
                score: state.score + action.payload
            }
        case ACTIONS.SET_SPEED:
            return {
                ...state,
                speed: action.payload
            }
        case ACTIONS.SET_PAUSE:
            return {
                ...state,
                pause: !state.pause
            }
        case ACTIONS.NEW_GAME:
            const { snake, food, direction } = action.payload

            return {
                ...state,
                snake,
                status: "waiting",
                food,
                pause: false,
                score: 0,
                direction
            }
        default:
            throw new Error("Invalid action")
    }
}