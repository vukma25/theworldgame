
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindFlag, openCell, tooltip } from '../../redux/features/minesweeper'
import { Flag, MyLocation, Close } from '@mui/icons-material'
import {
    handleClickCell,
    handleToggleFlag,
    gridTemplateColumns
} from './Functions'

function Tool() {

    const minesweeper = useSelector((state) => state.minesweeper)
    const dispatch = useDispatch()
    const [style, setStyle] = useState({})

    function handleOpenCell() {
        dispatch(openCell(
            handleClickCell(minesweeper.tool.index, minesweeper)
        ))
    }

    function positionTooltip() {
        dispatch(tooltip({
            'style': { display: 'none' }
        }))
    }

    function tickFlag() {
        dispatch(bindFlag(
            handleToggleFlag(minesweeper.tool.index, minesweeper)
        ))
    }

    useEffect(() => {
        const upgradeStyle = gridTemplateColumns(
            minesweeper.tool.index,
            minesweeper.row,
            minesweeper.col,
            minesweeper.tool.style.top,
            minesweeper.tool.style.left
        )

        setStyle(upgradeStyle)
    }, [minesweeper])

    return (
        <div
            className="tool"
            style={{
                ...minesweeper.tool.style,
                ...style
            }}
        >
            <div className="tool-cell refer">
            </div>
            <div
                className="tool-cell tool-cell-open flex-div"
                onClick={handleOpenCell}
            >
                <MyLocation className="tool-btn open" />
            </div>
            <div
                className="tool-cell tool-cell-close flex-div"
                onClick={positionTooltip}
            >
                <Close className="tool-btn close" />
            </div>
            <div
                className="tool-cell tool-cell-flag flex-div"
                onClick={tickFlag}
            >
                <Flag className="tool-btn flag" />
            </div>
        </div>
    )
}

export default Tool