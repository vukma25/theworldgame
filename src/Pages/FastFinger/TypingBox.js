
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getWpmAndStat } from './Functions'
import { typing } from '../../redux/features/fastfinger';

export default function TypingBox({ endGame }) {
    const {
        status, userInput, startTime, targetParagraph, currentIndex
    } = useSelector((state) => state.fastfinger)
    const dispatch = useDispatch()

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
        if (status !== 'playing') return;

        let value = handlePreprocessingInput(e.target.value);
        let newIndex = currentIndex;

        if (value.slice(-1) === ' ' || value.slice(-1) === '\n') {
            newIndex += 1

            const [
                correct,
                incorrect,
                wpm,
                accuracy
            ] = getWpmAndStat([...userInput, buffer], targetParagraph, startTime)

            dispatch(typing({
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

        if (newIndex >= targetParagraph.length) {
            endGame();
        }
    }

    useEffect(() => {
        if (status === 'playing') {
            inputRef.current?.focus();
        }
        setBuffer('')
    }, [status]);

    return (
        <div className="input-area">
            <textarea
                ref={inputRef}
                value={buffer}
                onChange={handleInputChange}
                className="typing-input"
                placeholder="Bắt đầu gõ ở đây..."
                disabled={status !== 'playing'}
            />
            <div className="input-counter">
                {userInput.join('').length} / {targetParagraph.join('').length}
            </div>
        </div>
    )
}