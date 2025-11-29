import { useReducer } from 'react'
import OptionsBar from './OptionBar';
import SettingsBroad from './SettingsBroad';
import GameOver from './GameOver'
import Cell from './Cell';
import Logger from './Logger';
import Tool from './Tool'
import { initialState, reducer } from './Reducer'
import {
    marks,
    convertToMinute,
    isMobileDevice
} from './Functions';
import "./Minesweeper.css";


function Minesweeper() {

    const [settings, dispatch] = useReducer(reducer, initialState)

    return (
        <>
            <Tool
                dispatch={dispatch}
                settings={settings}
            />
            <div className="minesweeper">
                {/* Thanh thong tin */}
                <OptionsBar
                    settings={settings}
                    dispatch={dispatch}
                />
                <div className="minesweeper-broad">
                    {/* Bang cau hinh game */}
                    <SettingsBroad
                        settings={settings}
                        dispatch={dispatch}
                        marks={marks}
                        convertToMinute={convertToMinute}
                    />

                    <Logger log={settings.logError} />
                       
                    {/* Bang game chinh */}
                    <div
                        className="game-broad"
                        style={
                            {
                                display: 'grid',
                                gridTemplateRows:
                                    `repeat(
                                    ${settings.row},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                                gridTemplateColumns:
                                    `repeat(
                                    ${settings.col},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                            }
                        }
                    >
                        {
                            settings.gameOver &&
                            <GameOver
                                dispatch={dispatch}
                                message={settings.message}
                            />
                        }
                        {
                            settings.cells?.map((cell, index) => {
                                return <Cell
                                    key={index}
                                    mine={cell.mine}
                                    dispatch={dispatch}
                                    index={index}
                                    settings={settings}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Minesweeper
