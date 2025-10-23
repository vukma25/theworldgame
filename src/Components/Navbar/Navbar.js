import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { open, close } from "../../redux/features/modal"
import Icon from '@mui/material/Icon';
import { Link } from 'react-router';
import { useLocalStorage } from './UseLocalStorage';
import Modal from '../Modal/Modal'
import SuggestBox from '../SuggestBox/SuggestBox';
import '../../assets/styles/Navbar.css';

function Navbar() {

    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()

    const [dropdown, setDropdown] = useState(false)
    const [mobile, setMobile] = useState({
        'menu': false,
        'search': false
    })
    const [auth, setAuth] = useState('')
    const [suggestBox, setSuggestBox] = useState(false)
    const [query, setQuery] = useState('')
    const [storage, setStorage] = useLocalStorage("recent-query", [])

    const refSuggest = useRef(null)

    const navigate = useNavigate()

    function setInit() {
        if (window.innerWidth >= 768) {
            setMobile({
                'menu': false,
                'search': false
            })
        }
    }

    function toggleDropdown() {
        setDropdown(prevState => !prevState)
    }

    function toggleMenu() {
        setMobile(prevState => {
            return {
                'search': false,
                'menu': !prevState.menu
            }
        })
    }

    function toggleSearch() {
        setMobile(prevState => {
            return {
                'menu': false,
                'search': !prevState.search
            }
        })
    }

    function handleFocus() {
        setSuggestBox(true)
    }

    function handleKeyDown(e) {
        if (e.key === "/") {
            e.preventDefault();
            const sgBox = refSuggest.current
            if (!sgBox) return

            if (document.activeElement === sgBox) {
                sgBox.blur()
                setSuggestBox(false)
            } else {
                sgBox.focus()
                setSuggestBox(true)
            }
        } 
        // else if (e.key === "Enter") {
        //     handleSearch(e)
        // }
    }

    function handleStorageQuery(query) {
        if (storage.length !== 0) {
            let queries = storage
            if (queries.map(e => e.toLowerCase()).includes(query.toLowerCase())) return
            if (queries.length === 10) {
                queries.shift()
                queries.push(query)
            } else {
                queries.push(query)
            }

            setStorage(queries)
        } else {
            setStorage([query])
        }
    }

    function handleSearch(e) {
        e.preventDefault()
        const q = query.trim();

        if (!q) return
        if (q.length > 3) {
            setSuggestBox(false)
            handleStorageQuery(q)
            const convertQuery = q.replaceAll(/\s+/g, "+")
            navigate(`/search?q=${convertQuery}`)
        }

    }

    useEffect(() => {
        window.addEventListener('resize', setInit)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('resize', setInit)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (
        <nav className="glass">
            <div className="container">
                <div className="bar stack-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="logo-wrap">
                        <span className="logo-badge">TWG</span>
                        <div className="logo-title">
                            <div className="logo-name">TheWorldGame</div>
                            <div className="logo-sub">Play - Compete - Win</div>
                        </div>
                    </Link>

                    {/* Links (Desktop) */}
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>

                        <div
                            className="dropdown"
                            onClick={() => { toggleDropdown() }}
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
                                <Link to="/games/minesweeper" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>💣</span>
                                    <div>
                                        <strong>Minesweeper</strong>
                                        <small>Find all bombs without detonating</small>
                                    </div>
                                </Link>

                                <Link to="/games/chess" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>♟️</span>
                                    <div>
                                        <strong>Chess</strong>
                                        <small>Classic strategy board game</small>
                                    </div>
                                </Link>

                                <Link to="/games/sudoku" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>🔢</span>
                                    <div>
                                        <strong>Sudoku</strong>
                                        <small>Fill the grid with correct numbers</small>
                                    </div>
                                </Link>

                                <Link to="/games/wordle" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>🔤</span>
                                    <div>
                                        <strong>Wordle</strong>
                                        <small>Guess the hidden word</small>
                                    </div>
                                </Link>

                                <Link to="/games/fastfinger" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>⌨️</span>
                                    <div>
                                        <strong>Fast Finger</strong>
                                        <small>Type words quickly and accurately</small>
                                    </div>
                                </Link>

                                <Link to="/games/memorygame" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>🧠</span>
                                    <div>
                                        <strong>Memory Game</strong>
                                        <small>Match pairs to win</small>
                                    </div>
                                </Link>

                                <Link to="/games/snakegame" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>🐍</span>
                                    <div>
                                        <strong>Snake Game</strong>
                                        <small>Eat food, grow longer</small>
                                    </div>
                                </Link>

                                <Link to="/games/caro" className="dropdown-item">
                                    <span style={{ fontSize: '1.8rem' }}>⭕</span>
                                    <div>
                                        <strong>Caro</strong>
                                        <small>Five in a row to win</small>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <Link to="/leadboard" className="nav-link">LeadBoard</Link>
                    </div>

                    {/* Search */}
                    <div className="search-wrap">
                        <div className="search-box">
                            <div className="search-field">
                                <div
                                    onClick={handleSearch}
                                >
                                    <svg className="ico" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <input
                                    ref={refSuggest}
                                    id="searchInput"
                                    type="text"
                                    value={query}
                                    autoComplete="off"
                                    placeholder="Tìm game, thể loại, người chơi..."
                                    onClick={() => { handleFocus() }}
                                    onChange={(e) => { setQuery(e.target.value) }}
                                />
                                <kbd className="kbd">/</kbd>
                            </div>
                            <SuggestBox
                                suggestBox={suggestBox}
                                setSuggestBox={setSuggestBox}
                                query={query}
                                setQuery={setQuery}
                                storage={storage} 
                                setStorage={setStorage}
                            />
                        </div>
                    </div>

                    {/* Auth (Desktop) */}
                    <div className="auth">
                        <button
                            id="loginBtn" className="btn btn-ghost"
                            onClick={() => { 
                                setAuth('Login') 
                                dispatch(open())
                            }}
                        >Login</button>
                        <button
                            id="signupBtn" className="btn btn-primary"
                            onClick={() => { 
                                setAuth('Register') 
                                dispatch(open())
                            }}
                        >Register</button>
                    </div>

                    {/* Mobile controls */}
                    <div className="md-only gap-2">
                        <button
                            id="searchToggle" className="icon-btn" aria-label="Tìm kiếm"
                            onClick={() => { toggleSearch() }}
                        >
                            <svg className="ico-lg" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        <button
                            id="menuToggle" className="icon-btn" aria-label="Menu"
                            onClick={() => { toggleMenu() }}
                        >
                            <svg className="ico-lg" viewBox="0 0 24 24" fill="none">
                                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile search */}
            {mobile.search && <div id="mobileSearch" className="mobile-panel mobile-search">
                <div className="w-full relative">
                    <div className="field">
                        <svg
                            className="ico"
                            viewBox="0 0 24 24"
                            fill="none"
                            onClick={handleSearch}
                        >
                            <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full"
                            style={{ border: 'none', outline: 'none', color: '#374151' }}
                            ref={refSuggest}
                            id="searchInput"
                            value={query}
                            autoComplete="off"
                            onClick={() => { handleFocus() }}
                            onChange={(e) => { setQuery(e.target.value) }}
                        />
                    </div>
                    <SuggestBox
                        suggestBox={suggestBox}
                        setSuggestBox={setSuggestBox}
                        query={query}
                        setQuery={setQuery}
                        storage={storage}
                        setStorage={setStorage}
                    />
                </div>
            </div>}

            {/* Mobile menu */}
            {mobile.menu && <div id="mobileMenu" className="mobile-panel mobile-menu">
                <div className="grid">
                    <Link to="/" className="chip">Home</Link>
                    <Link to="/lead-board" className="chip">LeadBoard</Link>
                </div>
                <div className="mobile-auth" style={{ marginTop: '.5rem' }}>
                    <button
                        className="btn btn-ghost btn-block"
                        onClick={() => { 
                            setAuth('Login') 
                            dispatch(open())
                        }}
                    >Login</button>
                    <button
                        className="btn btn-primary btn-block"
                        onClick={() => { 
                            setAuth('Register') 
                            dispatch(open())
                        }}
                    >Register</button>
                </div>
            </div>}

            {/* Auth */}
            {modal.value &&
                <Modal>
                    <div className="auth-modal">
                        <div className="auth-modal-head">
                            <h3 id="modalTitle" className="auth-modal-title">{auth}</h3>
                            <button
                                id="modalClose" className="xbtn flex-div" aria-label="Đóng"
                                onClick={() => { dispatch(close())}}
                            >
                                <Icon sx={{ fontSize: "2rem" }}>close</Icon>
                            </button>
                        </div>
                        <div className="auth-modal-body">
                            <div className="grid-2">
                                <button className="bbtn">Google</button>
                                <button className="bbtn">Facebook</button>
                            </div>
                            <div className="divline">
                                <div className="hr"></div><span className="muted" style={{ fontSize: "1.2rem" }}>or</span><div className="hr"></div>
                            </div>
                            <div className="field-col">
                                <input type="text" placeholder="Email" className="input" />
                                <input type="text" placeholder="Password" className="input" />
                            </div>
                            <button className="cta" style={{ marginTop: ".5rem" }}>{auth}</button>
                        </div>
                    </div>
                </Modal>}
        </nav>
    )
}

export default Navbar