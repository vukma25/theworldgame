import { useSelector, useDispatch } from "react-redux"
import { Button } from '@mui/material'
import { close } from "../../redux/features/modal"
import Icon from '@mui/material/Icon'

export default function WordleModal({ newGame }) {
    const { targetWord, gameStatus } = useSelector((state) => state.wordle)
    const dispatch = useDispatch()

    return (
        <div className="wordle-modal">
            <div className="modal-content">
                <div className="inform">
                    <h1 className="inform-title">You {gameStatus}!</h1>
                    <Icon
                        className="inform-close"
                        onClick={() => { dispatch(close()) }}
                    >close</Icon>
                </div>
                <div className="result">
                    <div className="result-title">The answer was:</div>
                    <div className="result-content">
                        {targetWord.toUpperCase().split('').map((char, index) => (
                            <span
                                key={index}
                                className="char">{char}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="links">
                    <span className="links-title">What does this word mean?</span>
                    <a
                        href={`https://translate.google.com/?sl=en&tl=vi&text=${targetWord}&op=translate`}
                        target="_blank">Google Translate
                    </a>
                    <a
                        href={`https://dictionary.cambridge.org/dictionary/english/${targetWord}`}
                        target="_blank">Cambridge dictionary
                    </a>
                </div>

                <Button
                    className="reset-btn"
                    onClick={() => {
                        newGame()
                        dispatch(close())
                    }}
                >New game</Button>
            </div>
        </div>
    )

}