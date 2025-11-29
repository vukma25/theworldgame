import { Fragment, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../redux/features/auth';
import {
    Box,  Menu, MenuItem, ListItemIcon,
    Divider, IconButton, Badge
} from '@mui/material';
import { Settings, Logout, Notifications } from '@mui/icons-material';
import BadgeAvatar from '../../../Components/BadgeAvatar/BadgeAvatar'

export default function AccountMenu() {

    const { user: { username, _id },  } = useSelector((state) => state.auth)
    const { usersOnline, notifications } = useSelector((state) => state.event)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const on = useMemo(() => {
        return !!usersOnline.find(([id, _]) => id === _id.toString())
    }, [usersOnline])

    const invisible = useMemo(() => {
        return !notifications.some(({ reveal }) => reveal.unread)
    }, [notifications])

    function handleLogout() {
        dispatch(logoutUser())
    }

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleClose() {
        setAnchorEl(null);
    };

    function redirect() {
        navigate('/notification')
    }

    useEffect(() => {
        function catchEvent(e) {
            setAnchorEl(null)
        }

        window.addEventListener('resize', catchEvent)

        return () => window.removeEventListener('resize', catchEvent)
    }, [])

    return (
        <Fragment>
            <Box>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <BadgeAvatar 
                        username={username} 
                        src={null} 
                        online={on}
                    />
                </IconButton>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem sx={{fontSize: "1.4rem"}} onClick={handleClose}>
                    <BadgeAvatar
                        username={username}
                        src={null}
                        online={on}
                    /> {username}
                </MenuItem>
                <Divider />
                <MenuItem sx={{fontSize: "1.4rem"}} onClick={handleClose}>
                    <ListItemIcon>
                        <Settings fontSize="large" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem sx={{fontSize: "1.4rem"}} onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="large" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <IconButton onClick={redirect}>
                <Badge color="secondary" variant="dot" invisible={invisible}>
                    <Notifications />
                </Badge>
            </IconButton>
        </Fragment>
    );
}
