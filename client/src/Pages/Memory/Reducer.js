import ACTIONS from "./Actions"

export const defaultState = {
    status: "waiting",
    rows: 6,
    cols: 6,
    moves: 0,
    cards: [],
    matches: 0,
    pairs: 18,
    useTime: false,
    duration: 60,
}

export const reducer = (state, action) => {
    
    switch (action.type) {
        case ACTIONS.SET_CARD:
            return {
                ...state,
                cards: action.payload
            }
        case ACTIONS.RESET_GAME:
            return {
                ...state,
                status: "waiting",
                cards: action.payload,
                matches: 0,
                moves: 0
            }
        case ACTIONS.MATCH_CARD:
            const { moves, matches, cards } = action.payload
            
            return {
                ...state,
                moves,
                matches,
                cards
            }
        case ACTIONS.CHANGE_COL:
            return {
                ...state,
                cols: action.payload,
                pairs: (state.rows * action.payload) / 2
            }
        case ACTIONS.CHANGE_ROW:
            return {
                ...state,
                rows: action.payload,
                pairs: (state.cols * action.payload) / 2
            }
        case ACTIONS.CHANGE_DURATION:
            return {
                ...state,
                duration: action.payload
            }
        case ACTIONS.USE_TIME:
            return {
                ...state,
                useTime: !state.useTime
            }
        case ACTIONS.LISTEN_STATUS:
            return {
                ...state,
                status: action.payload
            }
        default:
            throw new Error("Invalid action")
    }
}