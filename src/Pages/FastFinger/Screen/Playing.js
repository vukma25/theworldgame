import TextBox from '../TextBox'
import TypingBox from '../TypingBox'
import Timer from '../Timer'

export default function Playing({ game, startGame, endGame, quitGame, dispatch}) {
    return (
        <div className="playing-screen">

            {/* Text Display */}
            <TextBox game={game} />

            {/* Input Area */}
            <TypingBox
                game={game}
                dispatch={dispatch}
                endGame={endGame}
            />

            {/* Live Stats */}
            <div className="live-stats">
                <div className="live-stat blue">
                    <div className="stat-value">{game.correctChars}</div>
                    <div className="stat-label">Correct</div>
                </div>
                <div className="live-stat red">
                    <div className="stat-value">{game.incorrectChars}</div>
                    <div className="stat-label">Incorrect</div>
                </div>
                <div className="live-stat green">
                    <div className="stat-value">{game.totalChars}</div>
                    <div className="stat-label">Total</div>
                </div>
                <div className="live-stat gray">
                    <Timer
                        duration={game.options.duration}
                        endGame={endGame}
                        state={game.state}
                    />
                    <div className="stat-label">Time</div>
                </div>
            </div>

            <div className="reset-section">
                <button
                    onClick={() => { startGame() }}
                    className="reset-button"
                >
                    New game
                </button>
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