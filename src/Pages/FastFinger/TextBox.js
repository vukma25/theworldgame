import { useEffect, useRef } from 'react'

export default function TextBox({ game }) {
    const refIndex = useRef(null)
    const refBox = useRef(null)
    const refCount = useRef(0)

    const renderText = () => {
        const { targetParagraph, userInput } = game

        return targetParagraph.map((word, index) => {
            let className = 'word';

            if (index < userInput.length) {
                className += userInput[index] === word ? ' correct' : ' incorrect';
            } else if (index === game.currentIndex) {
                className += ' current';
            } else {
                className += ' untyped';
            }

            return (
                <span 
                    key={index} 
                    className={className}
                    ref={index === game.currentIndex ? refIndex : null}
                >
                    {word}
                </span>
            );
        });
    }

    useEffect(() => {
        const box = refBox.current

        if (!box || !refIndex.current) return

        let top1 = box.getBoundingClientRect().top
        let top2 = refIndex.current.getBoundingClientRect().top
        
        if (Math.floor(top2 - top1) > 0) {
            refCount.current += 1
        }

        box.scrollTop = refCount.current * 24.5

    }, [game.currentIndex])

    return (
        <div className="text-display">
            <div className="typing-text" ref={refBox}>
                {renderText()}
            </div>
        </div>
    )
}