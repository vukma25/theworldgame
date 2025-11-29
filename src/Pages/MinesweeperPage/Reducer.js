import {
    SET_ROW_ACTION,
    SET_COL_ACTION,
    SET_PRO_ACTION,
    SET_DURATION_ACTION,
    TOGGLE_SETTING_ACTION,
    SELECT_CHANGE_ACTION,
    SET_TIME_ACTION,
    IS_IN_GAME_ACTION,
    RESET_SETTING_ACTION,
    RESTART_GAME_ACTION,
    RIGHT_CLICK_CELL_ACTION,
    LEFT_CLICK_CELL_ACTION,
    RUN_OUT_OF_TIME_ACTION,
    SET_TOOL_ACTION
} from './Action';
import {
    levels
} from './Functions';

export const initialState = {
    //specific
    'level': 0,
    'row': 0,
    'col': 0,
    'proportion': 0,
    'mine': 0,
    'flag': 0,
    'setTime': {
        isTime: true,
        duration: 0
    },
    'cells': [],
    
    //general
    'tool': {
        'style' : {
            display: 'none',
            top: 40,
            left: 40
        },
        'index': null
    },
    'hidden': false,
    'isInGame': false,
    'firstClick': true,
    'gameOver': false,
    'message': '',
    'logError': ''
}

export const reducer = (state, action) => {

    switch (action.type) {
        case SET_ROW_ACTION:
            return {
                ...state,
                'row': action.payload,
                'mine': Math.floor((state.col + action.payload) / 2 * state.proportion),
                'flag': Math.floor((state.col + action.payload) / 2 * state.proportion),
                'cells': new Array(action.payload * state.col).fill({
                    opened: false,
                    flag: false,
                    isMine: false,
                    mine: 0
                }),
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case SET_COL_ACTION:
            return {
                ...state,
                'col': action.payload,
                'mine': Math.floor((state.row + action.payload) / 2 * state.proportion),
                'flag': Math.floor((state.row + action.payload) / 2 * state.proportion),
                'cells': new Array(action.payload * state.row).fill({
                    opened: false,
                    flag: false,
                    isMine: false,
                    mine: 0
                }),
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case SET_PRO_ACTION:
            return {
                ...state,
                'proportion': action.payload,
                'mine': Math.floor((state.col + state.row) / 2 * action.payload),
                'flag': Math.floor((state.col + state.row) / 2 * action.payload),
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case SET_TIME_ACTION:
            return {
                ...state,
                'setTime': {
                    ...state.setTime,
                    'isTime': !state.setTime.isTime
                },
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case SET_DURATION_ACTION:
            return {
                ...state,
                'setTime': {
                    ...state.setTime,
                    'duration': action.payload
                },
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case SELECT_CHANGE_ACTION:
            return {
                ...state,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    },
                    'index': null
                },
                'firstClick': true,
                ...levels[action.payload]
            }
        case TOGGLE_SETTING_ACTION:
            return {
                ...state,
                'hidden': !state.hidden,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case IS_IN_GAME_ACTION:
            return {
                ...state,
                'isInGame': true,
                'hidden': true,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case RESET_SETTING_ACTION:
            return {
                ...state,
                ...levels[4],
                'isInGame': false,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case LEFT_CLICK_CELL_ACTION:
            return {
                ...state,
                ...action.payload,
                'firstClick': state.level !== 4 || state.isInGame ? 
                    false : action.payload.firstClick,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case RIGHT_CLICK_CELL_ACTION:
            return {
                ...state,
                ...action.payload,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                }
            }
        case RESTART_GAME_ACTION: 
            return {
                ...state,
                ...initialState,
                ...levels[state.level]
            }
        case RUN_OUT_OF_TIME_ACTION:
            return {
                ...state,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                },
                'message': action.payload,
                'gameOver': true
            }
        case SET_TOOL_ACTION:
            return {
                ...state,
                'tool': {
                    ...state.tool,
                    ...action.payload
                }
            }
        default:
            throw new Error('Invalid action')
    }
}