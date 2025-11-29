import { useNavigate } from "react-router";
import { Button } from "@mui/material"
import '../../assets/styles/Card.css'

function Card({ title, tags, description, source }) {

    const arrow = '>';
    const navigate =  useNavigate()

    function handleRedirect(tag) {
        navigate(`/search?q=${tag.toLowerCase()}`)
    }

    function go(path) {
        navigate(`/${path.toLowerCase()}`)
    }

    return (
        <div className="card">
            <div className="card-image" style={{ backgroundImage: `url(${source})` }}></div>
            <div className="card-detail">
                <div
                    className="card-detail-logo"
                    style={{ backgroundImage: `url(${source})` }}
                ></div>
                <div className="card-detail-title">{title}</div>
                <div className="card-detail-tags flex-div">
                    {
                        tags.map(tag => (
                            <Button 
                                key={tag} 
                                className={`card-detail-tag ${tag.toLowerCase()}`}
                                size="small"
                                onClick={() => handleRedirect(tag)}
                            >{tag}
                            </Button>
                        ))
                    }
                </div>
                <p className="card-detail-description">{description}</p>
                <button
                    className="card-detail-btn flex-div"
                    onClick={() => {go(title)}}
                >
                    Play
                    <span className="card-detail-btn-arrow">{arrow}</span>
                </button>
            </div>
        </div>
    )
}

export default Card