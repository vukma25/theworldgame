import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@mui/material/Icon'
import { data, defaultSuggest } from './data'
import '../../assets/styles/SuggestBox.css'

function SuggestBox({ suggestBox, setSuggestBox, query, setQuery, storage, setStorage }) {

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

    function handleSearch(e, name) {
        e.preventDefault()
        const q = name.trim();
        const convertQuery = q.replaceAll(/\s+/g, "+")
        navigate(`/search?q=${convertQuery}`)

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
                    <p>Gợi ý</p>
                    <Icon
                        onClick={() => { setSuggestBox(false) }}
                    >close</Icon>
                </div>
                <div className="suggest-title">{query.length === 0 ? "Recent search" : "Results"}</div>
                {query.length !== 0 ? (
                    figure.length === 0 ?
                        <p className="suggest-btn">Không tìm thấy kết quả nào</p> :
                        figure.map(({ name }) => {
                            return (
                                <button
                                    key={name}
                                    className="suggest-btn"
                                    onClick={(e) => {
                                        handleSearch(e, name)
                                        setQuery(name)
                                        setSuggestBox(false)
                                    }}
                                >
                                    <Icon sx={{
                                        fontSize: "2rem",
                                        color: "var(--brand-500)"
                                    }}>search</Icon>
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
                                            setQuery(q)
                                            setSuggestBox(false)
                                        }}
                                    >
                                        <Icon sx={{
                                            fontSize: "2rem",
                                            color: "var(--brand-500)"
                                        }}>history</Icon>
                                        <span>{q}</span>
                                    </button>
                                    <Icon
                                        className="suggest-btn-close"
                                        onClick={() => {
                                            deleteHistorySearch(q)
                                        }}
                                    >close</Icon>
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
                                    setQuery(name)
                                    setSuggestBox(false)
                                }}
                            >
                                <Icon sx={{
                                    fontSize: "2rem",
                                    color: "var(--brand-500)"
                                }}>trending_up</Icon>
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