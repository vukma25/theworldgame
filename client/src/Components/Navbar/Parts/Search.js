import { useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setQuery } from "../../../redux/features/navbar"
import { Nav } from "../Navbar"
import SuggestBox from "../../SuggestBox/SuggestBox"


export default function Search() {
    const { query } = useSelector((state) => state.navbar)
    const dispatch = useDispatch()
    const { handleFocus, handleSearch, refSuggest } = useContext(Nav)

    function handleQuery(e) {
        dispatch(setQuery(e.target.value))
    }

    return (
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
                        onClick={handleFocus}
                        onChange={handleQuery}
                    />
                    <kbd className="kbd">/</kbd>
                </div>
                <SuggestBox />
            </div>
        </div>
    )
}