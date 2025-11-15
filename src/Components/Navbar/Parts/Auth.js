import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../redux/features/navbar'
import { Button, Typography } from '@mui/material'
import AccountMenu from './AccountMenu'

export default function Auth() {
    const dispatch = useDispatch()
    const { accessToken, user } = useSelector((state) => state.auth)

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    useEffect(() => {
        if (accessToken) {
            handleSetAuth('')
            return
        }
        if (!accessToken && user) {
            handleSetAuth('Login')
            return
        }
    }, [user, accessToken])

    if (user) {
        return (
            <div className="auth">
                <p className='greeting'><span>Welcome,</span> {user.username}</p>
                <AccountMenu />
            </div>
        )
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