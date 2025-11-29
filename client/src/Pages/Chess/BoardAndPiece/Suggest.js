import { Fragment, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { BAPContext } from "./BAP"
import { setChess } from "../../../redux/features/chess"
import { convertToArray } from '../Function'
import { FiberManualRecord, LocationSearching, ModeStandby } from '@mui/icons-material'

export default function Suggest() {
    const { chess, settings } = useSelector((state) => state.chess)
    const dispatch = useDispatch()

    const { board } = useContext(BAPContext)
    return (
        <Fragment>
            {
                convertToArray(board).map((sq, index) => {
                    if (!sq?.action) return null

                    if (sq.action === 'suggest') {
                        const { square, moveToSquare, forPiece } = sq
                        return (
                            <div
                                key={`suggest-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = chess.pawnPromotionByReplaceOrCapture(
                                        square,
                                        0,
                                    )
                                    if (chess.isPawnPromotion(
                                        forPiece,
                                        row
                                    )) {
                                        chess.listPawnAbleToTransform(forPiece, moveToSquare, sq, type.action, row)
                                        dispatch(setChess(chess.getState()))
                                        return
                                    }

                                    const newChess = chess.replacePiece(
                                        moveToSquare,
                                        square,
                                        forPiece,
                                    )
                                    dispatch(setChess(newChess))
                                }}
                            >
                                {settings.showHints && <FiberManualRecord sx={{
                                    'color': 'var(--cl-gray)',
                                    'fontSize': '2rem'
                                }}/>}
                            </div>
                        )
                    } else if (sq.action === 'canBeTaken' || sq.action === 'ep') {
                        const { square, takeSquare, byPiece } = sq
                        return (
                            <div
                                key={`taken-${index}`}
                                className={`taken-div square-${square}`}
                                onClick={() => {

                                    const [row, sq, type] = chess.pawnPromotionByReplaceOrCapture(
                                        0,
                                        square,
                                    )
                                    if (chess.isPawnPromotion(
                                        byPiece,
                                        row
                                    )) {
                                        chess.listPawnAbleToTransform(byPiece, takeSquare, sq, type.action, row)
                                        dispatch(setChess(chess.getState()))
                                        return
                                    }

                                    const newChess = chess.capturePiece(
                                        takeSquare,
                                        square,
                                        byPiece
                                    )

                                    dispatch(setChess(newChess))
                                }}
                            >
                                {settings.showHints && <LocationSearching sx={{
                                    'color': 'var(--cl-red-flag)',
                                    'fontSize': '3rem'
                                }}/>}
                            </div>
                        )
                    } else if (sq.action === 'castle') {
                        const { curRook, reRook, square, squareKing, forPiece } = sq
                        return (
                            <div
                                key={`castle-${index}`}
                                className={`suggest-div square-${square}`}
                                onClick={() => {

                                    let newChess = chess.replacePiece(
                                        curRook,
                                        reRook,
                                        forPiece[0] + 'r',
                                        true
                                    )
                                    newChess = newChess.replacePiece(
                                        squareKing,
                                        square,
                                        forPiece,
                                        true
                                    )

                                    dispatch(setChess(newChess))
                                }}
                            >
                                {settings.showHints && <ModeStandby sx={{
                                    'color': 'var(--cl-primary-yellow)',
                                    'fontSize': '3rem'
                                }}/>}
                            </div>
                        )
                    }
                })
            }
        </Fragment>
    )
}