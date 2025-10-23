import { useDispatch, useSelector } from 'react-redux';
import { bindFlag, openCell, tooltip } from '../../redux/features/minesweeper'
import Icon from '@mui/material/Icon'
import {
    handleClickCell,
    handleToggleFlag,
    isMobileDevice
} from './Functions';

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
                    <Icon
                        sx={{
                            fontSize: '2rem',
                            color: 'var(--cl-primary-purple)'
                        }}
                    >donut_large</Icon>
                    :
                    (
                        minesweeper.cells[index].flag ?
                            <Icon
                                sx={{
                                    fontSize: '2rem',
                                    color: 'var(--cl-red-flag)',
                                    pointerEvents: "none"
                                }}
                            >flag</Icon>
                            :
                            (mine === 0 ? "" : mine)
                    )
            }
        </div>
    );
}

export default Cell;