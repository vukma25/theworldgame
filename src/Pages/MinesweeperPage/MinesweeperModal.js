import { useNavigate } from 'react-router-dom'
import lose_gif from '../../assets/image/lose.gif'
import win_gif from '../../assets/image/win.gif'
import { useDispatch, useSelector } from 'react-redux'
import { unmounted } from '../../redux/features/minesweeper'
import { close } from '../../redux/features/modal'

function MinesweeperModal({ timeFinish, message, isWin, restart }) {
    const { duration } = useSelector((state) => state.minesweeper.setTime)
    const dispatch = useDispatch()
    const navigator = useNavigate()

    function handleQuitGame() {
        dispatch(close())
        dispatch(unmounted())
        navigator('/')
    }

    function formatTime(time) {
        const minute = Math.floor(time / 60)
        const second = time % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    return (
        <div className="game-over flex-div">
            <div className="game-over-state">{message}</div>
            <div className="flex-div time">
                <div>Time:</div>
                <div>{formatTime(duration - Math.floor(timeFinish.remain / 1000))}</div>
            </div>
            <img
                className="game-over-gif"
                src={`${isWin ? win_gif : lose_gif}`}
                alt={`This is a ${isWin ? win_gif : lose_gif}`}
            />
            <div className="game-over-option flex-div">
                <button
                    className="game-over-option-restart"
                    onClick={restart}
                >Restart</button>
                <button
                    className="game-over-option-home"
                    onClick={handleQuitGame}
                >Home</button>
            </div>
        </div>
    );
}

export default MinesweeperModal