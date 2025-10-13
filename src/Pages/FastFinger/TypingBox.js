
import { useState, useEffect, useRef } from 'react'
import { setUserInput } from './Action'
import { getWpmAndStat } from './Functions'

export default function TypingBox({ game, dispatch, endGame }) {
    const [buffer, setBuffer] = useState('')
    const inputRef = useRef(null);

    const handlePreprocessingInput = (input) => {
        if (input === '\n' || input === ' ') return ''

        const regex = /\s[^\s]+/;

        if (regex.test(input)) {
            const posSpace = input.match(regex).index;
            const filteredInput = input.slice(0, posSpace);
            return filteredInput;
        }

        return input;
    }

    const handleInputChange = (e) => {
        if (game.state !== 'playing') return;

        let value = handlePreprocessingInput(e.target.value);
        let newIndex = game.currentIndex;

        if (value.slice(-1) === ' ' || value.slice(-1) === '\n') {
            newIndex += 1

            const [
                correct,
                incorrect,
                wpm,
                accuracy
            ] = getWpmAndStat([...game.userInput, buffer], game.targetParagraph, game.startTime)

            dispatch(setUserInput({
                buffer,
                newIndex,
                correct,
                incorrect,
                wpm,
                accuracy
            }))
            setBuffer('')
        } else {
            setBuffer(value)
        }

        if (newIndex >= game.targetParagraph.length) {
            endGame();
        }
    }

    useEffect(() => {
        if (game.state === 'playing') {
            inputRef.current?.focus();
        }
        setBuffer('')
    }, [game.state]);

    return (
        <div className="input-area">
            <textarea
                ref={inputRef}
                value={buffer}
                onChange={handleInputChange}
                className="typing-input"
                placeholder="Bắt đầu gõ ở đây..."
                disabled={game.state !== 'playing'}
            />
            <div className="input-counter">
                {game.userInput.join('').length} / {game.targetParagraph.join('').length}
            </div>
        </div>
    )
}