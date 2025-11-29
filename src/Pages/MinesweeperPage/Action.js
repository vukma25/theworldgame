export const SET_ROW_ACTION = 'SET_ROW'
export const SET_COL_ACTION = 'SET_COL'
export const SET_PRO_ACTION = 'SET_PRO'
export const SET_DURATION_ACTION = 'SET_DURATION'
export const TOGGLE_SETTING_ACTION = 'HIDDEN_SETTING'
export const SELECT_CHANGE_ACTION = 'SELECT_CHANGE'
export const SET_TIME_ACTION = 'SET_TIME'
export const IS_IN_GAME_ACTION = 'IN_GAME'
export const RESET_SETTING_ACTION = 'RESET_SETTING'
export const RESTART_GAME_ACTION = 'RESTART_GAME'
export const RIGHT_CLICK_CELL_ACTION = 'RIGHT_CLICK_CELL'
export const LEFT_CLICK_CELL_ACTION = 'LEFT_CLICK_CELL'
export const RUN_OUT_OF_TIME_ACTION = 'RUN_OUT_OF'
export const SET_TOOL_ACTION = 'SET_TOOL'


export const setTime = () => {
    return {
        type: SET_TIME_ACTION
    }
}

export const setToggleSetting = () => {
    return {
        type: TOGGLE_SETTING_ACTION
    }
}

export const setInGame = () => {
    return {
        type: IS_IN_GAME_ACTION
    }
}

export const setResetSetting = () => {
    return {
        type: RESET_SETTING_ACTION
    }
}

export const setRestartGame = () => {
    return {
        type: RESTART_GAME_ACTION
    }
}

export const setRow = payload => {
    return {
        type: SET_ROW_ACTION,
        payload
    }
}
export const setCol = payload => {
    return {
        type: SET_COL_ACTION,
        payload
    }
}
export const setPro = payload => {
    return {
        type: SET_PRO_ACTION,
        payload
    }
}
export const setSelect = payload => {
    return {
        type: SELECT_CHANGE_ACTION,
        payload
    }
}
export const setDuration = payload => {
    return {
        type: SET_DURATION_ACTION,
        payload
    }
}

export const setCells = payload => {
    return {
        type: LEFT_CLICK_CELL_ACTION,
        payload
    }
}

export const setFlag = payload => {
    return {
        type: RIGHT_CLICK_CELL_ACTION,
        payload
    }
}

export const runOutOfTime = payload => {
    return {
        type: RUN_OUT_OF_TIME_ACTION,
        payload
    }
}

export const setToolDisplay = payload => {
    return {
        type: SET_TOOL_ACTION,
        payload
    }
}