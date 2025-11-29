import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import SideBar from './SideBar'
import Header from './Main/Header'
import ChatBox from './Main/ChatBox'
import Typing from './Main/Typing'

export default function Chat() {
    const { socket } = useSelector((state) => state.socket)
    
    useEffect(() => {
        if (socket) {socket.emit("join:conversation")}
    }, [socket])

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <SideBar />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <ChatBox />
                <Typing />
            </Box>
        </Box>
    );
};
