import { useContext } from "react"
import { useSelector } from "react-redux"
import { BAPContext } from "./BAP"
import { convertToArray } from '../Function'

export default function Board() {
    const { chess, settings } = useSelector((state) => state.chess)
    const { board } = useContext(BAPContext)
    
    return (
        <svg
            className={`
                    chess-board ${settings.showBorder ? "" :
                    "chess-board__without-border"
                }
                `}
            viewBox="0 0 100 100"
        >
            {
                convertToArray(board).map((_, index) => {
                    const [i, j] = [
                        Math.floor(index / 8),
                        index % 8
                    ]

                    return (
                        <rect
                            key={`rect-${index}`}
                            className="chess-board-square"
                            x={j * 12.5}
                            y={i * 12.5}
                            width={12.5}
                            height={12.5}
                            fill={
                                (i % 2 === 0 && j % 2 !== 0) ||
                                    (i % 2 !== 0 && j % 2 === 0) ?
                                    settings.darkSquareColor :
                                    settings.lightSquareColor
                            }
                        ></rect>
                    )
                }).concat(settings.showCoordinates ?
                    chess.getCoordinates().map(([x, y, value], index) => {
                        return (
                            <text
                                key={`text-${index}`}
                                className="chess-board-coordinate"
                                x={x}
                                y={y}
                                fill={
                                    chess.direction === 1 ?
                                        value % 2 === 0 ||
                                            ['b', 'd', 'f', 'h'].includes(value) ?
                                            settings.darkSquareColor :
                                            settings.lightSquareColor :
                                        value % 2 === 0 ||
                                            ['b', 'd', 'f', 'h'].includes(value) ?
                                            settings.lightSquareColor :
                                            settings.darkSquareColor
                                }
                            >
                                {value}
                            </text>
                        )
                    }) : [])
            }
        </svg>
    )
}