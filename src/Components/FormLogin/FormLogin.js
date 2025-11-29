import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mui/material/Icon'
import './FormLogin.css';

function FormLogin({ setOpen, open }) {

    const [userInfo, setUserInfo] = useState({
        'username': '',
        'password': '',
        'rememberUser': false
    })
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        clear()
    }, [open])

    function clear() {
        setUserInfo({
            'username': '',
            'password': '',
            'rememberUser': false
        })
    }
    function handleGetUsername(event) {
        setUserInfo(prevState => {
            return {
                ...prevState,
                'username': event.target.value
            }
        })
    }
    function handleGetPassword(event) {
        setUserInfo(prevState => {
            return {
                ...prevState,
                'password': event.target.value
            }
        })
    }
    function handleRememberEvent(event) {
        setUserInfo(prevState => {
            return {
                ...prevState,
                'rememberUser': event.target.checked
            }
        })
    }

    return (
        <div 
            className={`wrapper ${open ? "" : "close"}`}    
        >
            <div
                className="over-layer"
                onClick={() => setOpen(prevState => !prevState)}
            ></div>
            <div className="dropdown position-right">
                <form
                    action="http://localhost:3000/login"
                    method="post"
                    className="loginForm flex-div"
                >
                    <div className="field-container flex-div">
                        <input
                            type="text"
                            name="username"
                            className="input-field text-type"
                            id="username-field"
                            onChange={handleGetUsername}
                            value={userInfo.username}
                        />
                        <label htmlFor="username-field"
                            className={`name-field ${userInfo.username.length !== 0 ? "valid" : ""
                                }`}
                        >
                            Username/Email
                        </label>
                    </div>
                    <div className="field-container flex-div">
                        <input
                            type={`${showPassword ? "text" : "password"}`}
                            name="password"
                            className="input-field password-type"
                            id="password-field"
                            onChange={handleGetPassword}
                            value={userInfo.password}
                        />
                        <Icon
                            className="display-password"
                            onClick={() => setShowPassword(prevState => !prevState)}
                        >
                            visibility{`${showPassword ? "_off" : ""}`}
                        </Icon>
                        <label htmlFor="password-field"
                            className={`name-field ${userInfo.password.length !== 0 ? "valid" : ""
                                }`}
                        >
                            Password
                        </label>
                    </div>
                    <div className="additionalLinks-before">
                        Hello my website
                    </div>
                    <div className="additionalLinks flex-div">
                        <div className="additionalLinks-left flex-div">
                            <input
                                type="checkbox"
                                name="record"
                                id="record"
                                onChange={handleRememberEvent}
                                checked={userInfo.rememberUser}
                            />
                            <label htmlFor="record">Remember me</label>
                        </div>
                        <div className="additionalLinks-right">
                            <Link
                                to="/recovery-password"
                                className="additionalLinks-right-anchor"
                            >
                                Forget password?
                            </Link>
                        </div>
                    </div>
                    <button type="submit" className="submitBtn">Log in</button>
                </form>
                <div className="different-method flex-div">
                    Google
                </div>
                <div className="different-method flex-div">
                    Facebook
                </div>

                <div className="more flex-div">
                    <div className="label">No account</div>
                    <div className="hr-element"></div>
                </div>

                <div className="signup flex-div">Sign up</div>
            </div>
        </div>
    );
}

export default FormLogin