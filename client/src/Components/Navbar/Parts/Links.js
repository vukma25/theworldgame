import { useSelector, useDispatch } from 'react-redux'
import { setDropdown } from '../../../redux/features/navbar'
import { Link } from 'react-router'
import { links } from '../Static/Links'


export default function Links() {
    const { dropdown } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()

    function handleToggleDropdown(e) {
        dispatch(setDropdown())
    }

    return (
        <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>

            <div
                className="dropdown"
                onClick={handleToggleDropdown}
            >
                <div className="dropdown-toggle nav-link" id="gameLink">
                    Game
                    <svg
                        className={`chev ico ${dropdown ? "chev-effect" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
                <div className={`dropdown-menu ${dropdown ? "dropdown-menu-effect" : ""}`} id="gameDropdown">
                    {
                        links.map(({endpoint, name, icon, short}) => (
                            <Link 
                                key={short}
                                to={`/${endpoint}`} 
                                className="dropdown-item">
                                <span style={{ fontSize: '1.8rem' }}>{icon}</span>
                                <div>
                                    <strong>{name}</strong>
                                    <small>{short}</small>
                                </div>
                            </Link>
                        ))
                    }
                </div>
            </div>

            <Link to="/leaderboard" className="nav-link">LeaderBoard</Link>
        </div>
    )
}