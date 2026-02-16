import { Fragment, useState, useEffect, createContext } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import SideBar from './SideBar'
import Header from './Main/Header'
import ChatBox from './Main/ChatBox'
import Typing from './Main/Typing'

export const StateContext = createContext()

export default function Chat() {
    const { socket } = useSelector((state) => state.socket)
    const { selectedConversation } = useSelector((state) => state.event)
    const [sidebar, setSidebar] = useState(false)

    function handleClose() {
        setSidebar(false)
    }
    function handleOpen() {
        setSidebar(true)
    }

    useEffect(() => {
        if (socket) { socket.emit("join:conversation") }
    }, [socket])

    return (
        <StateContext.Provider value={{ sidebar, handleClose, handleOpen }}>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <SideBar />
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Header />

                    {!selectedConversation?.disable ?
                        <Fragment>
                            <ChatBox />
                            <Typing />
                        </Fragment>
                        :
                        <Typography
                            variant="h5"
                            sx={{ width: "100%", textAlign: "center", mt: 2 }}
                        >
                            Your friend currently unfriend with you. So you cannot send any message
                        </Typography>
                    }</Box>
            </Box>
        </StateContext.Provider>
    );
};
