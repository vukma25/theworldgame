import { useState, useEffect, useRef } from 'react'

export default function Timer({ duration, endGame, status }) {

    const [timeLeft, setTimeLeft] = useState(duration)
    const timer = useRef(null)

    const formatTime = (time) => {
        const minute = Math.floor(time / 60)
        const second = time % 60
        return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (status === 'playing') {
            timer.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0) {
                        setTimeout(() => endGame(), 10)
                        return prev
                    }

                    return prev - 1
                })
            }, 1000)
        }

        return () => {
            if (timer.current) { clearInterval(timer.current) }
        }
    }, [status, endGame])

    return (
        <div className={`stat-value ${timeLeft < 10 ? "danger" : ""}`}>
            {formatTime(timeLeft)}
        </div>
    )
}