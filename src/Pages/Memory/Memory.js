import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material'
import { 
    setCard,
    matchCard,
    time,
    status,
    rows,
    columns,
    setDuration,
    reset,
    first,
    busy,
    setSemaphore
} from '../../redux/features/memory';
import { close, open } from '../../redux/features/modal';
import { EMOJI_POOL, shuffle } from './Function';
import Modal from '../../Components/Modal/Modal'
import MemoryModal from './memoryModal';
import ClockBase from '../../Components/ClockBase/ClockBase'
import Clock from './Clock'
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    Slider
} from '@mui/material'
import '../../assets/styles/Memory.css'

const Memory = () => {
    const memory = useSelector((state) => state.memory)
    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()
    const [timeFinish, setTimeFinish] = useState(null)

    const gridStyle = {
        gridTemplateColumns: `repeat(${Math.max(memory.cols, memory.rows)}, minmax(0, 1fr))`
    }

    const initGame = () => {
        const pairs = memory.pairs
        const cards = Array.from({ length: pairs * 2 }, () => 0).map((v, i) => {
            return {
                id: `card-${i}`,
                value: v,
                matched: false,
                flipped: false
            }
        })
        dispatch(reset(cards))
    }

    const handleChangeCol = (e) => {
        dispatch(columns(Number(e.target.value)))
    }

    const handleChangeRow = (e) => {
        dispatch(rows(Number(e.target.value)))
    }

    const handleChangeDuration = (e, value) => {
        dispatch(setDuration(value))
    }

    const handleUseTime = (e) => {
       dispatch(time(e.target.checked))
    }

    const handleFlipCard = (id, value, isOpen) => {
        if (isOpen) return
        if (memory.isBusy || memory.status !== "playing") return

        let cards = memory.cards.map((card) => {
            if (card.id === id) {
                return {
                    ...card,
                    flipped: true
                }
            }
            return { ...card }
        })

        dispatch(setCard(cards))

        if (!memory.firstClick) {
            dispatch(first({ id, value }))
            return
        }

        dispatch(busy(true))
        let moves = memory.moves + 1
        let matches = memory.matches

        if (memory.firstClick.value === value) {
            matches += 1
            cards = cards.map((card) => {
                if ([id, memory.firstClick.id].includes(card.id)) {
                    return {
                        ...card,
                        matched: true
                    }
                }
                return { ...card }
            })
        } else {
            cards = cards.map((card) => {
                if ([id, memory.firstClick.id].includes(card.id)) {
                    return {
                        ...card,
                        flipped: false
                    }
                }
                return { ...card }
            })
        }

        setTimeout(function () {
            dispatch(first(null))
            dispatch(busy(false))
            dispatch(matchCard({ moves, matches, cards }))
        }, 700)
    }

    const startGame = () => {
        const chosen = shuffle(EMOJI_POOL).slice(0, memory.pairs)
        const value = shuffle([...chosen, ...chosen])
        const cards = memory.cards.map((card, i) => {
            return {
                ...card,
                value: value[i]
            }
        })

        dispatch(setCard(cards))
        dispatch(status("playing"))

        if (memory.useTime) {
            dispatch(setSemaphore(false))
        }
    }

    const resetGame = () => initGame()

    useEffect(() => {
        initGame()
    }, [memory.rows, memory.cols])
    
    useEffect(() => {
        initGame()
    }, [])

    useEffect(() => {
        if (timeFinish?.remain <= 0) {
            dispatch(status("time_out"))
            dispatch(setSemaphore(true))
        }
    }, [timeFinish])

    useEffect(() => {
        dispatch(close())
    }, [])

    useEffect(() => {
        if (memory.matches === memory.pairs && memory.status !== "winning") {
            dispatch(status("winning"))
            dispatch(setSemaphore(true))
            dispatch(open())
        }
    }, [memory])

    useEffect(() => {
        initGame()
    }, [memory.rows, memory.cols, modal.value])

    return (
        <React.Fragment>
            <div className="memory-game">
                <div className="game-container">
                    {/* Header */}
                    <div className="game-header">
                        <h1>Memory Game</h1>
                    </div>

                    <div className="game-layout">
                        {/* Board */}
                        <div className="game-board">
                            <div className="board-card">
                                {/* Stats */}
                                <div className="stats-container">
                                    <div className="stats-group">
                                        <div className="stat moves">
                                            Turn: {memory.moves}
                                        </div>
                                        <div className="stat matches">
                                            Pairs: {memory.matches}/{memory.pairs}
                                        </div>
                                        <ClockBase
                                            type={"countdown"}
                                            duration={memory.duration}
                                            semaphore={memory.semaphore}
                                            setTimeFinish={setTimeFinish}
                                        >
                                            <Clock display={memory.useTime} />
                                        </ClockBase>
                                    </div>
                                    <div className="action-buttons">
                                        <Button
                                            onClick={() => { resetGame() }}
                                            className="btn reset"
                                            disabled={memory.status !== "playing"}
                                        >
                                            New game
                                        </Button>
                                    </div>
                                </div>

                                {/* Grid */}
                                <div className="cards-grid" style={gridStyle}>
                                    {memory.cards.map((card) => {
                                        const stateClass = card.matched ? 'matched' : card.flipped ? 'flipped' : '';
                                        return (
                                            <button
                                                key={card.id}
                                                className={`memory-card ${stateClass}`}
                                                onClick={() => { handleFlipCard(card.id, card.value, (card.flipped || card.matched)) }}
                                                aria-label={card.flipped || card.matched ? `Thẻ ${card.value}` : 'Lật thẻ'}
                                            >
                                                <div className="card-inner">
                                                    <div className="card-face front">?</div>
                                                    <div className="card-face back">{card.value}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Side panel */}
                        <div className="side-panel">
                            <Button
                                onClick={() => { startGame() }}
                                disabled={memory.status === "playing"}
                                className="start-btn"
                            >
                                Play
                            </Button>
                            <div className="settings-panel">
                                <div className="panel-title">Settings</div>
                                <div className="settings-content">
                                    <div className="setting-group">
                                        <FormControl fullWidth>
                                            <InputLabel id="settings-row" className="label">Rows</InputLabel>
                                            <Select
                                                labelId='settings-row'
                                                label="Rows"
                                                className="select"
                                                value={memory.rows}
                                                onChange={handleChangeRow}
                                                disabled={memory.status !== "waiting"}
                                            >
                                                {[2, 3, 4, 5, 6].map(r => {
                                                    if (memory.cols % 2 === 1) {
                                                        if (r % 2 === 1) return null
                                                        else return <MenuItem key={r} value={r} sx={{ fontSize: "1.4rem" }}>{r}</MenuItem>
                                                    }

                                                    return <MenuItem key={r} value={r} sx={{ fontSize: "1.4rem" }}>{r}</MenuItem>
                                                }).filter(r => r)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="setting-group">
                                        <FormControl fullWidth>
                                            <InputLabel id="settings-col" className="label">Columns</InputLabel>
                                            <Select
                                                labelId='settings-col'
                                                label="Columns"
                                                className="select"
                                                value={memory.cols}
                                                onChange={handleChangeCol}
                                                disabled={memory.status !== "waiting"}
                                            >
                                                {[2, 3, 4, 5, 6].map(c => {
                                                    if (memory.rows % 2 === 1) {
                                                        if (c % 2 === 1) return null
                                                        else return <MenuItem key={c} value={c} sx={{ fontSize: "1.4rem" }}>{c}</MenuItem>
                                                    }

                                                    return <MenuItem key={c} value={c} sx={{ fontSize: "1.4rem" }}>{c}</MenuItem>
                                                }).filter(c => c)}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className="setting-group toggle">
                                        <div>
                                            <div className="label">Use time</div>
                                            <div className="description">countdown</div>
                                        </div>
                                        <Switch
                                            size={"small"}
                                            checked={memory.useTime}
                                            onChange={handleUseTime}
                                            disabled={memory.status !== "waiting"}
                                        />
                                    </div>
                                    {memory.useTime && (
                                        <div className="setting-group">
                                            <Slider
                                                aria-label="set time"
                                                step={30}
                                                marks
                                                min={60}
                                                max={180}
                                                value={memory.duration}
                                                onChange={handleChangeDuration}
                                                disabled={memory.status !== "waiting"}
                                            />
                                            <div className="time-display">Limit: {memory.duration}s</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            {
                modal.value &&
                <Modal>
                    <MemoryModal remain={timeFinish?.remain || 0} initGame={initGame} />
                </Modal>
            }
        </React.Fragment>
    );
};

export default Memory;