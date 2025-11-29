import Icon from '@mui/material/Icon';
import { Link } from 'react-router-dom';
import logo from '../../assets/image/logo.png';
import './Navbar.css';

function Navbar({ setOpen }) {

    return (
        <nav className="flex-div navigation">
            <Link to="/" className="nav-left flex-div">
                <img src={logo} alt="website's logo" />
            </Link>
            <div className="nav-middle flex-div">
                <div className="nav-middle-references flex-div">
                    <Link to="/" className="references">Home</Link>
                    <div className="references">
                        Game
                        <div className="references-1">
                            <Link to="/games/minesweeper" className="child-1">Minesweeper</Link>
                            <Link to="/games/chess" className="child-1">Chess</Link>
                            <Link to="/games/tic-tac-toe" className="child-1">Tic tac toe</Link>
                            <Link to="/games/fast-finger" className="child-1">Fast finger</Link>
                            <Link to="/games/sudoku" className="child-1">Sudoku</Link>
                            <Link to="/games/wordle" className="child-1">Wordle</Link>
                            <Link to="/games/memory-game" className="child-1">Memory game</Link>
                            <Link to="/games/snake-game" className="child-1">Snake Game</Link>
                        </div>
                    </div>
                    <Link to="/statistics" className="references">Statistics</Link>
                </div>
                <div className="search-box flex-div">
                    <input
                        type="input"
                        placeholder="Search"
                        className="search-box-input"
                    />
                    <Icon className="search-box-icon">search</Icon>
                </div>
            </div>
            <div className="nav-right flex-div">
                <div 
                    className="nav-right-login flex-div"
                    onClick={() => setOpen(prevState => !prevState)}
                >
                    Log in
                </div>
                <Link to="/signup" className="nav-right-register flex-div">
                    Sign up
                </Link>
            </div>
        </nav>
    )
}

export default Navbar