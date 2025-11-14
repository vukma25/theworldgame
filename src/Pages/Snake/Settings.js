import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMode, setSpeed, setSize, setMap, setNewGame } from '../../redux/features/snake';
import {
    Button, Slider, FormControl, InputLabel, Select,
    MenuItem, RadioGroup, FormControlLabel, FormLabel, Radio
} from '@mui/material';
import { SnakeContext } from './Snake';
import { maps } from './Static';

export default function Settings() {
    const { mode, status, speed, size, map } = useSelector((state) => state.snake)
    const dispatch = useDispatch()
    const { spFood } = useContext(SnakeContext)

    const handleChangeSize = (e) => {
        const size = Number(e.target.value)
        const line = Math.floor(size / 2)
        const snake = [[line, 4], [line, 3], [line, 2]]
        const food = spFood(snake)
        dispatch(setSize({ sk: snake, fd: food, size }))
    }

    const handleChangeSpeed = (e) => {
        dispatch(setSpeed(Number(e.target.value)))
    }

    const handleSetMode = (e) => {
        dispatch(setMode(e.target.value))
    }

    const handleSetMap = (e) => {
        dispatch(setMap(Number(e.target.value)))
    }

    const newGame = () => {
        if (mode !== "map") {
            const line = Math.floor(size / 2)
            const sn = [[line, 4], [line, 3], [line, 2]]
            const food = spFood(sn)

            dispatch(setNewGame({ snake: sn, food, direction: "RIGHT" }))
        } else {
            const { snake, food, direction } = maps[map]
            dispatch(setNewGame({ snake, food, direction }))
        }
    }

    return (
        <div className="settings-panel">
            <div className="panel-title">Setting</div>
            <div className="settings-content">
                <div className="setting-group">
                    <FormControl fullWidth>
                        <InputLabel id="select-mode">Mode</InputLabel>
                        <Select
                            labelId="select-mode"
                            id="modes"
                            value={mode}
                            label="Mode"
                            onChange={handleSetMode}
                            disabled={status === "playing"}
                        >
                            <MenuItem value={"no_limit"}>No border</MenuItem>
                            <MenuItem value={"limit"}>Border</MenuItem>
                            <MenuItem value={"map"}>Map</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {mode === "map" &&
                    <FormControl>
                        <FormLabel id="type-of-map">Select map</FormLabel>
                        <RadioGroup
                            aria-labelledby="type-of-map"
                            defaultValue={0}
                            name="radio-buttons-group"
                            onChange={handleSetMap}
                        >
                            {maps.map(({ name }, index) => {
                                return <FormControlLabel key={index} value={index} control={<Radio />} label={name} />
                            })}

                        </RadioGroup>
                    </FormControl>
                }

                {mode !== "map" &&
                    <div className="setting-group">
                        <label>Size</label>
                        <Slider
                            size='small'
                            min={10}
                            max={24}
                            value={size}
                            valueLabelDisplay='auto'
                            onChange={handleChangeSize}
                            disabled={status === "playing"}
                        />
                        <div className="setting-value">Current size: {size}</div>
                    </div>}
                <div className="setting-group">
                    <label>Speed (ms/tick)</label>
                    <Slider
                        size='small'
                        min={70}
                        max={300}
                        step={10}
                        marks
                        value={speed}
                        onChange={handleChangeSpeed}
                        disabled={status === "playing"}
                    />
                    <div className="setting-value">Current speed: {370 - speed} ms</div>
                </div>
                <Button
                    variant='contained'
                    onClick={newGame}
                    className="reset"
                    disabled={status !== "game_over"}
                >
                    New game
                </Button>
            </div>
        </div>
    )
}