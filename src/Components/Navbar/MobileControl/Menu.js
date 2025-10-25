import { useDispatch } from 'react-redux'
import { setAuth } from '../../../redux/features/navbar'
import { Link } from "react-router"
import { Button } from '@mui/material'

export default function Menu() {
    const dispatch = useDispatch()

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    return (
        <div id="mobileMenu" className="mobile-panel mobile-menu">
            <div className="grid">
                <Link to="/" className="chip">Home</Link>
                <Link to="/lead-board" className="chip">LeadBoard</Link>
            </div>
            <div className="mobile-auth" style={{ marginTop: '.5rem' }}>
                <Button
                    variant='outlined'
                    className="btn btn-ghost btn-block"
                    onClick={() => {
                        handleSetAuth('Login')
                    }}
                >Login</Button>
                <Button
                    variant='contained'
                    className="btn btn-primary btn-block"
                    onClick={() => {
                        handleSetAuth('Register')
                    }}
                >Register</Button>
            </div>
        </div>
    )
}