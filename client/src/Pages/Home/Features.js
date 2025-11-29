import { useEffect } from 'react'
import { DoneAll } from '@mui/icons-material'
import friendly from '../../assets/image/f_user_friendly.jpeg'
import variety from '../../assets/image/f_varity_game.jpeg'
import highComplete from '../../assets/image/hero-page-gif-bg.gif'

export default function Features() {
    const tick = <DoneAll sx={
        {
            color: "var(--cl-green)",
            marginRight: ".3rem"
        }
    }/>

    useEffect(() => {
        const features = Array.from(document.querySelectorAll('.feature-item'));
        if (!features.length) return;

        const handleScroll = () => {
            features.forEach(element => {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8; // Khi element cách top 80% màn hình

                if (isVisible) {
                    element.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);

        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className="features">
            <div className="homepage-container">
                <div className="feature-item">
                    <div className="feature-image">
                        <img src={variety} alt="variety of game" />
                    </div>
                    <div className="feature-text">
                        <h2>Variety of game genres</h2>
                        <p>We bring you a rich collection of games from classic to modern, suitable for all ages and interests</p>
                        <ul className="feature-list">
                            <li>{tick} Brain games: Chess, Sudoku, Caro</li>
                            <li>{tick} Entertainment games: Snake, Minesweeper</li>
                            <li>{tick} Training games: Fast Finger, Memory</li>
                            <li>{tick} Language games: Wordle</li>
                        </ul>
                    </div>
                </div>

                <div className="feature-item">
                    <div className="feature-image">
                        <img src={friendly} alt="This website has a friendly use interface"/>
                    </div>
                    <div className="feature-text">
                        <h2>Friendly & Easy-to-Use Interface</h2>
                        <p>Modern, intuitive design helps players easily get acquainted and enjoy a great gaming experience.</p>
                        <ul className="feature-list">
                            <li>{tick} Responsive design on all devices</li>
                            <li>{tick} Detailed instructions for each game</li>
                            <li>{tick} Simple, easy-to-use controls</li>
                            <li>{tick} Fast, smooth loading speed</li>
                        </ul>
                    </div>
                </div>

                <div className="feature-item">
                    <div className="feature-image">
                        <img src={highComplete} alt="Matches are high complete"/>
                    </div>
                    <div className="feature-text">
                        <h2>Exciting, engaging matches</h2>
                        <p>Join matches, share scores, achievements and compete with friends.</p>
                        <ul className="feature-list">
                            <li>{tick} Global Leaderboard</li>
                            <li>{tick} Challenge friends</li>
                            <li>{tick} Share achievements</li>
                            <li>{tick} Discuss strategies</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}