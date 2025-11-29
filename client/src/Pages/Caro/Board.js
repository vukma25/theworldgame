import { useContext } from "react"
import { useSelector } from "react-redux";
import { Close, Circle } from "@mui/icons-material"
import { CaroContext } from "./Caro";

export default function Board() {
    const { line, size, board, player } = useSelector((state) => state.caro)
    const { handleCellClick } = useContext(CaroContext)

    const getCellClass = (row, col) => {
        let baseClass = "caro-cell";
        if (line) {
            const isWinningCell = line.some(pos => pos.r === row && pos.c === col);
            const [dy, dx] = [
                line[0].r - line[1].r,
                line[0].c - line[1].c,
            ]

            if (isWinningCell) {
                baseClass += " winning-cell winning-line";

                if (dy === dx) {
                    baseClass += " line-cross-not-main"
                } else if (dy === 0) {
                    baseClass += " line-horizontal"
                } else if (dx === 0) {
                    baseClass += " line-vertical"
                } else {
                    baseClass += " line-cross-main"
                }
            }
        }

        return baseClass;
    }

    const getCellContent = (value) => {
        if (value === 1) return <Close
            className="player-x"
            sx={{ fontSize: `${size === 25 ? 1 :
                size === 15 ? 1.5 : 8}rem` }}/>
        if (value === 2) return <Circle
            className="player-o"
            sx={{ fontSize: `${size === 25 ? 1 :
                size === 15 ? 1.5 : 6}rem` }}/>
        return null;
    }

    return (
        <div className="caro-board-section flex-div">
            <div className="board-container">
                <div
                    className="caro-board"
                    style={{
                        gridTemplateColumns: `repeat(${size}, 1fr)`
                    }}
                >
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getCellClass(rowIndex, colIndex)}
                                onClick={() => handleCellClick(rowIndex, colIndex, player)}
                            >
                                {getCellContent(cell)}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}