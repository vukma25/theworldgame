import { useDispatch, useSelector } from 'react-redux';
import { bindFlag, openCell, tooltip } from '../../redux/features/minesweeper'
import Icon from '@mui/material/Icon'
import { Flag, DonutLarge } from '@mui/icons-material'
import {
    handleClickCell,
    handleToggleFlag,
} from './Functions';
import isMobileDevice from '../../lib/mobile';

function Cell({
    mine,
    index,
    setLog
}) {

    const minesweeper = useSelector((state) => state.minesweeper)
    const dispatch = useDispatch()

    function leftClickForDesktop() {
        const updatedCells = handleClickCell(index, minesweeper);
        if (updatedCells?.logError){
            setLog({
                "message": updatedCells.logError, 
                "type": "error"
            })
        }

        if (updatedCells) {
            dispatch(openCell(updatedCells));
        }
    }

    function rightClickForDesktop() {
        const updatedCells = handleToggleFlag(index, minesweeper);
        if (updatedCells?.logError) {
            setLog({
                "message": updatedCells.logError,
                "type": "error"
            })
        }
        
        if (updatedCells) {
            dispatch(bindFlag(updatedCells));
        }
    }

    return (
        <div
            className={`
                game-broad-cell flex-div 
                ${minesweeper.cells[index].opened ? "open" + mine : ""}
            `}
            onClick={

                isMobileDevice() ?
                (e) => {
                    const rect = e.target.getBoundingClientRect();
                    dispatch(tooltip({
                        'style': {
                            display: 'grid',
                            top: rect.top,
                            left: rect.left
                        },
                        'index': index
                    }))
                }
                :
                () => leftClickForDesktop()
            }
            onContextMenu={(e) => {
                e.preventDefault()
                rightClickForDesktop()
            }}
        >
            {
                minesweeper.gameOver && minesweeper.cells[index].isMine ?
                    <DonutLarge sx={{fontSize:'2rem',color:'var(--cl-primary-purple)'}}/>:
                    minesweeper.cells[index].flag ?
                    <Flag sx={{fontSize:'2rem',color:'var(--cl-red-flag)',pointerEvents:"none"}}/>:
                    (mine === 0 ? "" : mine)
            }
        </div>
    );
}

export default Cell;