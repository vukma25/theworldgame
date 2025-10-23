import { useSelector } from 'react-redux';
import Icon from '@mui/material/Icon'

function VirtualKeyBoard({ handlePressKey }) {
    const { keyboardStatus, gameStatus } = useSelector((state) => state.wordle)
    const keyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
    ]

    const getKeyClass = (letter) => {
        let baseClass = "keyboard-key";

        const status = keyboardStatus[letter];
        if (status === 'correct') {
            baseClass += " correct";
        } else if (status === 'present') {
            baseClass += " present";
        } else if (status === 'absent') {
            baseClass += " absent";
        }

        return baseClass;
    }

    return (
        <div className="keyboard">
            {
                keyboard.map((row, rowIndex) => (
                    <div key={rowIndex} className="keyboard-row">
                        {row.map((key) => (
                            <button
                                key={key}
                                onClick={() => { handlePressKey(key) }}
                                disabled={gameStatus !== 'playing'}
                                className={`${getKeyClass(key)} ${key === 'ENTER' || key === 'DELETE' ? 'special-key' : ''}`}
                            >
                                {key === 'DELETE' ? <Icon>backspace</Icon> : key}
                            </button>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default VirtualKeyBoard