import { useEffect, useRef, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    setSuggestBox,
    controlSearch
} from "../../redux/features/navbar"
import { useNavigate } from 'react-router';
import { useLocalStorage } from './UseLocalStorage';
import Logo from "./Parts/Logo"
import Links from "./Parts/Links"
import Auth from "./Parts/Auth"
import Search from "./Parts/Search"
import Controller from "./MobileControl/Controller"
import Menu from "./MobileControl/Menu"
import { Search as MobileSearch } from "./MobileControl/Search"
import AuthModal from "./AuthModal/Auth"
import "../../assets/styles/Navbar.css"

export const Nav = createContext()

function Navbar() {
    const {
        query, auth, mobileControl: { menu, search }
    } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()

    const [storage, setStorage] = useLocalStorage("recent-query", [])

    const refSuggest = useRef(null)
    const navigate = useNavigate()

    function handleFocus() {
        dispatch(setSuggestBox(true))
    }

    function handleKeyDown(e) {
        if (e.key === "/") {
            e.preventDefault();
            const sgBox = refSuggest.current
            if (!sgBox) return

            if (document.activeElement === sgBox) {
                sgBox.blur()
                dispatch(setSuggestBox(false))
            } else {
                sgBox.focus()
                dispatch(setSuggestBox(true))
            }
        }
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
            dispatch(controlSearch(false))
            dispatch(setSuggestBox(false))
            handleStorageQuery(q)
            const convertQuery = q.replaceAll(/\s+/g, "+")
            navigate(`/search?q=${convertQuery}`)
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    return (

        <Nav.Provider 
            value={{handleFocus, handleSearch, storage, setStorage, refSuggest}}
        >
            <nav className="glass">
                <div className="container">
                    <div className="bar stack-between gap-4">
                        <Logo />
                        <Links />
                        <Search />
                        <Auth />
                        <Controller />
                    </div>
                </div>

                {menu && <Menu />}
                {search && <MobileSearch />}
                {auth !== '' && < AuthModal />}
            </nav>
        </Nav.Provider>

    )
}

export default Navbar