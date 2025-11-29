import { useContext } from "react"
import { useSelector } from "react-redux"
import { SnakeContext } from "../Snake"
import { ButtonGroup, Button } from "@mui/material"
import { PauseCircle, PlayCircle, ArrowBack, ArrowUpward, ArrowDownward, ArrowForward } from "@mui/icons-material"

export default function MobileControl() {
    const { pause } = useSelector((state) => state.snake)
    const { handleSetDirection, handlePauseGame } = useContext(SnakeContext) 

    return (
        <ButtonGroup variant='outlined' aria-label="button control" className="btn-group">
            <Button
                size="small"
                className="control-btn"
                startIcon={<ArrowBack />}
                onClick={() => { handleSetDirection("LEFT") }}
            >Left</Button>
            <Button
                size="small"
                className="control-btn"
                endIcon={<ArrowUpward />}
                onClick={() => { handleSetDirection("UP") }}
            >Up</Button>
            <Button size="small"
                className="control-btn" 
                endIcon={
                !pause ? <PauseCircle /> : <PlayCircle />
                }
                onClick={handlePauseGame}
            >
                {!pause ? "Pause" : "Play"}
            </Button>
            <Button
                size="small"
                className="control-btn"
                startIcon={<ArrowDownward />}
                onClick={() => { handleSetDirection("DOWN") }}
            >Down</Button>
            <Button
                size="small"
                className="control-btn"
                endIcon={<ArrowForward />}
                onClick={() => { handleSetDirection("RIGHT") }}
            >Right</Button>
        </ButtonGroup>
    )
}