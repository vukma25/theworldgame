import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../redux/features/navbar'
import { logoutUser } from '../../../redux/features/auth'
import { styled } from '@mui/material/styles'
import { Button, Avatar, Badge, Tooltip } from '@mui/material'
import { tooltipClasses } from '@mui/material/Tooltip'
import { Logout } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

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

const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
    },
}));

export default function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { accessToken, user } = useSelector((state) => state.auth)

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    function handleLogout() {
        try {
            dispatch(logoutUser())
        } catch (error) {
            console.log("Miss an error:", error)
        } finally {
            //navigate('/')
        }
    }

    if (accessToken) {
        handleSetAuth("")
        return (
            <div className="auth">
                <LightTooltip title={user.username} placement='bottom' arrow>
                    <StyledBadge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                    >
                        <Avatar />
                    </StyledBadge>
                </LightTooltip>
                <Button 
                    startIcon={<Logout />}
                    onClick={handleLogout}
                >Logout</Button>
            </div>
        )
    }

    if (user && !accessToken) {
        handleSetAuth("Login")
    }

    return (
        <div className="auth">
            <Button
                variant='outlined'
                id="loginBtn"
                className="btn btn-ghost"
                onClick={() => {
                    handleSetAuth('Login')
                }}
            >Login</Button>
            <Button
                variant='contained'
                id="signupBtn"
                className="btn btn-primary"
                onClick={() => {
                    handleSetAuth('Register')
                }}
            >Register</Button>
        </div>
    )
}