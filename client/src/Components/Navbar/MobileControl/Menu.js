import { useDispatch, useSelector } from 'react-redux'
import { setAuth, controlMenu } from '../../../redux/features/navbar'
import { Button } from '@mui/material'
import { useEffect } from 'react'

export default function Menu() {
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    useEffect(() => {
        if (user) {
            dispatch(controlMenu(false))
        }
    }, [user])

    return (
        <div id="mobileMenu" className="mobile-panel mobile-menu">
            <div className="mobile-auth" style={{ marginTop: '.5rem' }}>
                <Button
                    variant='outlined'
                    className="btn btn-ghost btn-block"
                    onClick={() => {
                        handleSetAuth('Login')
                        dispatch(controlMenu(false))
                    }}
                >Login</Button>
                <Button
                    variant='contained'
                    className="btn btn-primary btn-block"
                    onClick={() => {
                        handleSetAuth('Register')
                        dispatch(controlMenu(false))
                    }}
                >Register</Button>
            </div>
        </div>
    )
}