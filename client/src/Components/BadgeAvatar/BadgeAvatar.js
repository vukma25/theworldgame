import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles';
import { Badge, Avatar, Box } from '@mui/material';
import stringAvatar from '../../lib/avatar';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

export default function BadgeAvatar({ username, src, online, id = null, sx = { width: 40, height: 40, border: ".1rem solid black" } }) {
    const { user: { _id } } = useSelector((state) => state.auth)
    const navigate = useNavigate()

    const avatar = src ?
        <Avatar alt="" src={src} sx={sx} /> :
        <Avatar alt="" src={src} {...stringAvatar(username, sx)} />

    function seeProfile() {
        if (!id) return
        if (_id.toString() === id.toString()) {
            navigate("/profile"); return
        }

        navigate(`/profile/${id}`)
    }

    return (
        <Box
            sx={{ display: "flex", justifyContent: "center" }}
            onClick={seeProfile}
        >
            {online ? <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                {avatar}
            </StyledBadge> :
                <Fragment>{avatar}</Fragment>
            }
        </Box>
    );
}
