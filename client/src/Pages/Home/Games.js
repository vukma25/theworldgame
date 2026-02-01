
import { useNavigate } from 'react-router-dom'
import { cards } from './Card'

export default function Games() {
    const navigate = useNavigate()

    function redirect() {
        navigate("/games")
    }

    return (
        <section className="games">
            {/* <ColliderBackground /> */}
            <div className="homepage-container">
                <div className="section-title">
                    <h2>Our games</h2>
                    <p>Explore a diverse and engaging collection of games, suitable for all ages and interests</p>
                </div>
                <div className="games-grid">
                    {
                        cards.map(({ icon, name, des }) => (
                            <div key={name}
                                className="game-card"
                                onClick={redirect}
                            >
                                <div className="game-icon flex-div">
                                    {icon}
                                    <h3>{name}</h3>
                                </div>
                                <p>{des}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}