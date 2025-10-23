import { useSelector, useDispatch } from 'react-redux'
import { 
    rows, 
    columns, 
    proportion, 
    time, 
    duration,
    inGame,
    resetSettings
} from '../../redux/features/minesweeper'
import { Icon, Slider } from '@mui/material'
import { convertToMinute, marks } from './Functions'

function SettingsBroad() {
    const minesweeper = useSelector((state) => state.minesweeper)
    const dispatch = useDispatch()

    function setRows(e, value) {
        dispatch(rows(value))
    }
    function setCols(e, value) {
        dispatch(columns(value))
    }
    function setPros(e, value) {
        dispatch(proportion(value))
    }
    function setDuration(e, value) {
        dispatch(duration(value))
    }
    function setInGame() {
        dispatch(inGame())
    }
    function refreshSettings() {
        dispatch(resetSettings())
    }
    function hasTime() {
        dispatch(time())
    }

    return (
        <div
            className={`
                customize-broad 
                ${minesweeper.level === 4 && !minesweeper.hidden ?
                    "" : "customize-broad__hidden"
                }
            `}
        >
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >table_rows_narrow</Icon><p>Row</p>
                    </div>
                    <p className="customize-data">{minesweeper.row}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    defaultValue={20}
                    min={10}
                    max={30}
                    value={minesweeper.row}
                    disabled={minesweeper.isInGame}
                    onChange={setRows}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >calendar_view_week</Icon><p>Column</p>
                    </div>
                    <p className="customize-data">{minesweeper.col}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    defaultValue={20}
                    min={10}
                    max={30}
                    value={minesweeper.col}
                    disabled={minesweeper.isInGame}
                    onChange={setCols}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >percent</Icon><p>Proportion</p>
                    </div>
                    <p className="customize-data">{minesweeper.proportion}</p>
                </div>  
                <Slider
                    className="difficulty"
                    valueLabelDisplay="auto"
                    defaultValue={1.5}
                    step={0.5}
                    min={1.5}
                    max={4.5}
                    marks={marks}
                    disabled={minesweeper.isInGame}
                    sx={{
                        '& .MuiSlider-markLabel': {
                            color: 'var(--cl-primary-purple)',
                            fontSize: '1.2rem',
                            fontWeight: 600,
                            transform: 'translateY(-.2rem)'
                        },
                        color: `${minesweeper.proportion >= 4 ? "red" : 
                                minesweeper.proportion >= 2.5 ? "var(--cl-primary-purple)" : "green"
                            }`
                    }}
                    value={minesweeper.proportion}
                    onChange={setPros}
                />
            </div>
            <div className="customize-container">
                <div className="customize-field">
                    <div className="customize-name flex-div">
                        <Icon
                            className="customize-name-icon"
                        >all_out</Icon><p>Mines</p>
                    </div>
                    <p className="customize-data">{minesweeper.mine}</p>
                </div>
                <Slider
                    className="range-allow"
                    valueLabelDisplay="auto"
                    value={minesweeper.mine}
                    min={15}
                    max={135}
                    disabled
                />
            </div>
            <div className="setting-time flex-div">
                <input
                    type="checkbox"
                    id="setTime"
                    checked={minesweeper.setTime.isTime}
                    onChange={hasTime}
                    disabled={minesweeper.isInGame}
                />
                <label htmlFor="setTime">set time</label>
            </div>
            {
                minesweeper.setTime.isTime &&
                <div className="customize-container">
                    <div className="customize-field">
                        <div className="customize-name flex-div">
                            <Icon
                                className="customize-name-icon"
                            >alarm</Icon><p>Time (s)</p>
                        </div>
                        <p className="customize-data">
                            {`${minesweeper.setTime.duration}s ~ ${convertToMinute(minesweeper.setTime.duration)
                                }`}
                        </p>
                    </div>
                    <Slider
                        className="range-allow"
                        valueLabelDisplay="auto"
                        step={60}
                        min={300}
                        max={900}
                        value={minesweeper.setTime.duration}
                        onChange={setDuration}
                        marks
                        disabled={minesweeper.isInGame}
                    />
                </div>
            }
            <button
                className="confirm-customize"
                onClick={setInGame}
                disabled={minesweeper.isInGame}
            >
                Ok
            </button>
            {
                minesweeper.isInGame &&
                <button
                    className="reset-customize"
                    onClick={refreshSettings}
                >
                    Reset
                </button>
            }
        </div>
    )
}

export default SettingsBroad