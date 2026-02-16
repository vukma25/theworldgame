import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { loginUser, clearError } from "../../../redux/features/auth"
import { CircularProgress } from "@mui/material"
import { Close, Google, Facebook, Visibility, VisibilityOff } from '@mui/icons-material'
import { setAuth } from "../../../redux/features/navbar"

export default function Login() {

    const { auth } = useSelector((state) => state.navbar)
    const { isLoading, error, user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [show, setShow] = useState(false)

    function handleShowPwd() {
        setShow(prev => !prev)
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
        dispatch(loginUser(formData))
    }

    useEffect(() => {

        let timer
        if (error) {
            timer = setTimeout(function () {
                dispatch(clearError())
            }, 1500)
            return
        }

        if (user) {
            dispatch(setAuth(''))
        }

        return () => {
            clearTimeout(timer)
        }
    }, [error, dispatch, isLoading, user])

    useEffect(() => {
        if (auth === "Login") {
            setFormData({
                email: '',
                password: ''
            })
        }
        else {
            setFormData(null)
        }
    }, [auth])

    return (
        <form className="auth-modal" onSubmit={handleSubmit} >
            <div className="auth-modal-head">
                <h3 id="modalTitle" className="auth-modal-title">{auth}</h3>
                <button
                    type="button"
                    id="modalClose" className="xbtn flex-div" aria-label="Đóng"
                    onClick={() => { dispatch(setAuth('')) }}
                >
                    <Close sx={{ fontSize: "2rem" }} />
                </button>
            </div>
            <div className="auth-modal-body">
                <div className="grid-2">
                    <div className="bbtn flex-div">
                        <Google sx={{ fontSize: '2.5rem' }} /> Google
                    </div>
                    <div className="bbtn flex-div">
                        <Facebook sx={{ fontSize: '2.5rem' }} /> Facebook
                    </div>
                </div>
                <div className="divline">
                    <div className="hr"></div><span className="muted" style={{ fontSize: "1.2rem" }}>or</span><div className="hr"></div>
                </div>
                <div className="field-col">
                    <input
                        type="text"
                        value={formData?.email}
                        placeholder="Email"
                        className="input"
                        required
                        onChange={handleEmail} />
                    <div className="pwd-field">
                        <input
                            type={`${show ? 'text' : 'password'}`}
                            value={formData?.password}
                            placeholder="Password"
                            className="input"
                            required
                            onChange={handlePassword} />
                        <div className="show-icon"
                            onClick={handleShowPwd}
                        >
                            {show ? <Visibility /> : <VisibilityOff />}
                        </div>
                    </div>
                </div>
                <div className="error">{error}</div>
                <button
                    type="submit"
                    className="cta"
                    style={{ marginTop: ".5rem" }}
                //disabled={isLoading}
                >{isLoading ? < CircularProgress /> : auth}
                </button>
            </div>
        </form >
    )
}