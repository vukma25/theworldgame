import { useSelector, useDispatch } from 'react-redux';
import { setChess, setPlayerSide } from '../../redux/features/chess';
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { Add, Flag, ArrowBack } from '@mui/icons-material'
import wp from '../../assets/image/wp.png'
import wq from '../../assets/image/wq.png'
import wk from '../../assets/image/wk.png'
import wn from '../../assets/image/wn.png'
import wr from '../../assets/image/wr.png'
import wb from '../../assets/image/wb.png'
import bp from '../../assets/image/bp.png'
import bq from '../../assets/image/bq.png'
import bk from '../../assets/image/bk.png'
import bn from '../../assets/image/bn.png'
import br from '../../assets/image/br.png'
import bb from '../../assets/image/bb.png'

const image = { wp, wr, wk, wq, wn, wb, bp, br, bk, bq, bn, bb, }

function MoveList(
    // { chess, setChess }
) {

    const { chess } = useSelector((state) => state.chess)
    const dispatch = useDispatch()
    const scrollRef = useRef(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chess])

    return (
        <div className="move-list-wrapper flex-div">
            <div className="move-list-header">Starting Position</div>
            <div className="move-list" ref={scrollRef}>
                {chess.moves.map(({ turn, white, black }) => {
                    const whiteIsCurrent = (
                        turn === chess.moves.length &&
                        !black
                    ) ? "move-current" : ""
                    const blackIsCurrent = (
                        turn === chess.moves.length &&
                        black
                    ) ? "move-current" : ""


                    return (
                        <div key={turn} className="move-row">
                            <div className="move-num">{turn}.</div>
                            <div className="move-container flex-div">
                                <div className={`move move-white flex-div ${whiteIsCurrent}`}>
                                    <img src={image[white?.piece]} alt={white?.piece} />
                                    <p className="flex-div">{white?.move}</p>
                                </div>
                            </div>
                            <div className="move-container flex-div">
                                {black && <div className={`move move-white flex-div ${blackIsCurrent}`}>
                                    <img src={image[black?.piece]} alt={black?.piece} />
                                    <p className="flex-div">{black?.move}</p>
                                </div>}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className='move-list-option flex-div'>
                {(chess.hasCheckmate.checkmate ||
                chess.isDraw.draw) &&
                <div 
                    className='move-list-btn flex-div'
                    onClick={() => {
                        const newChess = chess.getInit()
                        dispatch(setChess(newChess))
                        dispatch(setPlayerSide('w'))
                    }}
                >
                    <Add sx={{ fontSize: '3.5rem' }}/>
                    <p>New Game</p>
                </div>}
                <div 
                    className='move-list-btn flex-div'
                >
                    <Flag sx={{ fontSize: '3rem' }}/>
                    <p>Resign</p>
                </div>
                <Link
                    to="/"
                    className='move-list-btn flex-div'
                >
                    <ArrowBack sx={{ fontSize: '3rem' }}/>
                    <p>Home</p>
                </Link>
            </div>
        </div>
    );
};

export default MoveList;
