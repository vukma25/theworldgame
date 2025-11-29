import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import {
    controlBoth,
    controlMenu,
    controlSearch,
} from "../../../redux/features/navbar"
import AccountMenu from "../Parts/AccountMenu"


export default function Controller() {
    const { user } = useSelector((state) => state.auth)
    const { mobileControl: { menu, search } } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()

    function setInit() {
        if (window.innerWidth >= 768) {
            dispatch(controlBoth())
        }
    }

    function toggleMenu() {
        if (menu) {
            dispatch(controlMenu(false))
            return
        }
        dispatch(controlMenu(true))
    }

    function toggleSearch() {
        if (search) {
            dispatch(controlSearch(false))
            return
        }
        dispatch(controlSearch(true))
    }

    useEffect(() => {
        window.addEventListener('resize', setInit)

        return () => window.removeEventListener('resize', setInit)
    }, [])

    return (
        <div className="md-only gap-2">
            <button
                id="searchToggle" className="icon-btn" aria-label="Tìm kiếm"
                onClick={toggleSearch}
            >
                <svg className="ico-lg" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
            {!user && <button
                id="menuToggle" className="icon-btn" aria-label="Menu"
                onClick={toggleMenu}
            >
                <svg className="ico-lg" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>}
            {user && <AccountMenu />}
        </div>
    )
}