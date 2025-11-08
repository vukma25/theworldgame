import { Fragment } from "react"
import { useSelector } from "react-redux"
import Piece from '../Piece'

export default function Pieces() {
    const { chess } = useSelector((state) => state.chess)

    return (
        <Fragment>
            {
                chess.getPieces().map(({ id, piece, square, coordinate }) => {
                    return (
                        <Piece
                            key={`div-${id}`}
                            piece={piece}
                            square={square}
                            coordinate={coordinate}
                        >
                        </Piece>
                    )
                })
            }
        </Fragment>
    )
}