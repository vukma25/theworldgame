import { useDispatch } from 'react-redux'
import { setAuth } from '../../../redux/features/navbar'
import { Button } from '@mui/material'

export default function Auth() {
    const dispatch = useDispatch()

    function handleSetAuth(type) {
        dispatch(setAuth(type))
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