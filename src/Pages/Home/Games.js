
import Icon from '@mui/material/Icon'
import { cards } from './Card'

export default function Games() {
    return (
        <section className="games">
            <div className="homepage-container">
                <div className="section-title">
                    <h2>Our games</h2>
                    <p>Explore a diverse and engaging collection of games, suitable for all ages and interests</p>
                </div>
                <div className="games-grid">
                    {
                        cards.map(({icon, name, des}) => (
                            <div key={name} className="game-card">
                                <div className="game-icon flex-div">
                                    <Icon sx={{ fontSize: "2.5rem" }}>{icon}</Icon>
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