import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from "react-router"
import { open, close } from '../../redux/features/modal'
import {
    start,
    selectSquare,
    fillSquare,
    newGame,
    selectVariant,
    loading,
    unmountSquare,
    setGameOver
} from '../../redux/features/sudoku'
import {
    Icon,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from '@mui/material'
import ClockBase from '../../Components/ClockBase/ClockBase';
import Clock from './Clock'
import Logger from '../../Components/Logger/Logger'
import Modal from '../../Components/Modal/Modal'
import SudokuModal from './SudokuModal'
import SUDOKU_VARIANTS from './Variant'
import '../../assets/styles/Sudoku.css';

function Sudoku() {
    const sudoku = useSelector((state) => state.sudoku)
    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()

    const [size, setSize] = useState(9)
    const [difficulty, setDifficulty] = useState(1)
    const [timeFinish, setTimeFinish] = useState({})
    const [log, setLog] = useState({
        message: "",
        type: "info"
    })

    const refStaticSize = useRef(9)
    const refWebWorker = useRef(null)


    const handleSizeChange = (e) => {
        setSize(e.target.value)
        setDifficulty(1)

        if (sudoku.status !== "playing") {
            refStaticSize.current = e.target.value
        }
    }

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value)
    }

    const handleCellClick = (row, col) => {
        if (sudoku.status !== "playing") {
            setLog({
                message: "You are not ready game yet. Let click on button at top-right corner!",
                type: "info"
            })
            return
        }
        if (sudoku.gameOver) return

        if (
            sudoku.puzzle[row][col] === 0 ||
            sudoku.errors.square.has(`${row}-${col}`)
        ) {
            dispatch(selectSquare({ row, col }))
        }
    };

    const handleNumberInput = (num) => {
        const {
            status,
            gameOver,
            squareActivating,
            puzzle,
            answers,
            errors
        } = sudoku

        if (status !== "playing") return
        if (gameOver) return

        if (!squareActivating) return;

        const { row, col } = squareActivating;
        const updatedPuzzle = puzzle.map(r => [...r]);
        updatedPuzzle[row][col] = num;

        const result = answers.filter(({ square }) => {
            const [r, c] = square
            return row === r && col === c
        })[0]["correct-value"] === num

        if (!result && num !== 0) {
            const times = errors.times + 1
            const square = new Set([...errors.square]).add(`${row}-${col}`)
            dispatch(fillSquare({
                answers: answers,
                puzzle: updatedPuzzle,
                errors: {
                    times,
                    square
                }
            }))

            if (errors.times === 2) {
                dispatch(setGameOver({
                    gameOver: true,
                    isWin: false
                }))
                dispatch(open())
            }
        } else {
            let updatedAnswers = answers
            if (num !== 0) {
                updatedAnswers = answers.filter(({ square }) => {
                    const [r, c] = square
                    return row !== r || col !== c
                })
            }

            const times = errors.times
            const square = new Set([...errors.square])
            square.delete(`${row}-${col}`)
            dispatch(fillSquare({
                puzzle: updatedPuzzle,
                answers: updatedAnswers,
                errors: {
                    times,
                    square
                }
            }))
            dispatch(unmountSquare())

            if (updatedAnswers.length === 0) {
                dispatch(setGameOver({
                    gameOver: true,
                    isWin: true
                }))
                dispatch(open())
            }
        }
    };

    const resetOrStartGame = () => {
        if (sudoku.status === "playing") {
            refWebWorker.current.postMessage({
                size,
                difficulty: SUDOKU_VARIANTS[size].difficulties[difficulty].cellsToRemove,
                action: "generate_puzzle"
            })
            refStaticSize.current = size
        } else {
            dispatch(start())
        }
    };

    const cancelGeneratePuzzle = () => {
        if (refWebWorker.current) {
            refWebWorker.current.terminate()
            refWebWorker.current = null
        }
    }

    const getCellClass = (row, col) => {
        const { puzzle, squareActivating, errors } = sudoku
        let baseClass = "cell-base ";

        // Màu nền cho ô ban đầu
        if (puzzle[row][col] !== 0) {
            baseClass += "cell-base__number ";
        } else {
            baseClass += "cell-base__empty ";
        }

        if (refStaticSize.current === 16) {
            baseClass += "cell-base__small-text "
        }

        // Ô được chọn
        if (squareActivating &&
            squareActivating?.row === row &&
            squareActivating?.col === col) {
            baseClass += "cell-active ";
        }

        // Ô có lỗi
        if (new Set([...errors.square]).has(`${row}-${col}`)) {
            baseClass += "cell-error ";
        }

        // Đường viền đậm cho các ô 3x3
        if (row % Math.sqrt(refStaticSize.current) === 0 && row)
            baseClass += "row-border ";
        if (col % Math.sqrt(refStaticSize.current) === 0 && col)
            baseClass += "col-border ";

        return baseClass;
    };

    useEffect(() => {
        dispatch(close())
        refWebWorker.current = new Worker(new URL("./SudokuWebWorker.js", import.meta.url))

        refWebWorker.current.onmessage = (event) => {
            const { type, payload } = event.data

            switch (type) {
                case "loading":
                    dispatch(loading(payload))
                    break
                case "generate_success":
                    dispatch(newGame({
                        puzzle: payload.puzzle,
                        answers: payload.answers
                    }))

                    break
                case "error":
                    break

                default:
                    throw new Error("web worker on invalid message")
            }

        }

        return () => {
            cancelGeneratePuzzle()
        }

    }, [])

    useEffect(() => {
        dispatch(selectVariant({
            size,
            difficulty: SUDOKU_VARIANTS[size].difficulties[difficulty].cellsToRemove
        }))

        if (size === 16) {
            setLog({
                message: "16x16 puzzles can be take a lot of time to generate. Are you sure when choose this?",
                type: "warning"
            })
        }

        if (sudoku.status !== "playing") {
            refWebWorker.current.postMessage({
                size,
                difficulty: SUDOKU_VARIANTS[size].difficulties[difficulty].cellsToRemove,
                action: "generate_puzzle"
            })
        }
    }, [size, difficulty, sudoku.status])

    return (
        <div className="sudoku-container">
            {modal.value &&
                <Modal>
                    <SudokuModal
                        isWin={sudoku.isWin}
                        errors={sudoku.errors.times}
                        timeFinish={timeFinish}
                        resetOrStartGame={resetOrStartGame}
                    />
                </Modal>
            }
            <div className="sudoku-card-left">
                {/* Header */}
                <div className="sudoku-header">
                    <h1>Sudoku</h1>
                </div>

                {/* Game Stats */}
                <div className="game-stats">
                    <ClockBase
                        type={"count"}
                        duration={0}
                        semaphore={sudoku.semaphore}
                        setTimeFinish={setTimeFinish}
                    >
                        <Clock />
                    </ClockBase>
                    <div className="stat-item">
                        <div className="stat-value errors">
                            {sudoku.errors.times} / 3
                        </div>
                        <div className="stat-label">Error</div>
                    </div>
                    <button
                        onClick={resetOrStartGame}
                        className="reset-button"
                        disabled={sudoku.loading}
                    >
                        {`${sudoku.status === "waiting" ? "Start" : "New game"}`}
                    </button>
                </div>


                {sudoku.loading &&
                    <div className="sudoku-loading flex-div">
                        <CircularProgress sx={{ color: "var(--brand-500)" }} />
                        <span className="sudoku-loading__description">Generating puzzle ...</span>
                        <div className="sudoku-loading__info flex-div">
                            <Icon
                                sx={{ color: "var(--cl-primary-yellow)" }}
                            >warning</Icon>
                            <p>16x16 puzzles can take a while to generate</p>
                        </div>
                    </div>}
                {!sudoku.loading && <div
                    className="sudoku-board"
                    style={{
                        "gridTemplateColumns": `repeat(${refStaticSize.current}, minmax(${refStaticSize.current < 16 ? 3.6 : 2.2
                            }rem, 1fr))`
                    }}
                >
                    {sudoku.puzzle.map((rows, rowIndex) =>
                        rows.map((cell, colIndex) => (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={getCellClass(rowIndex, colIndex)}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                            >
                                {cell !== 0 ? cell : ''}
                            </div>
                        ))
                    )}
                </div>}

                <div className="number-input">
                    {Array.from({ length: refStaticSize.current }, () => 0).map((_, index) => {
                        const num = refStaticSize.current - (refStaticSize.current - index - 1)

                        return (<button
                            key={num}
                            onClick={() => handleNumberInput(num)}
                            disabled={!sudoku.squareActivating}
                            className="number-button"
                        >
                            {num}
                        </button>)
                    })}
                    <button
                        onClick={() => handleNumberInput(0)}
                        disabled={!sudoku.squareActivating}
                        className="clear-button"
                        style={{
                            "gridColumn": `${refStaticSize.current === 16 ? "2 / span 4" : "5 / span 1"
                                }`
                        }}
                    >
                        ✕
                    </button>
                </div>
            </div>
            <div className="sudoku-card-right">
                {sudoku.loading && <Link className="back-home" to="/">Don't wait until generate successfully. Go home!</Link>}
                <div className="sudoku-settings">
                    <div className="sudoku-header">
                        <h1>Settings</h1>
                    </div>

                    <FormControl fullWidth>
                        <InputLabel
                            className="select-label"
                            id="select-size"
                        >Size</InputLabel>
                        <Select
                            className="select-settings flex-div"
                            labelId="select-side"
                            label="Size"
                            value={size}
                            onChange={handleSizeChange}
                        >
                            <MenuItem sx={{
                                fontSize: "1.3rem"
                            }} value={4}>4 x 4</MenuItem>
                            <MenuItem sx={{
                                fontSize: "1.3rem"
                            }} value={9}>9 x 9</MenuItem>
                            <MenuItem sx={{
                                fontSize: "1.3rem"
                            }} value={16}>16 x 16</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel
                            className="select-label"
                            id="select-difficulty"
                        >Difficulty</InputLabel>
                        <Select
                            className="select-settings flex-div"
                            labelId="select-difficulty"
                            label="Difficulty"
                            value={difficulty}
                            onChange={handleDifficultyChange}
                        >
                            {
                                Object.values(SUDOKU_VARIANTS[size].difficulties).map(({
                                    name
                                }, index) => {
                                    return (
                                        <MenuItem
                                            key={index}
                                            sx={{
                                                fontSize: "1.3rem",
                                                justifyContent: "space-between"
                                            }}
                                            value={index + 1}
                                            className="flex-div"
                                        >
                                            <p>{name}</p>
                                            {(size === 16 && [1, 2].includes(index)) &&
                                                <div
                                                    className="flex-div"
                                                    style={{ gap: ".5rem" }}
                                                >
                                                    <Icon
                                                        sx={{ color: "var(--cl-red-flag)" }}
                                                    >warning</Icon>
                                                    <p
                                                        style={{
                                                            fontSize: "1rem",
                                                            color: "var(--ink-500)"
                                                        }}
                                                    >Generating take too many time</p>
                                                </div>}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="sudoku-detail">
                    <div className="sudoku-header">
                        <h1>Details</h1>
                    </div>
                    <div className="sudoku-detail-containers">
                        <div className="sudoku-detail-name">
                            Variant name
                        </div>
                        <div className="sudoku-detail-value">
                            {SUDOKU_VARIANTS[size].name}
                        </div>
                    </div>
                    <div className="sudoku-detail-containers">
                        <div className="sudoku-detail-name">
                            Region size
                        </div>
                        <div className="sudoku-detail-value">
                            {refStaticSize.current}
                        </div>
                    </div>
                    <div className="sudoku-detail-containers">
                        <div className="sudoku-detail-name">
                            Difficulty
                        </div>
                        <div className={`sudoku-detail-value difficulty-${difficulty}`}>
                            {SUDOKU_VARIANTS[size].difficulties[difficulty].name}
                        </div>
                    </div>
                    <div className="sudoku-detail-containers">
                        <div className="sudoku-detail-name">
                            The number of cells need open
                        </div>
                        <div className="sudoku-detail-value">
                            {sudoku.answers.length}
                        </div>
                    </div>
                    <div className="sudoku-detail-containers">
                        <div className="sudoku-detail-name">
                            Description
                        </div>
                        <div className="sudoku-detail-value">
                            {SUDOKU_VARIANTS[size].difficulties[difficulty].description}
                        </div>
                    </div>
                </div>
            </div >
            <Logger log={log} setLog={setLog} />
        </div>
    );
}

export default Sudoku