import { useContext, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setNewGame, setLine } from "../../redux/features/caro"
import { CaroContext } from "./Caro"
import { setStatus } from "../../redux/features/caro"

export default function ControlBtn() {
    const { status, player, mode, size, board, aiDifficulty } = useSelector((state) => state.caro)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { setLog, refWebWorker } = useContext(CaroContext)

    function goHome() {
        navigate('/')
    }

    const handleChangeStatus = (status) => {
        dispatch(setStatus(status))
    }

    const handleControlBtn = useCallback(() => {
            if (["playing"].includes(status)) {
                dispatch(setNewGame())
                dispatch(setLine(null))
            }
            else if (mode === 'PLAYER') {
                setLog({
                    type: 'info',
                    message: 'The feature is coming soon!'
                })
                return
            }   
            else {
                handleChangeStatus("playing")
                if (player === 2 && mode === "AI") {
                    refWebWorker.current.postMessage({
                        action: "get_best_move",
                        data: {
                            init: {
                                size,
                                board,
                                ai: 1,
                                level: aiDifficulty
    
                            },
                            currentBoard: board
                        }
                    })
                }
            }
        }, [player, mode, status])

    return (
        <div className="reset-section">
            <button
                onClick={handleControlBtn}
                className="reset-button"
            >
                {status !== "waiting" ? "New game" : "Play"}
            </button>
            <button
                onClick={goHome}
                className="reset-button"
            >Home</button>
        </div>
    )
}