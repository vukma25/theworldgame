import { useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setStatus } from "../../redux/features/snake"
import { SnakeContext } from "./Snake"
import { IconButton, Tooltip, Button } from "@mui/material"
import { PauseCircle, PlayCircle } from "@mui/icons-material"

export default function StatPanel() {
    const { score, extraScore, status, pause } = useSelector((state) => state.snake)
    const dispatch = useDispatch()
    const { highestScore, handlePauseGame } = useContext(SnakeContext)

    const handleStartGame = () => {
        dispatch(setStatus("playing"))
    }

    return (
        <div className="stats-container">
            <div className="stats-group">
                <div className="stat score">
                    Score: {score}
                </div>
                <div className="stat extra">
                    Extra: {extraScore}
                </div>
                <div className="stat highscore">
                    Highest score: {highestScore}
                </div>
            </div>

            <div className="action-buttons">
                {status === "playing" && <Tooltip title={`${!pause ? "Pause" : "Play"}`}>
                    <IconButton size="small" onClick={handlePauseGame}>
                        {!pause ? <PauseCircle fontSize="large" /> :
                            <PlayCircle fontSize="large" />}
                    </IconButton>
                </Tooltip>}
                <Button
                    variant="contained"
                    onClick={handleStartGame}
                    className="btn reset"
                    disabled={status !== "waiting"}
                >
                    Play
                </Button>
            </div>
        </div>
    )
}