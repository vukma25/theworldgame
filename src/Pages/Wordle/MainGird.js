import { useSelector } from "react-redux";

export default function MainGrid({ log }) {

    const { 
        lengthWord,
        guesses,
        currentGuess,
        currentRow
    } = useSelector((state) => state.wordle)

    const getCellClass = (letter, status, isCurrentRow = false) => {
        let baseClass = "wordle-cell";

        if (status === 'correct') {
            baseClass += " correct";
        } else if (status === 'present') {
            baseClass += " present";
        } else if (status === 'absent') {
            baseClass += " absent";
        } else if (letter) {
            baseClass += " filled";
        }

        if (isCurrentRow && log.message.length !== 0) {
            baseClass += " shake";
        }

        return baseClass;
    }

    return (
        <div className="wordle-grid">
            {Array.from({ length: 6 }, (_, rowIndex) => (
                <div key={rowIndex}
                    className="wordle-row"
                    style={{ gridTemplateColumns: `repeat(${lengthWord}, minmax(4rem, 5rem))` }}
                >
                    {Array.from({ length: lengthWord }, (_, colIndex) => {
                        let letter = '';
                        let status = '';

                        if (rowIndex < guesses.length) {
                            letter = guesses[rowIndex].word[colIndex];
                            status = guesses[rowIndex].result[colIndex];
                        } else if (rowIndex === currentRow) {
                            letter = currentGuess[colIndex] || '';
                        }

                        return (
                            <div
                                key={colIndex}
                                className={getCellClass(letter, status, rowIndex === currentRow)}
                            >
                                {letter}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    )
}