import { useSelector, useDispatch } from 'react-redux'
import {
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
} from '@mui/material'
import { setMode, setCaroVariant, setAIDifficulty, setPlayerSide } from "../../redux/features/caro"

export default function Settings() {

    const { size, status, player, mode, aiDifficulty } = useSelector((state) => state.caro)
    const dispatch = useDispatch()

    const handleChangeMode = (e) => {
        dispatch(setMode(e.target.value))
    }

    const handleChangeAiDifficulty = (e) => {
        dispatch(setAIDifficulty(e.target.value))
    }

    const handleChangeCaroVariant = (e) => {
        const variants = {
            "3": {
                "name": "Tic Tac Toe",
                "board": [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
                "size": 3
            },
            "15": {
                "name": "Caro",
                "board": Array.from({ length: 15 }, () => Array.from({ length: 15 }, () => 0)),
                "size": 15
            },
            "25": {
                "name": "Extra Caro",
                "board": Array.from({ length: 25 }, () => Array.from({ length: 25 }, () => 0)),
                "size": 25
            }
        }
        dispatch(setCaroVariant(variants[e.target.value]))
    }

    const handleChangeSide = (e) => {
        dispatch(setPlayerSide(parseInt(e.target.value)))
    }

    return (
        <div className="settings-panel">
            <h3>Settings</h3>

            <div className="settings-content">
                <div className="setting-group">
                    <FormControl>
                        <FormLabel
                            className="group-label"
                            id="setting-variants">Variants</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="setting-variants"
                            value={size}
                            onChange={handleChangeCaroVariant}
                            name="variants"
                        >
                            <FormControlLabel value={3} control={<Radio disabled={status === "playing"} />} label="3 x 3" />
                            <FormControlLabel value={15} control={<Radio disabled={status === "playing"} />} label="15 x 15" />
                            <FormControlLabel value={25} control={<Radio disabled={status === "playing"} />} label="25 x 25" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel
                            className="group-label"
                            id="setting-modes">Modes</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="setting-modes"
                            value={mode}
                            onChange={handleChangeMode}
                            name="mode"
                        >
                            <FormControlLabel value={"AI"} control={<Radio disabled={status === "playing"} />} label="AI" />
                            <FormControlLabel value={"PLAYER"} control={<Radio disabled={status === "playing"} />} label="Player" />
                        </RadioGroup>
                    </FormControl>
                </div>

                {mode === 'AI' && <>
                    <div className="setting-group">
                        <FormControl>
                            <FormLabel
                                className="group-label"
                                id="setting-difficulties">Difficulties</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="setting-difficulties"
                                value={aiDifficulty}
                                onChange={handleChangeAiDifficulty}
                                name="difficulties"
                            >
                                <FormControlLabel value={"easy"} control={<Radio disabled={status === "playing"} />} label="Easy" />
                                <FormControlLabel value={"medium"} control={<Radio disabled={status === "playing"} />} label="Medium" />
                                <FormControlLabel value={"hard"} control={<Radio disabled={status === "playing"} />} label="Hard" />
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel
                                className="group-label"
                                id="setting-sides">Side</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="setting-sides"
                                value={player}
                                onChange={handleChangeSide}
                                name="sides"
                            >
                                <FormControlLabel value={1} control={<Radio disabled={status === "playing"} />} label="X" />
                                <FormControlLabel value={2} control={<Radio disabled={status === "playing"} />} label="O" />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </>
                }
            </div>
        </div>
    )
}