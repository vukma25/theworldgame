import { useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setQuery } from "../../../redux/features/navbar"
import SuggestBox from "../../SuggestBox/SuggestBox"
import { Nav } from "../Navbar"

export function Search() {
    const { query } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()
    const { handleFocus, handleSearch, refSuggest } = useContext(Nav)

    function handleQuery(e) {
        dispatch(setQuery(e.target.value))
    }
    
    return (
        <div id="mobileSearch" className="mobile-panel mobile-search">
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
                        onClick={handleFocus}
                        onChange={handleQuery}
                    />
                </div>
                <SuggestBox />
            </div>
        </div>
    )
}