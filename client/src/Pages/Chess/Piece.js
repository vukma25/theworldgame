import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useRef, useContext } from 'react'
import { setChess } from '../../redux/features/chess'
import { BAPContext } from './BoardAndPiece/BAP'
import {
    calculateEssentialSize,
    createLimit,
    calculateTopOrLeft,
    identifyRowAndCol,
    matchSquareSuggest,
    matchSquareTaken,
    matchSquareCastle,
} from './Function'

function Piece({ piece, square, coordinate }) {
    const { chess, aiThinking, settings: { animation }, playerSide, mode } = useSelector((state) => state.chess)
    const dispatch = useDispatch()

    const { 
        bounding, 
        board, 
        setBoard, 
        setSquareEffect, 
        pieceActive, 
        setPieceActive 
    } = useContext(BAPContext)
    const [prop, setProp] = useState({
        'isMove': false,
        'style': {
            'backgroundColor': 'transparent',
            'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`
        }
    })

    const ref = useRef(null)
    const refBoard = useRef(board)
    const squareSuggest = useRef(0)
    const squareTaken = useRef(0)
    const squareCastle = useRef([])

    useEffect(() => {
        setProp(prevState => {
            return {
                ...prevState,
                'style': {
                    ...prevState.style,
                    'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`
                }
            }
        })
    }, [square])

    useEffect(() => {
        refBoard.current = board
    }, [board])

    useEffect(() => {

        if (aiThinking) return
        if (chess.status === 'preparing') return 
        if (chess.hasCheckmate.checkmate) return
        if (chess.isDraw.draw) return
        if ((chess.turn !== playerSide && mode.type === 'bot')) return

        const el = ref.current
        if (!el) return

        let hoveringSquare = square

        function onMouseDown(e) {
            if (e.button === 0) {
                const [x, y, squareWidth] = calculateEssentialSize(e, bounding)
                setProp(prevState => {
                    return {
                        ...prevState,
                        'isMove': true,
                        'style': {
                            ...prevState.style,
                            'backgroundColor': 'transparent',
                            'transform': `translate(
                                ${calculateTopOrLeft(x, bounding.left, squareWidth)}px, 
                                ${calculateTopOrLeft(y, bounding.top, squareWidth)}px
                            )`
                        }
                    }
                })
                setPieceActive(prev => {
                    if (prev === square) return prev
                    return square
                })
                setBoard(chess.displayInvalidMoveAndTake(
                    piece, square, coordinate, chess.getBoard()
                ))
                

                document.addEventListener('mousemove', onMouseMove)
                document.addEventListener('mouseup', onMouseUp)
            }
        }

        function onMouseMove(e) {
            let [xPointer, yPointer, squareWidth] = calculateEssentialSize(e, bounding)

            //gioi han phamj vi dich chuyen
            xPointer = createLimit(xPointer, bounding.left, bounding.right)
            yPointer = createLimit(yPointer, bounding.top, bounding.bottom)

            //vi tri cua quan co
            const xPiece = calculateTopOrLeft(xPointer, bounding.left, squareWidth);
            const yPiece = calculateTopOrLeft(yPointer, bounding.top, squareWidth);

            //set vi tri cho effect div
            const posFromLeftToPointer = Math.max(1, xPointer - bounding.left)
            const posFromTopToPointer = Math.max(1, yPointer - bounding.top)
            const [col, row] = identifyRowAndCol(posFromLeftToPointer, posFromTopToPointer, squareWidth)
            hoveringSquare = 8 * row + col
            squareSuggest.current = matchSquareSuggest(refBoard.current, row, col, hoveringSquare)
            squareTaken.current = matchSquareTaken(refBoard.current, row, col, hoveringSquare)
            squareCastle.current = matchSquareCastle(refBoard.current, row, col)

            //====================================================
            setProp(prevState => {
                return {
                    ...prevState,
                    'isMove': true,
                    'style': {
                        ...prevState.style,
                        'backgroundColor': 'transparent',
                        'transform': `translate(
                                ${xPiece}px, 
                                ${yPiece}px
                        )`
                    }
                }
            })

            setSquareEffect({
                'square': hoveringSquare,
                'display': 'block'
            })
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)

            setProp(prevState => {
                return {
                    ...prevState,
                    'isMove': false,
                    'style': {
                        ...prevState.style,
                        'transform': `translate(${chess.squares[square][0]}%, ${chess.squares[square][1]}%)`,
                    }
                }
            })
            setSquareEffect({
                'square': 0,
                'display': 'none'
            })

            //an hien nuoc goi y cua quan duoc click vao
            if (pieceActive === square && 
                !(hoveringSquare !== square)
            ) {
                 setPieceActive(0)
            }
            //=======================================================

            const [row, sq, type] = chess.pawnPromotionByReplaceOrCapture(
                squareSuggest.current,
                squareTaken.current,
            )
            if (chess.isPawnPromotion(
                piece,
                row
            )) {
                squareSuggest.current = 0
                squareTaken.current = 0
                chess.listPawnAbleToTransform(piece, square, sq, type.action, row)
                dispatch(setChess(chess.getState()))
                return
            }
            //=======================================================

            if (squareSuggest.current !== 0) {

                const newChess = chess.replacePiece(
                    square,
                    squareSuggest.current,
                    piece
                )
                squareSuggest.current = 0
                dispatch(setChess(newChess))
                return
            }
            else if (squareTaken.current !== 0) {
                const newChess = chess.capturePiece(
                    square,
                    squareTaken.current,
                    piece
                )

                squareTaken.current = 0
                dispatch(setChess(newChess))
                return
            } else if (['wk', 'bk'].includes(piece) && squareCastle.current.length !== 0) {
                const [curRook, reRook, sq, squareKing] = squareCastle.current
                let newChess = chess.replacePiece(
                    curRook,
                    reRook,
                    piece[0] + 'r',
                    true
                )

                newChess = newChess.replacePiece(
                    squareKing,
                    sq,
                    piece,
                    true
                )

                squareCastle.current = []
                dispatch(setChess(newChess))
                return
            }
        }

        el.addEventListener('mousedown', onMouseDown)

        return () => {
            el.removeEventListener('mousedown', onMouseDown)
        }
    }, [bounding, chess, chess.status, aiThinking, pieceActive])

    return (
        <div
            className={`
                piece 
                ${piece} 
                square-${square}
                ${prop.isMove ? "dragging" : ""}
                ${animation ? "have" : ""}
            `}
            ref={ref}
            style={prop.style}
        ></div>
    )
}

export default Piece
