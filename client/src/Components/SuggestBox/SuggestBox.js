import { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setQuery, setSuggestBox } from '../../redux/features/navbar'
import { Nav } from '../Navbar/Navbar'
import { IconButton } from '@mui/material'
import { Close, TrendingUp, Search, History } from '@mui/icons-material'
import { data, defaultSuggest } from './data'
import '../../assets/styles/SuggestBox.css'

function SuggestBox() {

    const { query, suggestBox } = useSelector((state) => state.navbar)
    const { storage, setStorage } = useContext(Nav)
    const dispatch = useDispatch()
    const [figure, setFigure] = useState([])
    const navigate = useNavigate()

    function getDataFromQuery(query) {
        if (query.length <= 3) return []

        const returnData = data.filter(item =>
        (
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.tags.some(e => e.toLowerCase().includes(query.toLowerCase()))
        )
        )

        return returnData
    }

    function handleRedirect(e, name) {
        e.preventDefault()
        const q = name.trim();
        const convertQuery = q.replaceAll(/\s+/g, "+")
        navigate(`/search?q=${convertQuery}`)
    }

    function handleSearch(e, q) {
        handleRedirect(e, q)
        dispatch(setQuery(q))
        dispatch(setSuggestBox(false))
    }

    function deleteHistorySearch(query) {
        let queries = JSON.parse(localStorage.getItem("recent-query"))
        queries = queries.filter(q => q !== query)
        setStorage(queries)
    }

    useEffect(() => {
        const timeOut = setTimeout(function () {
            setFigure(getDataFromQuery(query))
        }, 500)

        return () => { clearTimeout(timeOut) }
    }, [query])

    return (
        <>
            {suggestBox && <div id="suggestBox" className="suggest">
                <div
                    className="suggest-title flex-div"
                >
                    <p>Suggest</p>
                    <IconButton onClick={()=>{dispatch(setSuggestBox(false))}}>
                        <Close/>
                    </IconButton>
                </div>
                <div className="suggest-title">{query.length === 0 ? "Recent search" : "Results"}</div>
                {query.length !== 0 ? (
                    figure.length === 0 ?
                        <p className="suggest-btn">Not found any result</p> :
                        figure.map(({ name }) => {
                            return (
                                <button
                                    key={name}
                                    className="suggest-btn"
                                    onClick={(e) => {
                                        handleSearch(e, name)
                                    }}
                                >
                                    <Search sx={{
                                        fontSize: "2rem",
                                        color: "var(--brand-500)"
                                    }}/>
                                    <span>{name}</span>
                                </button>
                            )
                        })
                ) :
                    (
                        storage.reverse().slice(0, 6).map(q => {
                            return (
                                <div key={q} className="flex-div suggest-btn">
                                    <button
                                        className="suggest-btn-history"
                                        onClick={(e) => {
                                            handleSearch(e, q)
                                        }}
                                    >
                                        <History sx={{
                                            fontSize: "2rem",
                                            color: "var(--brand-500)"
                                        }}/>
                                        <span>{q}</span>
                                    </button>
                                    <Close
                                        className="suggest-btn-close"
                                        onClick={() => {
                                            deleteHistorySearch(q)
                                        }}
                                    />
                                </div>
                            )
                        })
                    )}
                <hr />
                <div className="suggest-title">Hot/trending game</div>
                <div className="">
                    {defaultSuggest.map(({ name }) => {
                        return (
                            <button
                                key={name}
                                className="suggest-btn"
                                onClick={(e) => {
                                    handleSearch(e, name)
                                }}
                            >
                                <TrendingUp sx={{
                                    fontSize: "2rem",
                                    color: "var(--brand-500)"
                                }}/>
                                <span>{name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>}
        </>
    )
}

export default SuggestBox