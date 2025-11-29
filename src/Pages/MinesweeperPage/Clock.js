import { useState, useEffect } from "react"
import { runOutOfTime } from "./Action"

function Clock({ dispatch, settings }) {

    const [clock, setClock] = useState({
        'minute': 0,
        'second': 0,
        'remain': 0
    })

    useEffect(() => {

        const duration = settings.setTime.duration

        setClock(prevState => {
            return {
                ...prevState,
                'minute': Math.floor(duration / 60),
                'second': duration - Math.floor(duration / 60) * 60,
                'remain': duration * 1000
            }            
        })

    }, [settings.setTime.duration])

    useEffect(() => {
        const endTime = Date.now() + (settings.setTime.duration + 1) * 1000;
        let interval = null

        if (!settings.gameOver) {

            if (
                (settings.level < 4 && settings.level > 0) ||
                (settings.level === 4 && settings.isInGame)
            ) {
                interval = setInterval(function () {
                    let remain = Math.max(endTime - Date.now(), 0)
                    let minute = Math.floor(remain / 60000)
                    let second = Math.floor(remain / 1000) % 60

                    setClock(prevState => {
                        return {
                            ...prevState,
                            remain,
                            minute,
                            second
                        }
                    })

                    if (remain <= 0) {
                        clearInterval(interval);
                        dispatch(runOutOfTime('Time out'))
                        setClock(prevState => {
                            return {
                                ...prevState,
                                'remain': 0,
                            }
                        })
                    }

                }, 1000)
            }

            if (settings.level === 4 && !settings.isInGame){
                let remain = endTime - Date.now()
                let minute = Math.floor(remain / 60000)
                let second = Math.floor(remain / 1000) % 60

                setClock(prevState => {
                    return {
                        ...prevState,
                        remain,
                        minute,
                        second
                    }
                })
            }

            if (settings.level === 0) {
                setClock(prevState => {
                    return {
                        ...prevState,
                        'remain': 0,
                        'minute': 0,
                        'second': 0
                    }
                })
            }
        }

        return () => clearInterval(interval)

    }, [settings.level, settings.isInGame, settings.gameOver])

    return (
        <div className="minesweeper-settings-clock">
            <div className="countdown-clock flex-div">
                <div className="countdown-clock-time">
                    {clock.minute < 10 ? `0${clock.minute}` : clock.minute}
                </div>
                <div className="countdown-clock-spread">:</div>
                <div className="countdown-clock-time">
                    {clock.second < 10 ? `0${clock.second}` : clock.second}
                </div>
            </div>
        </div>
    )
}

export default Clock