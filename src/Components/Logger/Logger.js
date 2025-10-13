import { useEffect, useState } from "react";
import '../../assets/styles/Logger.css'

function Logger({ log, setLog }) {
    const [message, setMessage] = useState('');

    function clearLog() {
        setMessage('');
        setLog({
            "message": "",
            "type": log.type
        })
    }

    useEffect(() => {
        setMessage(log.message);

        const timeout = setTimeout(() => {
            clearLog()
        }, 3500);

        return () => clearTimeout(timeout);
    }, [log.message]);

    return (
        <div className={`logger logger--${log.type} ${message === "" ? "" : "logger-display"}`}>
                <div className="logger__inner">
                    <span className="logger__icon" style={{ background: "#e03131" }}></span>
                    <div className="logger__message">{message}</div>
                    <button 
                        className="logger__close" aria-label="Đóng"
                        onClick={() => {clearLog()}}
                    >✕</button>
                </div>
        </div>
    )
}

export default Logger