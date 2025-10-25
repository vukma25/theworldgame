import { useDispatch } from "react-redux"
import { useEffect } from "react"
import {
    controlBoth,
    controlMenu,
    controlSearch,
} from "../../../redux/features/navbar"


export default function Controller() {
    const dispatch = useDispatch()

    function setInit() {
        if (window.innerWidth >= 768) {
            dispatch(controlBoth())
        }
    }

    function toggleMenu() {
        dispatch(controlMenu())
    }

    function toggleSearch() {
        dispatch(controlSearch())
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
            <button
                id="menuToggle" className="icon-btn" aria-label="Menu"
                onClick={toggleMenu}
            >
                <svg className="ico-lg" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    )
}