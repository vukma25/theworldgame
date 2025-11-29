import { useMemo } from "react";
import { useSelector } from "react-redux";
import MobileControl from "./MobileControl";
import { maps } from "../Static";
import isMobileDevice from "../../../lib/mobile";

export default function Board() {
    const { size, mode, food: { type, fd }, map, snake, direction } = useSelector((state) => state.snake)

    const cellSize = useMemo(() => {
        if (isMobileDevice()) return 1.5
        return 2
    }, [])

    const isHead = (sn, r, c) => {
        return sn[0] === r && sn[1] === c
    }

    const isOnSnake = (sn, r, c) => {
        return sn.some(([row, col]) => row === r && col === c)
    }

    const getCellClass = (r, c) => {
        let cellClass = "cell "

        if ((fd[0] === r && fd[1] === c)) {
            cellClass += "food "
            if (type !== "normal") {
                cellClass += "extra "
            }
            return cellClass
        }
        if (isHead(snake[0], r, c)) {
            cellClass += `head ${direction.toLowerCase()} `
            return cellClass
        }
        if (isOnSnake(snake, r, c)) {
            cellClass += "body "
            return cellClass
        }
        if ((map !== null ? maps[map].area : []).some(([row, col]) => row === r && col === c)) {
            cellClass += "fence "
            return cellClass
        }

        return cellClass
    }

    return (
        <div className="board-wrapper">
            <div
                className="snake-board"
                style={{
                    gridTemplateColumns: `repeat(${size}, ${cellSize}rem)`,
                    gridTemplateRows: `repeat(${size}, ${cellSize}rem)`,
                    width: `fit-content`,
                    border: `${mode === "limit" ? ".2rem solid" : "none"}`
                }}
                aria-label="The board snake"
            >
                {Array.from({ length: size }).map((_, r) =>
                    Array.from({ length: size }).map((_, c) => {
                        const classes = getCellClass(r, c)
                        return (
                            <div
                                key={`${r}-${c}`}
                                className={classes}
                                role="presentation"
                            >
                            </div>
                        );
                    })
                )}
            </div>
            {isMobileDevice() && <MobileControl />}
        </div>
    )
}