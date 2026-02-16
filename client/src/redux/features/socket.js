import { createSlice } from "@reduxjs/toolkit";
import { io } from 'socket.io-client'


const initialState = {
    socket: null,
}

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        connectSocket: (state, action) => {
            const accessToken = action.payload

            if (state.socket) return
            const socket = io(`${process.env.NODE_ENV === "development" ? process.env.REACT_APP_SOCKET_URL : process.env.REACT_APP_SOCKET_URL_DEPLOY}`, {
                auth: { accessToken }
            });

            state.socket = socket
        },
        disconnectSocket: (state) => {
            if (state.socket) {
                state.socket.disconnect()
                state.socket = null
                state.usersOnline = []
                console.log("Disconnected")
            }
        }
    }
})

export const { connectSocket, disconnectSocket } = socketSlice.actions
export default socketSlice.reducer