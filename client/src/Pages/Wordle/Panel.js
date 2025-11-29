import { useSelector, useDispatch } from 'react-redux'
import { selectLen } from '../../redux/features/wordle'
import {
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material'

export default function Panel({ newGame }) {
    const { lengthWord } = useSelector((state) => state.wordle)
    const dispatch = useDispatch()

    const handleSelectChange = (e) => {
        dispatch(selectLen(Number(e.target.value)))
    }

    return (
        <div className="wordle-stats flex-div">
            <Button
                //className="wordle-btn-new-game"
                variant="outlined"
                color="success"
                size="large"
                onClick={newGame}
            >New game</Button>
            <FormControl className="wordle-select-len-word">
                <InputLabel className="select-label" id="select-len-word">The length of word</InputLabel>
                <Select
                    className="select-input"
                    label={"The length of word"}
                    labelId="select-len-word"
                    value={lengthWord}
                    onChange={handleSelectChange}
                >
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                </Select>
            </FormControl>
        </div>
    )
}