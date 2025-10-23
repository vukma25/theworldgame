import { useEffect, useState } from 'react';
import Icon from '@mui/material/Icon';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ClockBase from '../../Components/ClockBase/ClockBase';
import Clock from './Clock'
import { useSelector, useDispatch } from 'react-redux';
import { difficulties, toggleSettings } from '../../redux/features/minesweeper'


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

function OptionsBar({ setTimeFinish }) {

    const minesweeper = useSelector((state) => state.minesweeper)
    const dispatch = useDispatch()
    const [semaphore, setSemaphore] = useState(false)

    function handleAssignSemaphore() {
        if (minesweeper.gameOver) {
            setSemaphore(true)
        }
        else if (minesweeper.level === 4 && !minesweeper.isInGame) {
            setSemaphore(true)
        }
        else if (!minesweeper.setTime.isTime) {
            setSemaphore(true)
        }
        else {
            setSemaphore(false)
        }
    }

    function setDifficulties(e) {
        dispatch(difficulties(Number(e.target.value)))
    }

    function handleToggleSettings() {
        dispatch(toggleSettings())
    }

    useEffect(() => {
        handleAssignSemaphore()
    }, [minesweeper.level, minesweeper.gameOver, minesweeper.isInGame, minesweeper.setTime.isTime])

    return (
        <div className="minesweeper-settings flex-div">
            <Select
                className="minesweeper-settings-level"
                value={minesweeper.level}
                input={<BootstrapInput />}
                onChange={setDifficulties}
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
                (minesweeper.level === 4 && minesweeper.setTime.isTime) &&
                <Icon
                    sx={{
                        fontSize: '3rem',
                        color: 'var(--cl-primary-purple)'
                    }}
                    title="Modify settings"
                    onClick={handleToggleSettings}
                >tune</Icon>
            }
            <div className="minesweeper-settings-flag flex-div">
                <Icon sx={{
                    fontSize: '3rem',
                    color: 'var(--cl-red-flag)'
                }}>flag</Icon>
                <p>{minesweeper.flag}</p>
            </div>
            <ClockBase
                type={"countdown"}
                duration={minesweeper.setTime.duration}
                semaphore={semaphore}
                setTimeFinish={setTimeFinish}
            >

                <Clock />
            </ClockBase>
            {
                !minesweeper.setTime.isTime &&
                <Icon
                    sx={{
                        fontSize: '3rem',
                        color: 'var(--cl-primary-purple)',
                        marginLeft: 'auto'
                    }}
                    title="Modify settings"
                    onClick={handleToggleSettings}
                >tune</Icon>
            }
        </div>
    )
}

export default OptionsBar