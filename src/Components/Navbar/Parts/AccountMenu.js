import { Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../../redux/features/auth';
import {
    Box, Avatar, Menu, MenuItem, ListItemIcon,
    Divider, IconButton
} from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import stringAvatar from "../../../lib/avatar"

export default function AccountMenu() {

    const { user: { username } } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    function handleLogout() {
        dispatch(logoutUser())
    }

    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    };
    function handleClose() {
        setAnchorEl(null);
    };

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
                    <Avatar {...stringAvatar(username)} />
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
                    <Avatar {...stringAvatar(username)} /> {username}
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
        </Fragment>
    );
}
