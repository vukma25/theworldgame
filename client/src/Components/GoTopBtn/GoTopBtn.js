
import { useState, useEffect, useRef } from 'react'
import { KeyboardArrowUp } from '@mui/icons-material'
import '../../assets/styles/GoTopBtn.css'

function GoTopBtn() {

    const [styleGoTop, setStyleGoTop] = useState({
        'display': 'none'
    })
    const [styleCircle, setStyleCircle] = useState({})
    const circleRef = useRef(null)

    useEffect(() => {
        const circle = circleRef.current
        if (!circle) return 

        const radius = circle.r.baseVal.value
        const C = 2 * Math.PI * radius

        function calculateOffset(percent) {
            const offset = C - percent * C
            setStyleCircle({
                'strokeDashoffset': offset,
                'strokeDasharray': C
            })
        }   
        function updateOffset() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.min(scrollTop / docHeight, 1);

            if (scrollTop > 0) {
                setStyleGoTop({
                    'display': 'block'
                })
                calculateOffset(scrollPercent)
            } else {
                setStyleGoTop({
                    'display': 'none'
                })
            }
            
        }

        window.addEventListener('scroll', updateOffset)

        return () => {
            window.removeEventListener('scroll', updateOffset)
        }
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div 
            className="go-top-container"
            style={styleGoTop}
            onClick={() => {scrollToTop()}}
        >
            <div className="go-top-wrapper">
                <svg className="go-top-ring" width="50" height="50">
                    <circle
                        ref={circleRef}
                        className="go-top-ring__circle"
                        r="20"
                        cx="25"
                        cy="25"
                        style={styleCircle}
                    />
                </svg>
                <KeyboardArrowUp className="go-top-arrow"/>
            </div>
        </div>

    )
}

export default GoTopBtn