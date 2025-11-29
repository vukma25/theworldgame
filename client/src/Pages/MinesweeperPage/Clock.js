
import { useEffect, useContext } from "react";
import { UseClock } from "../../Components/ClockBase/ClockBase";
import { useSelector, useDispatch } from "react-redux";
import { timeout } from "../../redux/features/minesweeper";

function Clock() {

    const clock = useContext(UseClock)
    const minesweeper = useSelector((state) => state.minesweeper)
    const dispatch = useDispatch()

    function formatTime(clock) {
        if (!clock) return
        return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (clock.remain === 0 && minesweeper.level !== 0 && minesweeper.setTime.isTime) {
            dispatch(timeout("Time out"))
        }
    }, [clock.remain])
    
    return (
        <>
            {minesweeper.setTime.isTime && <div className="minesweeper-settings-clock">
                <div className="stat-value time">{formatTime(clock)}</div>
                <div className="stat-label">Thời gian</div>
            </div>}
        </>
    )
}

export default Clock