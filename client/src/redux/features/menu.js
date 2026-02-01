import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    hasAnchor: false,
    closeByChildren: false
}

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setAnchor: (state) => {
            state.hasAnchor = true
        },
        setClose: (state) => {
            state.hasAnchor = false
            state.closeByChildren = false
        },
        sendSignalClose: (state) => {
            state.closeByChildren = true
        }
    }
})

export const { setAnchor, setClose, sendSignalClose } = menuSlice.actions
export default menuSlice.reducer