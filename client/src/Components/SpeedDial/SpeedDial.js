import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, SpeedDial,
    SpeedDialAction, SpeedDialIcon,
} from '@mui/material';
import { Home, SportsEsports, Chat, Leaderboard } from '@mui/icons-material';


const actions = [
    { icon: <Home />, name: 'Home', path: '/' },
    { icon: <SportsEsports />, name: 'Games', path: '/games' },
    { icon: <Chat />, name: 'Chat', path: '/chat' },
    { icon: <Leaderboard />, name: 'Leaderboard', path: '/leaderboard' }
];

const override = {
    'button[role="menuitem"]': {
        transition: "backgroundColor .2s, color .2s",
        '&:hover': {
            background: "#1976d2",
            color: "var(--cl-white-pure)"
        }
    },
    '& .MuiButtonBase-root': {
        width: "4.5rem",
        height: "4.5rem",

        '& .MuiSpeedDialIcon-root': {
            height: 20,

            '& .MuiSpeedDialIcon-icon': {
                fontSize: "2rem"
            }
        }
    },
    position: 'absolute',
    bottom: 10,
    right: 5,
}

const deactivate = {
    position: "fixed",
    height: "4.5rem",
    width: "4.5rem",
    flexGrow: 1,
    right: 0,
    bottom: "1.5rem",
    transition: "bottom .25s",
    zIndex: 99
}


export default function SpeedDialTooltipOpen() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(deactivate);
    const [classes] = useState(override);
    function handleOpen() {
        setOpen(true);
    };
    function handleClose() {
        setOpen(false);
    };

    function redirect(path) {
        handleClose();
        navigate(path);
    };

    useEffect(() => {
        function updatePosition() {
            const scrollTop = window.scrollY;
            if (scrollTop > 0) {
                setActive(prev => ({
                    ...prev,
                    bottom: "6rem"
                    // transform: "translateY(-5rem)"
                }))
            } else {
                setActive(prev => ({
                    ...prev,
                    bottom: "1.5rem"
                    // transform: "translateY(0rem)"
                }))
            }
        }

        window.addEventListener("scroll", updatePosition)

        return () => window.removeEventListener("scroll", updatePosition)
    }, [])

    if (window.location.pathname === "/theworldgame/chat") { return <></> }

    return (
        <Box sx={{ ...active }}>
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={classes}
                icon={<SpeedDialIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}
            >
                {actions.map(({ icon, name, path }) => (
                    <SpeedDialAction
                        key={name}
                        icon={icon}
                        slotProps={{
                            tooltip: {
                                open: true,
                                title: name
                            },
                        }}
                        onClick={() => redirect(path)}
                    />
                ))}
            </SpeedDial>
        </Box>
    );
}
