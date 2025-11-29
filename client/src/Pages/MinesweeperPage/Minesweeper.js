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
import { isWin } from './Functions';
import { Button } from '@mui/material'
import "../../assets/styles/Minesweeper.css";
import { close, open } from '../../redux/features/modal';
import isMobileDevice from '../../lib/mobile';


function Minesweeper() {

    const minesweeper = useSelector((state) => state.minesweeper)
    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()
    const [timeFinish, setTimeFinish] = useState({})
    const [log, setLog] = useState({
        "message": minesweeper.logError,
        "type": "info"
    })

    function restart() {
        dispatch(close())
        dispatch(resetGame())
    }

    useEffect(() => {
        dispatch(close())
        dispatch(unmounted())
    }, [])

    useEffect(() => {
        if (minesweeper.gameOver) {
            dispatch(open())
        }
    }, [minesweeper])

    return (
        <>
            <Tool />
            <div className="minesweeper">
                {/* Thanh thong tin */}
                <OptionsBar setTimeFinish={setTimeFinish} />
                {minesweeper.gameOver &&
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
                                    ${minesweeper.row},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                                gridTemplateColumns:
                                    `repeat(
                                    ${minesweeper.col},
                                    ${isMobileDevice() ? 3 : 4}rem
                                )`,
                            }
                        }
                    >
                        {
                            minesweeper.cells?.map((cell, index) => {
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
                        message={minesweeper.message}
                        isWin={isWin(minesweeper)}
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
