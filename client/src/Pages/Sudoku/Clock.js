
import { useContext } from "react";
import { UseClock } from "../../Components/ClockBase/ClockBase";

const formatTime = (clock) => {
    if (!clock) return
    return `${clock.minute.toString().padStart(2, '0')}:${clock.second.toString().padStart(2, '0')}`;
}


export default function Clock() {
    const clock = useContext(UseClock)

    return (
        <div className="stat-item">
            <div className="stat-value time">{formatTime(clock)}</div>
            <div className="stat-label">Thời gian</div>
        </div>
    )
}