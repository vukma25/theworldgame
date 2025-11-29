
import Icon from '@mui/material/Icon';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Clock from './Clock'
import {
    setToggleSetting,
    setSelect
} from './Action'

const BootstrapInput = styled(InputBase)(() => ({
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        border: '.1rem solid var(--cl-gray)',
        padding: '1rem 2.6rem .5rem 1.2rem',
        fontSize: '1.4rem',

        '&:focus': {
            borderColor: 'var(--cl-primary-purple)'
        }
    }
}
));

function OptionsBar({ settings, dispatch }) {
    return (
        <div className="minesweeper-settings flex-div">
            <Select
                className="minesweeper-settings-level"
                value={settings.level}
                input={<BootstrapInput />}
                onChange={e => dispatch(setSelect(e.target.value))}
            >

                <MenuItem value={0} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>
                    <em>--Level--</em>
                </MenuItem>
                <MenuItem value={1} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Easy</MenuItem>
                <MenuItem value={2} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Medium</MenuItem>
                <MenuItem value={3} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Hard</MenuItem>
                <MenuItem value={4} sx={{
                    fontSize: "1.6rem",
                    color: "var(--cl-primary-purple)"
                }}>Custom</MenuItem>
            </Select>
            {
                settings.level === 4 &&
                <Icon
                    sx={{
                        fontSize: '3rem',
                        color: 'var(--cl-primary-purple)'
                    }}
                    title="Modify settings"
                    onClick={() => dispatch(setToggleSetting())}
                >tune</Icon>
            }
            <div className="minesweeper-settings-flag flex-div">
                <Icon sx={{
                    fontSize: '3rem',
                    color: 'var(--cl-red-flag)'
                }}>flag</Icon>
                <p>{settings.mine}</p>
            </div>
            <Clock 
                dispatch={dispatch}
                settings={settings}
            />
        </div>
    )
}

export default OptionsBar