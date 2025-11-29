import { Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setChess } from '../../../redux/features/chess'
import { Close } from '@mui/icons-material'

export default function Promotion() {
    const { chess, settings: { lightSquareColor, darkSquareColor } } = useSelector((state) => state.chess)
    const dispatch = useDispatch()

    return (
        <Fragment>
            {
                chess.listPawnCanBecome.map((p, index) => {
                    const { type, action, curSquare, reSquare, location } = p
                    if (type !== 'cancelPromotion') {
                        return (
                            <div
                                key={index}
                                className={`
                                    piece promotion-div ${type} square-${location}
                                `}
                                style={{ backgroundColor: chess.fillColor(location, lightSquareColor, darkSquareColor) }}
                                onClick={
                                    () => {
                                        const turn = chess.turn
                                        if (turn !== type[0]) {
                                            chess.setListPawnCanBecome([])
                                            dispatch(setChess(chess.getState()))
                                            return
                                        }
                                        chess.modifyMaterial(curSquare, type)
                                        chess.modifyBoard(curSquare, type)

                                        let newChess
                                        if (action === 'capture') {
                                            chess.setListPawnCanBecome([])
                                            newChess = chess.capturePiece(
                                                curSquare,
                                                reSquare,
                                                type
                                            )

                                        } else {
                                            chess.setListPawnCanBecome([])
                                            newChess = chess.replacePiece(
                                                curSquare,
                                                reSquare,
                                                type
                                            )
                                        }

                                        dispatch(setChess(newChess))
                                    }
                                }
                            ></div>
                        )
                    } else {
                        return (
                            <div
                                key={index}
                                className={`promotion-div square-${location}`}
                                style={{ backgroundColor: chess.fillColor(location, lightSquareColor, darkSquareColor) }}
                                onClick={() => {
                                    chess.setListPawnCanBecome([])
                                    dispatch(setChess(chess.getState()))
                                }}
                            >
                                <Close sx={{color:'var(--cl-red-flag)',fontSize: '5rem'}}/>
                            </div>
                        )
                    }
                })
            }
        </Fragment>
    )
}