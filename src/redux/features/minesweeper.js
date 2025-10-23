import { createSlice } from '@reduxjs/toolkit'

const levels = [
    {
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
        'cells': []
    },
    {
        'level': 1,
        'row': 10,
        'col': 10,
        'proportion': 1.5,
        'mine': 15,
        'flag': 15,
        'setTime': {
            isTime: true,
            duration: 300
        },
        'cells': new Array(100).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 2,
        'row': 15,
        'col': 15,
        'proportion': 2.5,
        'mine': 37,
        'flag': 37,
        'setTime': {
            isTime: true,
            duration: 420
        },
        'cells': new Array(225).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 3,
        'row': 25,
        'col': 25,
        'proportion': 4,
        'mine': 100,
        'flag': 100,
        'setTime': {
            isTime: true,
            duration: 600
        },
        'cells': new Array(625).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 4,
        'row': 20,
        'col': 20,
        'proportion': 1.5,
        'mine': 30,
        'flag': 30,
        'setTime': {
            isTime: true,
            duration: 600
        },
        'cells': new Array(400).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        }),
        'hidden': false
    }
]

const initialState = {
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
        'style': {
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

const mineSweeperSlice = createSlice({
    name: "minesweeper",
    initialState,
    reducers: {
        rows: (state, action) => {
            state.row = action.payload
            state.mine = Math.floor((state.col + action.payload) / 2 * state.proportion)
            state.flag = Math.floor((state.col + action.payload) / 2 * state.proportion)
            state.cells = new Array(action.payload * state.col).fill({
                opened: false,
                flag: false,
                isMine: false,
                mine: 0
            })
            state.tool.style.display = "none"
        },
        columns: (state, action) => {
            state.col = action.payload
            state.mine = Math.floor((state.row + action.payload) / 2 * state.proportion)
            state.flag = Math.floor((state.row + action.payload) / 2 * state.proportion)
            state.cells = new Array(action.payload * state.row).fill({
                opened: false,
                flag: false,
                isMine: false,
                mine: 0
            })
            state.tool.style.display = "none"
        },
        proportion: (state, action) => {
            state.proportion = action.payload
            state.mine = Math.floor((state.row + state.col) / 2 * action.payload)
            state.flag = Math.floor((state.row + state.col) / 2 * action.payload)
            state.cells = new Array(state.col * state.row).fill({
                opened: false,
                flag: false,
                isMine: false,
                mine: 0
            })
            state.tool.style.display = "none"
        },
        time: (state) => {
            state.setTime.isTime = !state.setTime.isTime
            state.tool.style.display = "none"
        },
        duration: (state, action) => {
            state.setTime.duration = action.payload
            state.tool.style.display = "none"
        },
        difficulties: (state, action) => {
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
                'isInGame': false,
                'firstClick': true,
                'gameOver': false,
                'message': '',
                'logError': '',
                ...levels[action.payload]
            }
        },
        toggleSettings: (state) => {
            state.hidden = !state.hidden
            state.tool.style.display = "none"
        },
        inGame: (state) => {
            state.isInGame = true
            state.hidden = true
            state.tool.style.display = "none"
        },
        resetSettings: (state) => {
            return {
                ...state,
                ...levels[4],
                'firstClick': true,
                'isInGame': false,
                'tool': {
                    ...state.tool,
                    'style': {
                        ...state.tool.style,
                        display: 'none'
                    }
                },
                'gameOver': false,
                'message': '',
                'logError': ''
            }
        },
        openCell: (state, action) => {
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
        },
        bindFlag: (state, action) => {
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
        },
        resetGame: (state) => {
            return {
                ...state,
                ...initialState,
                ...levels[state.level]
            }
        },
        timeout: (state, action) => {
            state.message = action.payload
            state.gameOver = true
            state.tool.style.display = "none"
        },
        tooltip: (state, action) => {
            state.tool = Object.assign(state.tool, action.payload)
        },
        unmounted: (state) => {
            return {
                ...state,
                ...initialState
            }
        }
    }
})

export const {
    rows,
    columns,
    proportion,
    time,
    duration,
    difficulties,
    toggleSettings,
    inGame,
    resetSettings,
    openCell,
    bindFlag,
    resetGame,
    timeout,
    tooltip,
    unmounted
} = mineSweeperSlice.actions

export default mineSweeperSlice.reducer