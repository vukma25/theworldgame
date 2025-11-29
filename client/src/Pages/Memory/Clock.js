import { useContext } from 'react';
import { formatTime } from './Function';
import { UseClock } from '../../Components/ClockBase/ClockBase';

export default function Clock({ display }) {
    const clock = useContext(UseClock)

    return (
        <>
            {display && <div className={`stat timer ${(clock.minute === 0 && clock.second <= 10) ? 'critical' : ''}`}>
                Time: {formatTime(clock)}
            </div>}
        </>
    )
}