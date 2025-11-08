import { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setChess, setAiThinking } from '../../redux/features/chess';

function ChessBot() {

    const { chess, mode: { opposite }, playerSide } = useSelector((state) => state.chess)
    const dispatch = useDispatch()
    const sfRef = useRef(null);

    function postMessageToSf(sf, fen){
        if (!sf) return

        const elo = opposite.elo ?? 1500;
        const skillLevel = Math.min(20, Math.max(Math.ceil(elo - 1350) / 70, 0))

        sf.postMessage("uci");
        sf.postMessage("isready");
        sf.postMessage("setoption name UCI_LimitStrength value true")
        sf.postMessage(`setoption name UCI_Elo value ${elo}`)
        sf.postMessage(`setoption name Skill Level value ${skillLevel}`);
        sf.postMessage(`position fen ${fen}`);
        sf.postMessage("go movetime 500 depth 12");
    }

    useEffect(() => {

        if (!opposite) return
        if (chess.hasCheckmate.checkmate) return
        if (chess.isDraw.draw) return
        if (chess.turn === playerSide) return

        dispatch(setAiThinking(true))
        const sf = new Worker('/theworldgame/stockfish.js')
        const chessClone = chess.getState()
        sfRef.current = sf
        sf.onmessage = (event) => {
            const message = typeof event.data === "string" ? event.data : event;

            if (message.startsWith("bestmove")) {
                const move = message.split(" ")[1];
                if (move === "(none)") return;
                const state = chessClone.chessBotMove(move)

                dispatch(setChess(state))
                dispatch(setAiThinking(false))
            }
        };

        postMessageToSf(sfRef.current, chessClone.fen)

        return () => {
            sf.terminate()
            sfRef.current = null
        };  
        
    }, [chess.turn, chess])


    return (
        <></>
    )
}

export default ChessBot