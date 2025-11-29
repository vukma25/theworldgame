import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: false
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        open: (state) => {
            state.value = true
        },
        close: (state) => {
            state.value = false
        }
    }
})

export const { open, close } = modalSlice.actions
export default modalSlice.reducer