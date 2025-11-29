import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    setStatus,
    exit
} from '../../../redux/features/fastfinger'
import TextBox from '../TextBox'
import TypingBox from '../TypingBox'
import Timer from '../Timer'

export default function Playing({ setBestWpm, setLatestAccuracy }) {

    const { 
        status,
        wpm, 
        accuracy,
        correctChars,
        incorrectChars,
        totalChars,
        options
    } = useSelector((state) => state.fastfinger)
    const dispatch = useDispatch()

    const endGame = useCallback(() => {
        dispatch(setStatus("finished"))
        updateRecord()
    }, [])

    const quitGame = () => {
        dispatch(exit())
    }

    const updateRecord = () => {
        let bestWpm = localStorage.getItem('bestWpm')
        bestWpm = JSON.parse(bestWpm)

        if (wpm > bestWpm) {
            bestWpm = wpm
        }

        localStorage.setItem('bestWpm', JSON.stringify(bestWpm ?? wpm))
        localStorage.setItem('accuracy', JSON.stringify(accuracy))
        setBestWpm(bestWpm ?? wpm)
        setLatestAccuracy(accuracy)
    }

    return (
        <div className="playing-screen">

            {/* Text Display */}
            <TextBox />

            {/* Input Area */}
            <TypingBox endGame={endGame} />

            {/* Live Stats */}
            <div className="live-stats">
                <div className="live-stat blue">
                    <div className="stat-value">{correctChars}</div>
                    <div className="stat-label">Correct</div>
                </div>
                <div className="live-stat red">
                    <div className="stat-value">{incorrectChars}</div>
                    <div className="stat-label">Incorrect</div>
                </div>
                <div className="live-stat green">
                    <div className="stat-value">{totalChars}</div>
                    <div className="stat-label">Total</div>
                </div>
                <div className="live-stat gray">
                    <Timer
                        duration={options.duration}
                        endGame={endGame}
                        status={status}
                    />
                    <div className="stat-label">Time</div>
                </div>
            </div>

            <div className="reset-section">
                <button
                    onClick={quitGame}
                    className="reset-button"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}