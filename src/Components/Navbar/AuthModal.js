import { useSelector, useDispatch } from 'react-redux'
import { setAuth } from '../../redux/features/navbar'
import { Icon } from "@mui/material"

export default function AuthModal() {
    const dispatch = useDispatch()
    const { auth } = useSelector((state) => state.navbar)

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
            <div className="auth-modal">
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
                        <button className="bbtn">Google</button>
                        <button className="bbtn">Facebook</button>
                    </div>
                    <div className="divline">
                        <div className="hr"></div><span className="muted" style={{ fontSize: "1.2rem" }}>or</span><div className="hr"></div>
                    </div>
                    <div className="field-col">
                        <input type="text" placeholder="Email" className="input" />
                        <input type="text" placeholder="Password" className="input" />
                    </div>
                    <button className="cta" style={{ marginTop: ".5rem" }}>{auth}</button>
                </div>
            </div>
        </div>
    )
}