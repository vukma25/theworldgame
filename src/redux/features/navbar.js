import { createSlice } from '@reduxjs/toolkit'

const initialState =  {
    dropdown: false,
    mobileControl: {
        menu: false,
        search: false
    },
    auth: '',
    suggestBox: false,
    query: ''
}

const navbarSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        setDropdown(state) {
            state.dropdown = !state.dropdown
        },
        controlBoth(state) {
            state.mobileControl.menu = false
            state.mobileControl.search = false
        },
        controlMenu(state) {
            state.mobileControl.menu = !state.mobileControl.menu
            state.mobileControl.search = false
        },
        controlSearch(state) {
            state.mobileControl.search = !state.mobileControl.search
            state.mobileControl.menu = false
        },
        setAuth(state, action) {
            state.auth = action.payload
        },
        setSuggestBox(state) {
            state.suggestBox = !state.suggestBox
        },
        setQuery(state, action) {
            state.query = action.payload
        }
    }
})

export const {
    setDropdown,
    controlBoth,
    controlMenu,
    controlSearch,
    setAuth,
    setSuggestBox,
    setQuery
} = navbarSlice.actions

export default navbarSlice.reducer