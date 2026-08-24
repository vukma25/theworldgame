import { useEffect, useState, useCallback } from 'react'
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
import { BarChart } from '@mui/x-charts/BarChart'
import "../../assets/styles/Minesweeper.css";
import { close, open } from '../../redux/features/modal';
import isMobileDevice from '../../lib/mobile';
import api from '../../lib/api';

const chartSetting = {
    yAxis: [
        {
            label: 'Tồng số trận',
            width: 60,
        },
    ],
    height: 300,
};

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
    const [dataset, setDataset] = useState([])

    function restart() {
        dispatch(close())
        dispatch(resetGame())
        setTimeFinish(null)
    }

    function convertFormatDataset(dataset) {
        const obj = {}
        for (const data of dataset) {
            const { difficulty, status } = data
            if (!obj[difficulty]) { obj[difficulty] = {} }

            obj[difficulty][status] = (obj[difficulty][status] ?? 0) + 1
        }

        return Object.entries(obj).map(([key, value]) => {
            return { "difficulty": key, ...value }
        })
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

    function valueFormatter(value) {
        return `${(value ?? 0)} trận`;
    }

    useEffect(() => {
        async function getStatistics() {
            try {
                const res = await api.get("/game/minesweeper/statistic", { withCredentials: true })
                const data = res.data
                setDataset((data?.listResults || []))
            } catch (err) {
                console.error(err)
            }
        }
        getStatistics()
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
            <BarChart
                dataset={convertFormatDataset(dataset)}
                xAxis={[{ dataKey: "difficulty" }]}
                series={[
                    { dataKey: 'win', label: 'Win', valueFormatter },
                    { dataKey: 'lose', label: 'Lose', valueFormatter },
                ]}
                {...chartSetting}
            />
            <Logger log={log} setLog={setLog} />
            <GoTopBtn />
        </>
    )
}

export default Minesweeper
