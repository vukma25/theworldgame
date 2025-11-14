import { useSelector } from "react-redux"
import { CircularProgress, Icon } from "@mui/material"

export default function Information() {
    const { turn, mode, aiThinking, winner } = useSelector((state) => state.caro)

    return (
        <div className="statistics-match-panel">
            <h3>Statistics</h3>

            <div className="statistics-content">
                <div className="statistics-name">Turn</div>
                <div className="statistics-data">{turn === 1 ?
                    <Icon className="player-x">close</Icon> :
                    <Icon className="player-o">circle</Icon>
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
                    <Icon className="player-x">close</Icon> :
                    <Icon className="player-o">circle</Icon> : winner}</div>
            </div>
        </div>
    )
}