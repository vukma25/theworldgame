import { Link } from 'react-router'
import {
    LocationOn, LocalPhone, Email,
    Facebook, X, Instagram, YouTube
} from '@mui/icons-material';

export default function Footer() {
    return (
        <footer>
            <div className="homepage-container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>The World Game</h3>
                        <p>The leading online gaming platform, bringing great entertainment experiences to everyone.</p>
                        <div className="social-links">
                            <Link to="/">
                                <Facebook />
                            </Link>
                            <Link to="/">
                                <X />
                            </Link>
                            <Link to="/">
                                <Instagram />
                            </Link>
                            <Link to="/">
                                <YouTube />
                            </Link>
                        </div>
                    </div>
                    <div className="footer-column">
                        <h3>Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/games">Games</Link></li>
                            <li><Link to="/leaderboard">LeaderBoard</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Games</h3>
                        <ul className="footer-links">
                            <li><Link to="/snakegame">Snake</Link></li>
                            <li><Link to="/caro">Caro</Link></li>
                            <li><Link to="/chess">Chess</Link></li>
                            <li><Link to="/minesweeper">Minesweeper</Link></li>
                            <li><Link to="/sudoku">Sudoku</Link></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Contact</h3>
                        <ul className="footer-links">
                            <li className='flex-div'>
                                <LocationOn />
                                Dawn Continent
                            </li>
                            <li className='flex-div'>
                                <LocalPhone />
                                +84 825 342 695
                            </li>
                            <li className='flex-div'>
                                <Email />
                                 hoantuanvu2005@gmail.com
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} The World Game.</p>
                </div>
            </div>
        </footer>
    )
}