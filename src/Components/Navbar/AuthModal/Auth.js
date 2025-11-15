import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../redux/features/navbar'
import Register from './Register'
import Login from './Login'

export default function Auth() {

    const { auth } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    return (

        <div
            className="auth-wrapper"
            id="auth-wrapper"
            onClick={(e) => {
                if (e.target.id === "auth-wrapper") {
                    handleSetAuth('')
                }
            }}
        >
            {auth === 'Register' && <Register />}
            {auth === 'Login' && <Login />}
        </div>

    )
}