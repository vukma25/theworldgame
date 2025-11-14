import { useEffect, useRef, useState, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    changeDirection, setPause, setSnake, 
    setSpeed, setStatus, snakeAte, spawnFood 
} from "../../redux/features/snake"
import { direction, maps } from './Static';
import Board from "./Board/Board"
import StatPanel from "./StatPanel"
import Settings from "./Settings"
import Instruction from './Instruction'
import '../../assets/styles/Snake.css';

export const SnakeContext = createContext()

const Snake = () => {

    const snake = useSelector((state) => state.snake)
    const dispatch = useDispatch()
    const [highestScore, setHighestScore] = useState(() => {
        const highest = localStorage.getItem("highest_score_snake_game")

        if (!highest) return 0
        return JSON.parse(highest)
    })
    const refDir = useRef(null)
    const directionQueue = useRef([])

    const spFood = (sn, type = "normal") => {
        let fr, fc, invalid = true
        while (invalid) {
            fr = Math.floor(Math.random() * snake.size)
            fc = Math.floor(Math.random() * snake.size)
            invalid = sn.some(([r, c]) => r === fr && c === fc)

            if (snake.mode === "map") {
                const diff_con = maps[snake.map].area.some(([r, c]) => r === fr && c === fc)
                invalid = (invalid || diff_con)
            }
        }

        return { type, fd: [fr, fc] }
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

    const handlePauseGame = () => {
        dispatch(setPause())
    }

    useEffect(() => { refDir.current = snake.direction }, [snake.direction])

    useEffect(() => {
        if (snake.status !== "playing") return

        const control = (e) => {
            e.preventDefault()

            if (e.key === ' ') {
                dispatch(setPause())
            } else {
                const dir = e.key.toUpperCase()
                const next = direction[dir]

                if (!next) return

                handleSetDirection(next)
            }
        }

        window.addEventListener("keydown", control)

        return () => window.removeEventListener("keydown", control)

    }, [snake.status, dispatch])


    useEffect(() => {
        if (snake.status !== "playing" || snake.pause) return
        const loop = setInterval(() => {
            let sn = snake.snake.map(part => ([...part]))
            const head = sn[0]
            let [hr, hc] = head

            if (directionQueue.current.length > 0) {
                const nextDirection = directionQueue.current.shift();
                dispatch(changeDirection(nextDirection));
                refDir.current = nextDirection;
            }

            const currentDirection = refDir.current;

            if (currentDirection === "RIGHT") { hc += 1 }
            else if (currentDirection === "LEFT") { hc -= 1 }
            else if (currentDirection === "UP") { hr -= 1 }
            else if (currentDirection === "DOWN") { hr += 1 }

            if (snake.mode === "limit") {
                if (hr < 0 || hr >= snake.size || hc < 0 || hc >= snake.size) {
                    dispatch(setStatus("game_over"))
                    return
                }
            }

            hr = hr >= 0 ? hr % snake.size : (hr + snake.size)
            hc = hc >= 0 ? hc % snake.size : (hc + snake.size)

            if (snake.mode === "map") {
                if (maps[snake.map].area.some(([row, col]) => row === hr && col === hc)) {
                    dispatch(setStatus("game_over"))
                    return
                }
            }

            if (sn.some(([r, c]) => r === hr && c === hc)) {
                dispatch(setStatus("game_over"))
                return
            }

            const newHead = [hr, hc]
            sn = [newHead, ...sn]


            const ateFood = (snake.food.fd[0] === hr && snake.food.fd[1] === hc)

            if (!ateFood) {
                sn.pop()
            } else {
                const { type } = snake.food
                if (type === "normal") {
                    const expectScore = snake.score + 10
                    let food = spFood(sn)

                    dispatch(snakeAte({ type, score: 10 }))
                    if ((expectScore % 200) === 0) {
                        if (snake.speed < 300) { dispatch(setSpeed(snake.speed + 10)) }
                        food.type = "extra"
                    }

                    dispatch(spawnFood(food))
                }
                else {
                    const food = spFood(sn)
                    dispatch(snakeAte({ type, score: 200 }))
                    dispatch(spawnFood(food))
                }
            }

            dispatch(setSnake(sn))

        }, 370 - snake.speed)

        return () => clearInterval(loop)

    }, [snake.status, snake.food, snake.pause, snake.score, snake.snake, snake.mode])

    useEffect(() => {
        if (snake.status === "game_over") {
            const highest = localStorage.getItem("highest_score_snake_game")
            const currentScore = snake.score + snake.extraScore
            if (!highest) {
                localStorage.setItem("highest_score_snake_game", JSON.stringify(currentScore))
                setHighestScore(currentScore)
            } else {
                const max = JSON.parse(highest)
                if (max >= currentScore) return

                localStorage.setItem("highest_score_snake_game", JSON.stringify(currentScore))
                setHighestScore(currentScore)
            }
        }
    }, [snake.status, snake.score, snake.extraScore])

    return (
        <SnakeContext.Provider value={{highestScore, handleSetDirection, handlePauseGame, spFood }}>
            <div className="snake-game">
                <div className="game-container">
                    <div className="game-layout">
                        <div className="game-board">
                            <div className="board-card">
                                <StatPanel />
                                <Board />
                            </div>
                        </div>
                        {/* Side panel */}
                        <div className="side-panel">
                            <Settings />
                            <Instruction />
                        </div>
                    </div>
                </div>
            </div>
        </SnakeContext.Provider>
    );
};

export default Snake;