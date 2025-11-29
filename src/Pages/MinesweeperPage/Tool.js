
import { useEffect, useState } from 'react'
import Icon from '@mui/material/Icon'
import { setCells, setFlag, setToolDisplay } from './Action'
import { 
    handleClickCell, 
    handleToggleFlag,
    gridTemplateColumns
} from './Functions'

function Tool({
    dispatch,
    settings
}) {

    const copySettings = {
        ...settings,
        'setTime': {
            ...settings.setTime
        },
        'cells': settings.cells.map(e => ({ ...e })),
        'tool': {
            ...settings.tool,
            'style': {
                ...settings.tool.style
            }
        }
    }

    const [style, setStyle] = useState({})

    useEffect(() => {
        const upgradeStyle = gridTemplateColumns(
            settings.tool.index,
            settings.row,
            settings.col,
            settings.tool.style.top,
            settings.tool.style.left
        )

        setStyle(upgradeStyle)
    }, [settings])

    return (
        <div 
            className="tool"
            style={{
                ...style,
                ...copySettings.tool.style
            }}
        >
            <div className="tool-cell refer"></div>
            <div 
                className="tool-cell tool-cell-open flex-div"
                onClick={() => {
                    dispatch(setCells(
                        handleClickCell(copySettings.tool.index, copySettings)
                    ))
                }}
            >
                <Icon className="tool-btn open">fullscreen</Icon>
            </div>
            <div 
                className="tool-cell tool-cell-close flex-div"
                onClick={() => dispatch(setToolDisplay({
                    'style': { display: 'none' }
                }))}
            >
                <Icon className="tool-btn close">close</Icon>
            </div>
            <div 
                className="tool-cell tool-cell-flag flex-div"
                onClick={() => {
                    dispatch(setFlag(
                        handleToggleFlag(copySettings.tool.index, copySettings)
                    ))
                }}
            >
                <Icon className="tool-btn flag">flag</Icon>
            </div>
        </div>
    )
}

export default Tool