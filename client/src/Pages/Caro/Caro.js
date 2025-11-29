import { useState, useEffect, useRef, useCallback, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { aiThinking, move, setLine} from '../../redux/features/caro';
import Board from './Board';
import ControlBtn from './ControlBtn'
import Information from './Information'
import Settings from './Settings'
import Logger from '../../Components/Logger/Logger'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import '../../assets/styles/Caro.css'

export const CaroContext = createContext();

export default function Caro() {
    const caro = useSelector((state) => state.caro)
    const dispatch = useDispatch()
    const [log, setLog] = useState({
        type: "info",
        message: ""
    })

    const refWebWorker = useRef(null)
    const refHandleClickCell = useRef(null)
    const refCheckWin = useRef(null)

    const handleCellClick = useCallback((row, col, side) => {
        if (caro.status !== "playing") return
        if (caro.board[row][col] !== 0) return
        if (caro.turn !== side) return
        if (caro.line) return

        const latestBoard = caro.board.map(row => [...row])
        latestBoard[row][col] = side
        dispatch(move(latestBoard))

        const line = checkWin(row, col, side)
        if (line) {
            dispatch(setLine(line))
            setLog(prev => ({
                ...prev,
                "message": `Player ${side === 1 ? "X" : "O"} win`
            }))
            return
        }

        if (caro.turn === caro.player && caro.mode === "AI") {
            refWebWorker.current.postMessage({
                action: "get_best_move",
                data: {
                    init: {
                        size: caro.size,
                        board: latestBoard,
                        ai: caro.player === 1 ? 2 : 1,
                        level: caro.aiDifficulty

                    },
                    currentBoard: latestBoard
                }
            })
        }
    }, [caro, caro.player, dispatch])

    const checkWin = useCallback((row, col, side) => {

        const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
        const condition = caro.size >= 15 ? 5 : 3

        for (const [dx, dy] of directions) {
            let count = 1; // Đã có ô hiện tại
            const line = [{ r: row, c: col }]

            // Kiểm tra chiều thuận
            for (let i = 1; i < condition; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;

                if (newRow < 0 || newRow >= caro.size || newCol < 0 || newCol >= caro.size) break;
                if (caro.board[newRow][newCol] !== side) break;

                count++;
                line.push({ r: newRow, c: newCol })
            }

            // Kiểm tra chiều nghịch
            for (let i = 1; i < condition; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;

                if (newRow < 0 || newRow >= caro.size || newCol < 0 || newCol >= caro.size) break;
                if (caro.board[newRow][newCol] !== side) break;

                count++;
                line.unshift({ r: newRow, c: newCol })
            }

            if (count >= condition) {
                return line;
            }
        }

        return null;
    }, [caro])

    useEffect(() => {
        refHandleClickCell.current = handleCellClick
        refCheckWin.current = checkWin
    }, [handleCellClick, checkWin])

    useEffect(() => {
        refWebWorker.current = new Worker(new URL("./CaroWebWorker.js", import.meta.url))

        refWebWorker.current.onmessage = (event) => {
            const { type, payload } = event.data

            switch (type) {
                case "loading":
                    dispatch(aiThinking(payload))
                    break
                case "get_best_move_success":
                    const { r, c } = payload
                    const side = caro.player === 1 ? 2 : 1
                    refHandleClickCell.current(r, c, side)
                    break
                case "get_best_move_failure":
                    break;
                default:
                    throw new Error("Main thread get best move failure")
            }

        }

        return () => {
            if (refWebWorker.current) {
                refWebWorker.current.terminate()
                refWebWorker.current = null
            }
        }
    }, [dispatch, caro.player])

    return (
        <CaroContext.Provider value={{setLog, refWebWorker, handleCellClick}}>
            <div className="caro-container">
                <div className="caro-card">
                    <div className="caro-header">
                        <h1>{caro.name}</h1>
                    </div>

                    <div className="caro-content">
                        {/* Game Board */}
                        <Board />

                        {/* Side Panel */}
                        <div className="side-panel">
                            <ControlBtn />
                            <Information />

                            {/* Game Settings */}
                            <Settings />
                        </div>
                    </div>
                </div>
                <Logger log={log} setLog={setLog} />
                <GoTopBtn />
            </div>
        </CaroContext.Provider>
    );
};
