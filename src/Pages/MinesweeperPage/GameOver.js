import { Link } from 'react-router-dom'
import Home from '../HomePage/Home'
import { setRestartGame } from './Action';

function GameOver({ dispatch, message }) {
    return (
        <div className="wrapper-game-over">
            <div className="game-over flex-div">
                <div className="game-over-state">{message}</div>
                <div className="game-over-option flex-div">
                    <button 
                        className="game-over-option-restart"
                        onClick={() => dispatch(setRestartGame())}
                    >Restart</button>
                    <Link
                        to="/"
                        element={<Home />}
                        className="game-over-option-home"
                    >Home</Link>
                </div>
            </div>
        </div>
    );
}

export default GameOver