import { useRef, useEffect, useState, createContext } from 'react'
import { useSelector } from 'react-redux'
import Board from './Board'
import Pieces from './Pieces'
import Suggest from './Suggest'
import Promotion from './Promotion'


export const BAPContext = createContext()

export default function BAP() {

    const { chess } = useSelector((state) => state.chess)

    const [board, setBoard] = useState(chess.getBoard())
    const [bounding, setBounding] = useState({
        'top': 0,
        'left': 0,
        'bottom': 0,
        'right': 0
    })

    const [squareEffect, setSquareEffect] = useState({
        'square': 0,
        'display': 'none'
    })

    const [pieceActive, setPieceActive] = useState(0)

    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        function getBounding() {
            setBounding({
                'top': el.getBoundingClientRect().top,
                'left': el.getBoundingClientRect().left,
                'right': el.getBoundingClientRect().right,
                'bottom': el.getBoundingClientRect().bottom
            })
        }

        window.addEventListener('resize', getBounding)
        window.addEventListener('scroll', getBounding)
        getBounding()

        return () => {
            window.removeEventListener('resize', getBounding)
            window.removeEventListener('scroll', getBounding)
        }

    }, [chess])

    useEffect(() => {
        setBoard(chess.getBoard())
    }, [chess])

    useEffect(() => {
        if (pieceActive === 0) {
            setBoard(chess.clearMoveAndTake(board))
        }
    }, [pieceActive])

    return (

        <BAPContext.Provider value={{ bounding, board, setBoard, squareEffect, setSquareEffect, pieceActive, setPieceActive }}>
            <div className="chess-board-area" ref={ref}>
                <Board />
                <Pieces />
                {/* Effect div */}
                <div
                    className={`chess-effect square-${squareEffect.square}`}
                    style={{ 'display': squareEffect.display }}
                ></div>

                <Suggest />
                <Promotion />
            </div>
        </BAPContext.Provider>
    )
}
