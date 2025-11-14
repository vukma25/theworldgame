import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAuth } from '../../redux/features/navbar'
import { loginUser, registerUser, clearError } from '../../redux/features/auth'
import { Icon, CircularProgress } from "@mui/material"
import { Google, Facebook } from '@mui/icons-material'

export default function AuthModal() {

    const dispatch = useDispatch()
    const { auth } = useSelector((state) => state.navbar)
    const { isLoading, error } = useSelector((state) => state.auth)
    const [formData, setFormData] = useState(null);

    function handleSetAuth(type) {
        dispatch(setAuth(type))
    }

    function handleUsername(e) {
        setFormData(prev => ({
            ...prev,
            username: e.target.value
        }))
    }
    function handlePassword(e) {
        setFormData(prev => ({
            ...prev,
            password: e.target.value
        }))
    } 
    function handleEmail(e) {
        setFormData(prev => ({
            ...prev,
            email: e.target.value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (auth === 'Login') {
            dispatch(loginUser(formData))
        } else if (auth === 'Register') {
            dispatch(registerUser(formData))
        }
    }

    useEffect(() => {
        const timer = setTimeout(function() {
            dispatch(clearError())
        }, 1500)

        return () => clearTimeout(timer)
    }, [error, dispatch])

    useEffect(() => {
        if (auth === "Login") {
            setFormData({
                email: '',
                password: ''
            })
        }
        else if (auth === "Register") {
            setFormData({
                username: '',
                email: '',
                password: ''
            })
        }
        else { 
            setFormData(null) 
        }
    }, [auth])

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
            <form className="auth-modal" onSubmit={handleSubmit}>
                <div className="auth-modal-head">
                    <h3 id="modalTitle" className="auth-modal-title">{auth}</h3>
                    <button
                        id="modalClose" className="xbtn flex-div" aria-label="Đóng"
                        onClick={() => { handleSetAuth('') }}
                    >
                        <Icon sx={{ fontSize: "2rem" }}>close</Icon>
                    </button>
                </div>
                <div className="auth-modal-body">
                    <div className="grid-2">
                        <div className="bbtn flex-div">
                            <Google sx={{ fontSize: '2.5rem'}}/> Google
                        </div>
                        <div className="bbtn flex-div">
                            <Facebook sx={{ fontSize: '2.5rem' }} /> Facebook
                        </div>
                    </div>
                    <div className="divline">
                        <div className="hr"></div><span className="muted" style={{ fontSize: "1.2rem" }}>or</span><div className="hr"></div>
                    </div>
                    <div className="field-col">
                        {auth === "Register" &&
                        <input 
                            type="text"
                            value={formData?.username} 
                            placeholder="Username" 
                            className="input"
                            required
                            onChange={handleUsername} />}
                        <input 
                            type="text"
                            value={formData?.email} 
                            placeholder="Email" 
                            className="input"
                            required
                            onChange={handleEmail} />
                        <input 
                            type="text"
                            value={formData?.password} 
                            placeholder="Password" 
                            className="input"
                            required
                            onChange={handlePassword} />
                    </div>
                    {error && <div className="error">{error}</div>}
                    <button 
                        type="submit" 
                        className="cta" 
                        style={{ marginTop: ".5rem" }}
                        disabled={isLoading}
                    >{isLoading ? < CircularProgress/> : auth}
                    </button>
                </div>
            </form>
        </div>
    )
}