const ACTIONS = {
    SET_CARD: "set_card",
    MATCH_CARD: "match_card",
    USE_TIME: "use_time",
    LISTEN_STATUS: "listen_status",
    CHANGE_ROW: "change_row",
    CHANGE_COL: "change_col",
    CHANGE_DURATION: "change_duration",
    RESET_GAME: "reset_game",
}

const createAction = (type, payload = null) => {
    if (!payload) {
        return {
            type: type
        }
    }
    return {
        type: type,
        payload: payload
    }
}

export const SETTER = {
    handleMatchCard: (payload) => createAction(ACTIONS.MATCH_CARD, payload),
    handleSetCard: (payload) => createAction(ACTIONS.SET_CARD, payload),
    handleUseTime: () => createAction(ACTIONS.USE_TIME),
    handleListenStatus: (payload) => createAction(ACTIONS.LISTEN_STATUS, payload),
    handleChangeRow: (payload) => createAction(ACTIONS.CHANGE_ROW, payload),
    handleChangeCol: (payload) => createAction(ACTIONS.CHANGE_COL, payload),
    handleChangeDuration: (payload) => createAction(ACTIONS.CHANGE_DURATION, payload),
    handleResetGame: (payload) => createAction(ACTIONS.RESET_GAME, payload) 
}

export default ACTIONS