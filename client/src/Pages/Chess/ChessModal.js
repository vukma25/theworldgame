import { useMemo, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setChess } from '../../redux/features/chess';
import { close } from '../../redux/features/modal';
import { ChessContext } from './Chess';
import { Avatar } from '@mui/material'
import { Close } from '@mui/icons-material'
import stringAvatar from '../../lib/avatar';
import BadgeAvatar from '../../Components/BadgeAvatar/BadgeAvatar';

export default function ChessModal() {
    const { chess, status: { cur, des }, mode: { opposite }, playerSide } = useSelector((state) => state.chess)
    const dispatch = useDispatch()
    const { user } = useContext(ChessContext)

    const winner = useMemo(() => {
        return chess.hasCheckmate.by === playerSide
    }, [chess.hasCheckmate.by])

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

    function formatAvatar() {
        const res = stringAvatar(user.username)
        res.sx = {
            ...res.sx,
            width: "100%",
            height: "100%"
        }
        return res
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
                    <div className={`player-avatar ${winner ? 'active' : ''}`} >
                        {!user ? <img src="https://robohash.org/1" /> :
                            <BadgeAvatar username={user.username} src={user.avatar} online={false} sx={{ width: "100%", height: "auto" }} />}
                    </div>
                    <div className="player-name">{user?.username || 'Player 1'}</div>
                </div>
                <div className="vs">VS</div>
                <div className="player player2">
                    <div className={`player-avatar ${!winner ? 'active' : ''}`} >
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

            <button className="close-button" onClick={() => { dispatch(close()) }}>
                <Close />
            </button>
        </div>
    );
};
