
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { close } from '../../redux/features/modal'
import { Close, Timer, Error } from '@mui/icons-material'

const formatTime = (clock) => {
    if (!clock) return
    return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
}

export default function SudokuModal({ isWin, errors, timeFinish, resetOrStartGame }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function home() {
        dispatch(close())
        navigate('/')
    }

    function restart() {
        dispatch(close())
        resetOrStartGame()
    }

    return (
        <div className="sudoku-modal">
            <div className="modal-content">
                <div className="inform">
                    <h1 className="inform-title">You {`${isWin ? "win" : "lose"}`}!</h1>
                    <Close
                        className="inform-close"
                        onClick={() => { dispatch(close()) }}
                    />
                </div>
                <div className="result-stats">
                    <div className="result-stat flex-div">
                        <div className="stat-name flex-div">
                            <p>Time</p>
                            <Timer className="icon" />
                        </div>
                        <p className="stat-data highlight">{formatTime(timeFinish)}</p>
                    </div>
                    <div className="result-stat flex-div">
                        <div className="stat-name flex-div">
                            <p>Error</p>
                            <Error className="icon" />
                        </div>
                        <p className="stat-data highlight">{errors} / 3</p>
                    </div>
                </div>
                <button
                    className="result-btn"
                    onClick={home}
                >Home</button>
                <button
                    className="result-btn"
                    onClick={restart}
                >New game</button>
            </div>
        </div>
    )
}