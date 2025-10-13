import { getProgress } from "../Functions"

export default function Finished({ game, startGame, bestWpm }) {
    return (
        <div className="finished-screen">
            <div className="results-container">
                <h2>Hoàn thành!</h2>

                <div className="results-grid">
                    <div className="result-card">
                        <div className="result-value blue">{game.wpm}</div>
                        <div className="result-label">WPM</div>
                        {game.wpm > bestWpm && <div className="record-badge">New record!</div>}
                    </div>
                    <div className="result-card">
                        <div className="result-value green">{game.accuracy}%</div>
                        <div className="result-label">Accuracy</div>
                    </div>
                    <div className="result-card">
                        <div className="result-value purple">{game.correctChars}</div>
                        <div className="result-label">Correct</div>
                    </div>
                    <div className="result-card">
                        <div className="result-value orange">{Math.round(getProgress(game))}%</div>
                        <div className="result-label">Progress</div>
                    </div>
                </div>

                {/* Performance Rating */}
                <div className="performance-rating">
                    <div className="rating-title">Evaluate</div>
                    <div className="rating-text">
                        {game.wpm >= 60 ? 'Super fast! Check leadboard to see if you on top' :
                            game.wpm >= 44 ? 'Good! You are quite fast' :
                                game.wpm >= 32 ? 'Average' :
                                    game.wpm >= 15 ? 'Slow! Training as needed' :
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
                        onClick={() => { startGame() }}
                        className="action-button green"
                    >
                        New game
                    </button>
                </div>
            </div>
        </div>
    )
}