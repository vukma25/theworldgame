import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    clearGuess,
    typingKey,
    deleteKey,
    guessesChain,
    jumpRow,
    setStatus,
    keyboard,
    restart
} from "../../redux/features/wordle"
import { open, close } from "../../redux/features/modal"
import WORDS from '../../VocabResource'
import Panel from './Panel';
import MainGrid from './MainGird';
import VirtualKeyBoard from './VirtualKeyBoard'
import Logger from '../../Components/Logger/Logger'
import Modal from "../../Components/Modal/Modal"
import WordleModal from './WordleModal';
import '../../assets/styles/Wordle.css'

const Wordle = () => {
    const wordle = useSelector((state) => state.wordle)
    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()

    const [log, setLog] = useState({
        'message': '',
        'type': 'info'
    })

    const handleRandomWord = useMemo(() => {
        const listWords = WORDS[wordle.lengthWord]
        let randomNum = Math.floor(Math.random() * listWords.length)
        let randomWord = listWords[randomNum];

        //chưa đảm bảo được danh sách hoàn toàn chỉ chứa các từ có độ dài bằng với key
        //nên phải random cho tới khi hợp lệ -> đảm bảo
        while (randomWord.length !== wordle.lengthWord) {
            randomNum = Math.floor(Math.random() * listWords.length)
            randomWord = listWords[randomNum];
        }

        return randomWord
    }, [wordle.gameStatus, wordle.lengthWord])

    const handleAddLetter = (letter) => {
        if (wordle.currentGuess.length < wordle.lengthWord) {
            dispatch(typingKey(letter))
        }
    }

    const handleDeleteLetter = () => {
        if (wordle.currentGuess.length > 0) {
            dispatch(deleteKey())
        }
    }

    const handleSubmitGuess = () => {
        if (wordle.currentGuess.length !== wordle.lengthWord) {
            setLog({
                'message': 'Too short',
                'type': 'info'
            })
            return
        }

        const lowerCurrentGuess = wordle.currentGuess.toLowerCase()

        if (!WORDS[wordle.lengthWord].includes(lowerCurrentGuess)) {
            setLog({
                'message': 'This word is invalid or its not in data resource',
                'type': 'info'
            })
            return;
        }

        const newGuess = {
            word: wordle.currentGuess,
            result: getGuessResult(lowerCurrentGuess)
        };

        const newGuesses = [...wordle.guesses, newGuess]
        dispatch(guessesChain(newGuesses))
        updateKeyboardStatus(newGuess.result)

        if (lowerCurrentGuess === wordle.targetWord) {
            dispatch(setStatus('won'))
            dispatch(open())
        } else if (newGuesses.length >= 6) {
            dispatch(setStatus('lost'))
            dispatch(open())
        }

        dispatch(clearGuess())
        dispatch(jumpRow(wordle.currentRow + 1))
    }

    //just use VirtualKeyBoard
    const handlePressKey = (key) => {
        if (key === 'ENTER') {
            handleSubmitGuess();
        } else if (key === 'DELETE') {
            handleDeleteLetter();
        } else {
            handleAddLetter(key);
        }
    }

    const getGuessResult = (guess) => {
        const result = Array.from({ length: wordle.lengthWord }, () => '')
        const targetLetters = wordle.targetWord.split('');
        const guessLetters = guess.split('');

        // khớp kí tự đúng và xóa chúng
        for (let i = 0; i < wordle.lengthWord; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }

        // các kí tự còn lại, có thể là tồn tại nhưng đặt sai vị trí, hoặc không tồn tại trong từ cần đoán
        for (let i = 0; i < wordle.lengthWord; i++) {
            if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
                result[i] = 'present';
                const targetIndex = targetLetters.indexOf(guessLetters[i]);
                targetLetters[targetIndex] = null;
            } else if (guessLetters[i]) {
                result[i] = 'absent';
            }
        }

        return result;
    }

    const updateKeyboardStatus = (result) => {
        const newStatus = { ...wordle.keyboardStatus };

        for (let i = 0; i < wordle.currentGuess.length; i++) {
            const letter = wordle.currentGuess[i];
            const status = result[i];

            if (status === 'correct') {
                newStatus[letter] = 'correct';
            } else if (status === 'present' && newStatus[letter] !== 'correct') {
                newStatus[letter] = 'present';
            } else if (status === 'absent' && !newStatus[letter]) {
                newStatus[letter] = 'absent';
            }
        }

        dispatch(keyboard(newStatus))
    }

    const newGame = useCallback(() => {
        const newWord = handleRandomWord
        dispatch(restart(newWord))
    }, [handleRandomWord, dispatch])

    useEffect(() => { dispatch(close()) }, [])

    useEffect(() => {
        newGame()
    }, [wordle.lengthWord])

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (wordle.gameStatus !== 'playing') return;

            const key = e.key.toUpperCase();

            if (key === 'ENTER') {
                handleSubmitGuess();
            } else if (key === 'BACKSPACE') {
                handleDeleteLetter();
            } else if (key.match(/[A-Z]/) && key.length === 1) {
                handleAddLetter(key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [wordle.currentGuess, wordle.gameStatus])

    return (
        <div className="wordle-container">
            <div className="wordle-card flex-div">
                <Panel newGame={newGame}/>

                {/* Game Grid */}
                <MainGrid log={log}/>

                <VirtualKeyBoard handlePressKey={handlePressKey} />
            </div>
            <Logger log={log} setLog={setLog} />
            {modal.value && 
                <Modal>
                    <WordleModal newGame={newGame} />
                </Modal>
            }
        </div>
    );
};

export default Wordle;