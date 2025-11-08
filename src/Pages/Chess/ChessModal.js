import { useSelector, useDispatch } from 'react-redux';
import { setChess } from '../../redux/features/chess';
import { close } from '../../redux/features/modal';
import { Icon } from '@mui/material'

export default function ChessModal() {
    const { chess, status: { cur, des }, mode: { opposite } } = useSelector((state) => state.chess)
    const dispatch = useDispatch()

    function newGame() {
        dispatch(setChess(chess.getInit()))
        dispatch(close())
    }

    function rematch() {
        const reChess = chess.getInit()
        reChess.setStatus('playing')
        dispatch(setChess(reChess))
        dispatch(close())
    }

    return (
        <div className="chess-result-modal">
            <div className="modal-header">
                <h2 className="result-title">{cur.charAt(0).toUpperCase() + cur.slice(1)}</h2>
            </div>

            <div className="result-description">
                <p>{des}</p>
            </div>

            <div className="players-info">
                <div className="player player1">
                    <div className="player-avatar">
                        <img src={'https://robohash.org/1'} alt={''} />
                    </div>
                    <div className="player-name">{'Player 1'}</div>
                </div>
                <div className="vs">VS</div>
                <div className="player player2">
                    <div className="player-avatar">
                        <img src={`${opposite?.avatar || 'https://robohash.org/2'}`} alt={''} />
                    </div>
                    <div className="player-name">{opposite.name}</div>
                </div>
            </div>

            <div className="modal-actions">
                <button className="btn btn-play-again" onClick={rematch}>
                    Rematch
                </button>
                <button className="btn btn-new-game" onClick={newGame}>
                    New game
                </button>
            </div>

            <button className="close-button" onClick={() => {dispatch(close())}}>
                <Icon>close</Icon>
            </button>
        </div>
    );
};
