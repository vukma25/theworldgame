import Icon from '@mui/material/Icon'
import { setCells, setFlag, setToolDisplay } from './Action';
import {
    handleClickCell,
    handleToggleFlag,
    isMobileDevice
} from './Functions';

function Cell({
    mine,
    dispatch,
    index,
    settings
}) {


    const copySettings = {
        ...settings,
        'cells': settings.cells.map(e => ({ ...e })),
        'setTime': {
            ...settings.setTime
        },
        'tool': {
            ...settings.tool,
            'style': {
                ...settings.tool.style
            }
        }
    }

    function leftClickForDesktop() {
        const updatedCells = handleClickCell(index, copySettings);
        if (updatedCells) {
            dispatch(setCells(updatedCells));
        }
    }

    function rightClickForDesktop() {
        const updatedCells = handleToggleFlag(index, copySettings);
        if (updatedCells) {
            dispatch(setFlag(updatedCells));
        }
    }

    return (
        <div
            className={`
                game-broad-cell flex-div 
                ${settings.cells[index].opened ? "open" + mine : ""}
            `}
            onClick={

                isMobileDevice() ?
                (e) => {
                    const rect = e.target.getBoundingClientRect();
                    dispatch(setToolDisplay({
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
                settings.gameOver && settings.cells[index].isMine ?
                    <Icon
                        sx={{
                            fontSize: '2rem',
                            color: 'var(--cl-primary-purple)'
                        }}
                    >donut_large</Icon>
                    :
                    (
                        settings.cells[index].flag ?
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