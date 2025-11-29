import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { close } from '../../redux/features/modal'

export default function MemoryModal({ remain, initGame }) {
    const memory = useSelector((state) => state.memory)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function formatTime(time) {
        const minute = Math.floor(time / 60)
        const second = time % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    function goHome() {
        navigate("/")
    }
    function playMore() {
        dispatch(close())
        initGame()
    }

    return (
        <div className="mm-modal-content">
            <h2 className="mm-modal-title">
                {memory.status === "time_out" ? "Time out" : "You opened all card and became winner"}
            </h2>
            <div className="mm-modal-game-info">
                <div className="field">Rows</div>
                <div className="data">{memory.rows}</div>
            </div>
            <div className="mm-modal-game-info">
                <div className="field">Columns</div>
                <div className="data">{memory.cols}</div>
            </div>
            {memory.useTime &&
                <>
                    <div className="mm-modal-game-info">
                        <div className="field">Duration</div>
                        <div className="data">
                            {formatTime(memory.duration)}
                        </div>
                    </div>
                    <div className="mm-modal-game-info">
                        <div className="field">Remain</div>
                        <div className="data">{formatTime(Math.floor(remain / 1000))}</div>
                    </div>
                    <div className="mm-modal-game-info">
                        <div className="field">Time used</div>
                        <div className="data">
                            {formatTime(memory.duration - Math.floor(remain / 1000))}
                        </div>
                    </div>
                </>
            }
            <div className="mm-modal-btn-redirect">
                <button
                    className="btn-action play-again"
                    onClick={playMore}
                >Play more</button>
                <button
                    className="btn-action cancel"
                    onClick={goHome}
                >Go home</button>
            </div>
        </div>
    )
}