import { useSelector } from "react-redux"
import { CircularProgress } from "@mui/material"
import { Close, Circle } from "@mui/icons-material"

export default function Information() {
    const { turn, mode, aiThinking, winner } = useSelector((state) => state.caro)

    return (
        <div className="statistics-match-panel">
            <h3>Statistics</h3>

            <div className="statistics-content">
                <div className="statistics-name">Turn</div>
                <div className="statistics-data">{turn === 1 ?
                    <Close className="player-x"/> :
                    <Circle className="player-o"/>
                }</div>
            </div>
            {mode === "AI" && <div className="statistics-content">
                <div className="statistics-name">AI status</div>
                <div className="statistics-data">
                    <div className={`status ${aiThinking ? "waiting" : "success"}`}>
                        <span>{`${aiThinking ? "Thinking" : "Done"}`}</span>
                        {aiThinking && <CircularProgress size={"1.5rem"} />}
                    </div>
                </div>
            </div>}
            <div className="statistics-content">
                <div className="statistics-name">Winner</div>
                <div className="statistics-data">{winner !== "Undetermined" ? winner === 'X' ?
                    <Close className="player-x" /> :
                    <Circle className="player-o" /> : winner}</div>
            </div>
        </div>
    )
}