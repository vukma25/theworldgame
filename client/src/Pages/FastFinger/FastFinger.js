import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setStatus,
    newGame,
    exit
} from "../../redux/features/fastfinger"
import { renderParagraph, getProgress } from './Functions'
import '../../assets/styles/FastFinger.css'
import Waiting from './Screen/Waiting';
import Playing from './Screen/Playing';
import Finished from './Screen/Finished';

const FastFinger = () => {
    const { 
        status,
        options, 
        targetParagraph,
        currentIndex
    } = useSelector((state) => state.fastfinger)
    const dispatch = useDispatch()

    const [bestWpm, setBestWpm] = useState(JSON.parse(localStorage.getItem('bestWpm')) || 0)
    const [latestAccuracy, setLatestAccuracy] = useState(JSON.parse(localStorage.getItem('accuracy')) || 0)

    const initializeNewGame = useCallback(() => {
        const randomText = renderParagraph(options)
        dispatch(newGame(randomText))
    }, [options]);

    const startGame = (type = 'new') => {
        if (type === 'new') {
            resetGame()
        } else {
            tryAgainThisGame()
        }
        dispatch(setStatus("playing"))
    }

    const resetGame = () => {
        initializeNewGame()
    }

    const tryAgainThisGame = () => {
        dispatch(newGame(targetParagraph))
    }

    useEffect(() => {
        dispatch(exit())
    }, [])

    return (
        <div className="typing-game-container">
            <div className="typing-game-card">
                <h1 className="card-title">FastFinger</h1>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-track">
                        <div
                            className="progress-bar"
                            style={{ width: `${getProgress(targetParagraph, currentIndex)}%` }}
                        ></div>
                    </div>
                </div>

                {/* Game Area */}
                {status === 'waiting' &&
                    <Waiting
                        startGame={startGame}
                        bestWpm={bestWpm}
                        latestAccuracy={latestAccuracy}
                    />}

                {status === 'playing' &&
                    <Playing
                        setBestWpm={setBestWpm}
                        setLatestAccuracy={setLatestAccuracy}
                    />
                }

                {status === 'finished' &&
                    <Finished
                        startGame={startGame}
                        bestWpm={bestWpm}
                    />}
            </div>
        </div>
    );
};

export default FastFinger;