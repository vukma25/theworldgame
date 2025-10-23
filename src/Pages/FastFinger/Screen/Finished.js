import { useSelector } from "react-redux"
import { getProgress } from "../Functions"

export default function Finished({ startGame, bestWpm }) {
    const {
        wpm, accuracy, correctChars, targetParagraph, currentIndex
    } = useSelector((state) => state.fastfinger)

    return (
        <div className="finished-screen">
            <div className="results-container">
                <h2>Complete!</h2>

                <div className="results-grid">
                    <div className="result-card">
                        <div className="result-value blue">{wpm}</div>
                        <div className="result-label">WPM</div>
                        {wpm > bestWpm && <div className="record-badge">New record!</div>}
                    </div>
                    <div className="result-card">
                        <div className="result-value green">{accuracy}%</div>
                        <div className="result-label">Accuracy</div>
                    </div>
                    <div className="result-card">
                        <div className="result-value purple">{correctChars}</div>
                        <div className="result-label">Correct</div>
                    </div>
                    <div className="result-card">
                        <div className="result-value orange">{Math.round(getProgress(targetParagraph, currentIndex))}%</div>
                        <div className="result-label">Progress</div>
                    </div>
                </div>

                {/* Performance Rating */}
                <div className="performance-rating">
                    <div className="rating-title">Evaluate</div>
                    <div className="rating-text">
                        {wpm >= 60 ? 'Super fast! Check leadboard to see if you on top' :
                            wpm >= 44 ? 'Good! You are quite fast' :
                                wpm >= 32 ? 'Average' :
                                    wpm >= 15 ? 'Slow! Training as needed' :
                                        'Too slow! Is this your the first time using phone or PC?'}
                    </div>
                </div>

                <div className="action-buttons">
                    <button
                        onClick={() => { startGame("old") }}
                        className="action-button blue"
                    >
                        Try again
                    </button>
                    <button
                        onClick={() => startGame()}
                        className="action-button green"
                    >
                        New game
                    </button>
                </div>
            </div>
        </div>
    )
}