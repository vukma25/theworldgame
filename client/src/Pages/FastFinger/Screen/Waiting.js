import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { changeOptions } from "../../../redux/features/fastfinger"

export default function Waiting({ startGame, bestWpm, latestAccuracy }) {

    const { options } = useSelector((state) => state.fastfinger)
    const dispatch = useDispatch()

    const handleSetOption = useCallback((option) => {
        dispatch(changeOptions(option))
    }, [options])

    return (
        <div className="waiting-screen">
            <div className="selection">
                <h1>Select option</h1>
                <div className="options">
                    {[15, 30, 60, 120].map(time => (
                        <button
                            key={time}
                            onClick={() => {
                                handleSetOption({
                                    'duration': time
                                })
                            }}
                            className={`option ${options.duration === time ? 'selected' : ''}`}
                        >
                            {time}s
                        </button>
                    ))}
                </div>
                <div className="options">
                    {
                        [
                            { name: "with capitalization", type: "useUpper" },
                            { name: "with mark and article", type: "useMarkAndArticle" }

                        ].map(({ name, type }) => (
                            <button
                                key={name}
                                onClick={() => {
                                    handleSetOption({
                                        [type]: !options[type]
                                    })
                                }}
                                className={`option ${options[type] ? 'selected' : ''}`}
                            >
                                {name}
                            </button>
                        ))
                    }
                </div>
                <button
                    onClick={() => { startGame() }}
                    className="start-button"
                >
                    Start
                </button>
            </div>

            {/* Best Scores */}
            <div className="best-scores">
                <div className="best-score yellow">
                    <div className="score-value">{bestWpm}</div>
                    <div className="score-label">The best WPM</div>
                </div>
                <div className="best-score green">
                    <div className="score-value">{latestAccuracy}%</div>
                    <div className="score-label">Accuracy</div>
                </div>
            </div>
        </div>
    )
}