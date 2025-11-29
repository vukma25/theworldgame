import { useNavigate } from "react-router-dom"
import { useRef, useMemo } from 'react'
import {
    SportsEsports, Casino, Extension, Headphones,
    EmojiEvents, Star, Mouse, Flag, Keyboard
} from '@mui/icons-material'
import heroImage from '../../assets/image/hero-page-img.jpeg'
import logo from "../../assets/image/logo.jpg"

const alternative = heroImage

export default function Hero() {
    const navigate = useNavigate()
    const icons = useRef([
        <SportsEsports />, <Casino />, <Extension />, <Headphones />,
        <EmojiEvents />, <Star />, <Mouse />, <Flag />, <Keyboard />
    ])

    function redirect() {
        navigate("/games")
    }

    const renderFloatingIcon = useMemo(() => {
        return icons.current.map((icon, index) => {
            const t = Math.random() * 100;
            const l = Math.random() * 100;

            return (<div
                key={index}
                className="hero-icon"
                style={{
                    top: `${t}%`,
                    left: `${l}%`
                }}
            >{icon}</div>)
        })
    }, [])

    return (
        <section className="hero">
            <div className="floating-icons">
                {renderFloatingIcon}
            </div>
            <div className="homepage-container">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1>Explore the amazing world of <span>games</span></h1>
                        <p>The World Game brings you the most exciting collection of games, from classic to modern titles. Join now to experience endless fun!</p>
                        <div className="hero-buttons">
                            <button
                                className="btn btn-primary btn-large"
                                onClick={redirect}
                            >Play now</button>
                        </div>
                    </div>
                    <div className="hero-image">
                        <img src={logo ?? alternative}
                            alt="The World Game" />
                    </div>
                </div>
            </div>
        </section>
    )
}