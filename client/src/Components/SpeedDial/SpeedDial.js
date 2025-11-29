import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Backdrop, SpeedDial,
    SpeedDialAction, SpeedDialIcon,
} from '@mui/material';
import { Home, SportsEsports, Chat, Leaderboard } from '@mui/icons-material';


const actions = [
    { icon: <Home />, name: 'Home', path: '/' },
    { icon: <SportsEsports />, name: 'Games', path: '/games' },
    { icon: <Chat />, name: 'Chat', path: '/chat' },
    { icon: <Leaderboard/>, name: 'Leaderboard', path: '/leaderboard'}
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
    transform: "translateY(0)",
    transition: "transform .35s"
}

const deactivate = {
    position: "fixed",
    height: "4.5rem",
    width: "4.5rem",
    transform: 'translateZ(0px)',
    flexGrow: 1,
    right: 0,
    bottom: 10,
    transition: "width .25s, height .15s"
}


export default function SpeedDialTooltipOpen() {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(deactivate);
    const [classes, setClasses] = useState(override);
    function handleOpen() {
        setActive(prev => ({
            ...prev,
            height: `${window.innerHeight}px`,
            width: "100%",
            bottom: 0
        }));
        setClasses(prev => ({
            ...prev,
            bottom: 20
        }));
        setOpen(true);
    };
    function handleClose() {
        setActive(deactivate);
        setClasses(prev => ({
            ...prev,
            bottom: 10
        }));
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
                setClasses(prev => ({
                    ...prev,
                    transform: "translateY(-5rem)"
                }))
            } else {
                setClasses(prev => ({
                    ...prev,
                    transform: "translateY(0rem)"
                }))
            }
        }

        window.addEventListener("scroll", updatePosition)

        return () => window.removeEventListener("scroll", updatePosition)
    }, [])

    return (
        <div className="box-wrapper"
            style={active}>
            <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
                <Backdrop open={open} />
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
        </div>
    );
}
