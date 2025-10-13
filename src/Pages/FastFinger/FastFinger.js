import { useState, useCallback, useRef, useReducer } from 'react';
import {
    setNewGame,
    setGameState,
    setQuitGame
} from './Action'
import { initialState, reducer } from './Reducer';
import { renderParagraph, getProgress } from './Functions'
import '../../assets/styles/FastFinger.css'
import Waiting from './Screen/Waiting';
import Playing from './Screen/Playing';
import Finished from './Screen/Finished';

const FastFinger = () => {
    
    const [game, dispatch] = useReducer(reducer, initialState)
    const [bestWpm, setBestWpm] = useState(JSON.parse(localStorage.getItem('bestWpm')) || 0)
    const [accuracy, setAccuracy] = useState(JSON.parse(localStorage.getItem('accuracy')) || 0)

    const gameRef = useRef(game)
    gameRef.current = game

    const initializeNewGame = useCallback(() => {
        const randomText = renderParagraph(game.options)
        dispatch(setNewGame(randomText))
    }, [game.options]);

    const startGame = (type = 'new') => {

        if (type === 'new') {
            resetGame()
        } else {
            tryAgainThisGame()
        }
        dispatch(setGameState("playing"))
    }

    const endGame = useCallback(() => {
        dispatch(setGameState("finished"))
        updateRecord(gameRef.current.wpm, gameRef.current.accuracy)
    }, [])

    const resetGame = () => {
        initializeNewGame()
    }

    const tryAgainThisGame = () => {
        dispatch(setNewGame(game.targetParagraph))
    }

    const quitGame = () => {
        dispatch(setQuitGame())
    }

    const updateRecord = (newWpm, newAccuracy) => {
        let bestWpm = localStorage.getItem('bestWpm')
        let wpm = newWpm

        if (bestWpm) {
            wpm = JSON.parse(bestWpm)

            if (newWpm > wpm){
                wpm = newWpm
            }
        }

        localStorage.setItem('bestWpm', JSON.stringify(wpm))
        localStorage.setItem('accuracy', JSON.stringify(newAccuracy))
        setBestWpm(wpm)
        setAccuracy(newAccuracy)
    }

    return (
        <div className="typing-game-container">
            <div className="typing-game-card">
                <h1 className="card-title">FastFinger</h1>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-track">
                        <div
                            className="progress-bar"
                            style={{ width: `${getProgress(game)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Area */}
                {game.state === 'waiting' && 
                    <Waiting 
                        game={game} 
                        startGame={startGame} 
                        dispatch={dispatch}
                        bestWpm={bestWpm}
                        accuracy={accuracy}
                    />}

                {game.state === 'playing' && 
                    <Playing 
                        game={game}
                        startGame={startGame}
                        endGame={endGame}
                        quitGame={quitGame}
                        dispatch={dispatch}
                    />
                }

                {game.state === 'finished' && 
                    <Finished 
                        game={game} 
                        startGame={startGame} 
                        bestWpm={bestWpm}
                    />}
            </div>
        </div>
    );
};

export default FastFinger;