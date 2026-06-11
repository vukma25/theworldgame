import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { resetGame, unmounted } from '../../redux/features/minesweeper';
import OptionsBar from './OptionBar';
import SettingsBroad from './SettingsBroad';
import Modal from '../../Components/Modal/Modal'
import MinesweeperModal from './MinesweeperModal';
import Cell from './Cell';
import Tool from './Tool';
import Logger from '../../Components/Logger/Logger'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn';
import { isWin, difficulties, levels } from './Functions';
import { Button } from '@mui/material'
import "../../assets/styles/Minesweeper.css";
import { close, open } from '../../redux/features/modal';
import isMobileDevice from '../../lib/mobile';
import api from '../../lib/api';

function Minesweeper() {

    const {
        level, logError, gameOver, cells, row,
        col, message, mine, setTime,
    } = useSelector((state) => state.minesweeper)
    const modal = useSelector((state) => state.modal)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [timeFinish, setTimeFinish] = useState(null)
    const [log, setLog] = useState({
        "message": logError,
        "type": "info"
    })

    function restart() {
        dispatch(close())
        dispatch(resetGame())
        setTimeFinish(null)
    }

    async function updateLeaderboard(difficulty, status, time) {
        try {
            await api.post('/leaderboard/minesweeper/update', {
                difficulty, status, time
            }, { withCredentials: true })
        } catch {
            throw new Error("Update leaderboard fail")
        }
    }

    async function saveGameHistory(difficulty, status, time) {
        try {
            await api.post('/game/minesweeper/save', {
                difficulty, status, time
            }, { withCredentials: true })
        } catch {
            throw new Error("Save the game fail")
        }
    }

    useEffect(() => {
        dispatch(close())
        dispatch(unmounted())
    }, [])

    useEffect(() => {
        try {
            if (level === 4 || level === 0) return
            if (gameOver && timeFinish) {
                const time = levels[level].setTime.duration - Math.floor(timeFinish.remain / 1000)
                dispatch(open())
                if (user) {
                    const w = isWin(cells, mine)
                    const status = w ? "win" : "lose"
                    if (w) {
                        // cập nhạt leaderboard
                        updateLeaderboard(difficulties[level], status, time)
                    }

                    // lưu lịch sử chơi
                    saveGameHistory(difficulties[level], status, time)
                }
            }
        } catch (error) {
            setLog({ message: "Let sign up and sign in to save your result", type: "info" })
        }
    }, [gameOver, cells, mine, level, timeFinish, user])

    return (
        <>
            <Tool />
            <div className="minesweeper">
                {/* Thanh thong tin */}
                <OptionsBar setTimeFinish={setTimeFinish} />
                {gameOver &&
                    <Button
                        className="restart-btn"
                        onClick={restart}
                    >Restart</Button>
                }
                <div className="minesweeper-broad">
                    {/* Bang cau hinh game */}
                    <SettingsBroad />


                    {/* Bang game chinh */}
                    <div
                        className="game-broad"
                        style={
                            {
                                display: 'grid',
                                gridTemplateRows:
                                    `repeat(
                                    ${row},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                                gridTemplateColumns:
                                    `repeat(
                                    ${col},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                            }
                        }
                    >
                        {
                            cells?.map((cell, index) => {
                                return <Cell
                                    key={index}
                                    mine={cell.mine}
                                    index={index}
                                    setLog={setLog}
                                />
                            })
                        }
                    </div>
                </div>
            </div>
            {
                modal.value &&
                <Modal>
                    <MinesweeperModal
                        timeFinish={timeFinish}
                        message={message}
                        isWin={isWin(cells, mine)}
                        restart={restart}
                    />
                </Modal>
            }
            <Logger log={log} setLog={setLog} />
            <GoTopBtn />
        </>
    )
}

export default Minesweeper
