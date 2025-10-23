import { useReducer, useEffect, useRef, useMemo, useState } from 'react';
import { defaultState, reducer } from './Reducer';
import { preHandleAction } from './Actions';
import { direction, isMobileDevice, maps } from './Static';
import {
    Button,
    ButtonGroup,
    IconButton,
    Tooltip,
    Slider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Radio,
} from '@mui/material';
import {
    PauseCircle,
    PlayCircle,
    ArrowBack,
    ArrowForward,
    ArrowUpward,
    ArrowDownward,
} from '@mui/icons-material';
import '../../assets/styles/Snake.css';

const Snake = () => {

    const [game, dispatch] = useReducer(reducer, defaultState)
    const [highestScore, setHighestScore] = useState(() => {
        const highest = localStorage.getItem("highest_score_snake_game")

        if (!highest) return 0
        return JSON.parse(highest)
    })
    const refDir = useRef(null)
    const directionQueue = useRef([])

    const cellSize = useMemo(() => {
        if (isMobileDevice()) return 15
        return 20
    })

    const spawnFood = (snake) => {
        let fr, fc, invalid = true
        while (invalid) {
            fr = Math.floor(Math.random() * game.size)
            fc = Math.floor(Math.random() * game.size)
            invalid = snake.some(([r, c]) => r === fr && c === fc)

            if (game.mode === "map") {
                const diff_con = maps[game.map].area.some(([r, c]) => r === fr && c === fc)
                invalid = (invalid || diff_con)
            }
        }

        return [fr, fc]
    }

    const isHead = (snake, r, c) => {
        return snake[0] === r && snake[1] === c
    }

    const isOnSnake = (snake, r, c) => {
        return snake.some(([row, col]) => row === r && col === c)
    }

    const handleStartGame = () => {
        dispatch(preHandleAction.handleListenStatus("playing"))
    }

    const handlePauseGame = () => {
        dispatch(preHandleAction.handleSetPause())
    }

    const handleChangeSize = (e) => {
        const size = Number(e.target.value)
        const line = Math.floor(size / 2)
        const snake = [[line, 4], [line, 3], [line, 2]]
        const food = spawnFood(snake)
        dispatch(preHandleAction.handleSettingSize({ sk: snake, fd: food, size }))
    }

    const handleChangeSpeed = (e) => {
        dispatch(preHandleAction.handleSetSpeed(Number(e.target.value)))
    }

    const handleSetDirection = (next) => {
        const current = refDir.current

        if (!next) return

        if (
            (current === "RIGHT" && next === "LEFT") ||
            (current === "LEFT" && next === "RIGHT") ||
            (current === "DOWN" && next === "UP") ||
            (current === "UP" && next === "DOWN")
        ) return

        if (directionQueue.current.length < 1) {
            directionQueue.current.push(next);
        }
    }

    const handleSetMode = (e) => {
        dispatch(preHandleAction.handleSettingMode(e.target.value))
    }

    const handleSetMap = (e) => {
        dispatch(preHandleAction.handleSelectMap(Number(e.target.value)))
    }

    const newGame = () => {
        if (game.mode !== "map") {
            const line = Math.floor(game.size / 2)
            const snake = [[line, 4], [line, 3], [line, 2]]
            const food = spawnFood(snake)

            dispatch(preHandleAction.handleSetNewGame({ snake, food, direction: "RIGHT" }))
        } else {
            const { snake, food, direction } = maps[game.map]
            dispatch(preHandleAction.handleSetNewGame({ snake, food, direction }))
        }
    }

    useEffect(() => { refDir.current = game.direction }, [game.direction])

    useEffect(() => {
        if (game.status !== "playing") return

        const control = (e) => {
            e.preventDefault()

            if (e.key === ' ') {
                dispatch(preHandleAction.handleSetPause())
            } else {
                const dir = e.key.toUpperCase()
                const next = direction[dir]

                if (!next) return

                handleSetDirection(next)

            }
        }

        window.addEventListener("keydown", control)

        return () => window.removeEventListener("keydown", control)

    }, [game.status, dispatch])


    useEffect(() => {
        if (game.status !== "playing" || game.pause) return
        const loop = setInterval(() => {
            let snake = game.snake.map(part => ([...part]))
            const head = snake[0]
            let [hr, hc] = head

            if (directionQueue.current.length > 0) {
                const nextDirection = directionQueue.current.shift();
                dispatch(preHandleAction.handleChangeDirect(nextDirection));
                refDir.current = nextDirection;
            }

            const currentDirection = refDir.current;

            if (currentDirection === "RIGHT") { hc += 1 }
            else if (currentDirection === "LEFT") { hc -= 1 }
            else if (currentDirection === "UP") { hr -= 1 }
            else if (currentDirection === "DOWN") { hr += 1 }

            if (game.mode === "limit") {
                if (hr < 0 || hr >= game.size || hc < 0 || hc >= game.size) {
                    dispatch(preHandleAction.handleListenStatus("game_over"))
                    return
                }
            }

            hr = hr >= 0 ? hr % game.size : (hr + game.size)
            hc = hc >= 0 ? hc % game.size : (hc + game.size)

            if (game.mode === "map") {
                if (maps[game.map].area.some(([row, col]) => row === hr && col === hc)) {
                    dispatch(preHandleAction.handleListenStatus("game_over"))
                    return
                }
            }

            if (snake.some(([r, c]) => r === hr && c === hc)) {
                dispatch(preHandleAction.handleListenStatus("game_over"))
                return
            }

            const newHead = [hr, hc]
            snake = [newHead, ...snake]


            const ateFood = (game.food[0] === hr && game.food[1] === hc)

            if (!ateFood) {
                snake.pop()
            } else {
                const expectScore = game.score + 10
                dispatch(preHandleAction.handleSnakeAte(10))

                if ((expectScore % 200) === 0 && game.speed > 70) {
                    dispatch(preHandleAction.handleSetSpeed(game.speed - 10))
                }

                const food = spawnFood(snake)
                dispatch(preHandleAction.handleSpawnFood(food))
            }

            dispatch(preHandleAction.handleSnakeState(snake))

        }, 370 - game.speed)

        return () => clearInterval(loop)

    }, [game.status, game.food, game.pause, game.score, game.snake, game.mode])

    useEffect(() => {
       if (game.status === "game_over") {
        const highest = localStorage.getItem("highest_score_snake_game")
        if (!highest) {
            localStorage.setItem("highest_score_snake_game", JSON.stringify(game.score))
            setHighestScore(game.score)
        } else {
            const max = JSON.parse(highest)
            if (max >= game.score) return

            localStorage.setItem("highest_score_snake_game", JSON.stringify(game.score))
            setHighestScore(game.score)
        }
       } 
    }, [game.status, game.score])

    return (
        <div className="snake-game">
            <div className="game-container">
                <div className="game-layout">
                    <div className="game-board">
                        <div className="board-card">
                            <div className="stats-container">
                                <div className="stats-group">
                                    <div className="stat score">
                                        Score: {game.score}
                                    </div>
                                    <div className="stat highscore">
                                        Highest score: {highestScore}
                                    </div>
                                </div>

                                <div className="action-buttons">
                                    {game.status === "playing" && <Tooltip title={`${!game.pause ? "Pause" : "Play"}`}>
                                        <IconButton size="small" onClick={() => { handlePauseGame() }}>
                                            {!game.pause ? <PauseCircle fontSize="large" /> :
                                                <PlayCircle fontSize="large" />}
                                        </IconButton>
                                    </Tooltip>}
                                    <Button
                                        variant="contained"
                                        onClick={() => { handleStartGame() }}
                                        className="btn reset"
                                        disabled={game.status !== "waiting"}
                                    >
                                        Play
                                    </Button>
                                </div>
                            </div>

                            {/* Board */}
                            <div className="board-wrapper">
                                <div
                                    className="snake-board"
                                    style={{
                                        gridTemplateColumns: `repeat(${game.size}, ${cellSize}px)`,
                                        gridTemplateRows: `repeat(${game.size}, ${cellSize}px)`,
                                        width: `fit-content`,
                                        border: `${game.mode === "limit" ? ".2rem solid" : "none"}`
                                    }}
                                    aria-label="Bàn chơi rắn săn mồi"
                                >
                                    {Array.from({ length: game.size }).map((_, r) =>
                                        Array.from({ length: game.size }).map((_, c) => {
                                            const head = isHead(game.snake[0], r, c);
                                            const onSnake = isOnSnake(game.snake, r, c);
                                            const onFood = (game.food[0] === r && game.food[1] === c);
                                            const isFence = (game.map !== null ? maps[game.map].area : []).some(([row, col]) => row === r && col === c)
                                            const cellClass = `cell ${onFood ? 'food' : head ?
                                                `head ${game.direction.toLowerCase()}` : onSnake ?
                                                    'body' : isFence ? "fence" : ""}`;

                                            return (
                                                <div
                                                    key={`${r}-${c}`}
                                                    className={cellClass}
                                                    role="presentation"
                                                    title={onFood ? 'Food' : ''}
                                                >
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                                {isMobileDevice() && <ButtonGroup variant='outlined' aria-label="button control" className="btn-group">
                                    <Button
                                        size="small"
                                        startIcon={<ArrowBack />}
                                        onClick={() => { handleSetDirection("LEFT") }}
                                    >Left</Button>
                                    <Button
                                        size="small"
                                        endIcon={<ArrowForward />}
                                        onClick={() => { handleSetDirection("RIGHT") }}
                                    >Right</Button>
                                    <Button size="small" endIcon={
                                        !game.pause ? <PauseCircle /> : <PlayCircle />
                                    }
                                        onClick={() => { handlePauseGame() }}
                                    >
                                        {!game.pause ? "Pause" : "Play"}
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<ArrowUpward />}
                                        onClick={() => { handleSetDirection("UP") }}
                                    >Up</Button>▐
                                    <Button
                                        size="small"
                                        endIcon={<ArrowDownward />}
                                        onClick={() => { handleSetDirection("DOWN") }}
                                    >Down</Button>▐
                                </ButtonGroup>}
                            </div>
                        </div>
                    </div>

                    {/* Side panel */}
                    <div className="side-panel">
                        <div className="settings-panel">
                            <div className="panel-title">Setting</div>
                            <div className="settings-content">
                                <div className="setting-group">
                                    <FormControl fullWidth>
                                        <InputLabel id="select-mode">Mode</InputLabel>
                                        <Select
                                            labelId="select-mode"
                                            id="modes"
                                            value={game.mode}
                                            label="Mode"
                                            onChange={handleSetMode}
                                            disabled={game.status === "playing"}
                                        >
                                            <MenuItem value={"no_limit"}>No border</MenuItem>
                                            <MenuItem value={"limit"}>Border</MenuItem>
                                            <MenuItem value={"map"}>Map</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                {game.mode === "map" &&
                                    <FormControl>
                                        <FormLabel id="type-of-map">Select map</FormLabel>
                                        <RadioGroup
                                            aria-labelledby="type-of-map"
                                            defaultValue={0}
                                            name="radio-buttons-group"
                                            onChange={handleSetMap}
                                        >
                                            {maps.map(({ name }, index) => {
                                                return <FormControlLabel value={index} control={<Radio />} label={name} />
                                            })}

                                        </RadioGroup>
                                    </FormControl>
                                }

                                {game.mode !== "map" &&
                                    <div className="setting-group">
                                        <label>Size</label>
                                        <Slider
                                            size='small'
                                            min={10}
                                            max={24}
                                            value={game.size}
                                            valueLabelDisplay='auto'
                                            onChange={handleChangeSize}
                                            disabled={game.status === "playing"}
                                        />
                                        <div className="setting-value">Current size: {game.size}</div>
                                    </div>}
                                <div className="setting-group">
                                    <label>Speed (ms/tick)</label>
                                    <Slider
                                        size='small'
                                        min={70}
                                        max={300}
                                        step={10}
                                        marks
                                        value={game.speed}
                                        onChange={handleChangeSpeed}
                                        disabled={game.status === "playing"}
                                    />
                                    <div className="setting-value">Current speed: {370 - game.speed} ms</div>
                                </div>
                                <Button
                                    variant='contained'
                                    onClick={() => { newGame() }}
                                    className="reset"
                                    disabled={game.status !== "game_over"}
                                >
                                    New game
                                </Button>
                            </div>
                        </div>
                        <div className="instruction-general">
                            <div className="title">Quick instruction</div>
                            <p className="overall"><strong>Note:</strong> Each 200 point, speed will be automatically decrease</p>
                            <div className="instruction-block">
                                <h2 className="title">For PC</h2>
                                <div className="control-key">
                                    <div className="keys">
                                        <kbd className="kdb">W</kbd>
                                        <p>or</p>
                                        <kbd className="kdb">ARROW UP</kbd>
                                    </div>
                                    <p className="control">Turn up</p>
                                </div>
                                <div className="control-key">
                                    <div className="keys">
                                        <kbd className="kdb">A</kbd>
                                        <p>or</p>
                                        <kbd className="kdb">ARROW LEFT</kbd>
                                    </div>
                                    <p className="control">Turn left</p>
                                </div>
                                <div className="control-key">
                                    <div className="keys">
                                        <kbd className="kdb">S</kbd>
                                        <p>or</p>
                                        <kbd className="kdb">ARROW DOWN</kbd>
                                    </div>
                                    <p className="control">Turn down</p>
                                </div>
                                <div className="control-key">
                                    <div className="keys">
                                        <kbd className="kdb">D</kbd>
                                        <p>or</p>
                                        <kbd className="kdb">ARROW RIGHT</kbd>
                                    </div>
                                    <p className="control">Turn right</p>
                                </div>
                            </div>
                            <div className="instruction-block">
                                <h2 className="title">For mobile</h2>
                                <p className="description">
                                    If you use mobile phone, you can see some buttons under board snake. Let click on them to control snake
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Snake;