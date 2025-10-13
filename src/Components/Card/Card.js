import { Link } from 'react-router'
import '../../assets/styles/Card.css'

function Card({ title, tags, description, source }) {

    const arrow = '>';

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
                            <div key={tag} className={`card-detail-tag ${tag.toLowerCase()}`}>{tag}</div>
                        ))
                    }
                </div>
                <p className="card-detail-description">{description}</p>
                <Link
                    to={`/games/${title.toLowerCase()}`}
                    className="card-detail-btn flex-div"
                >
                    Play
                    <span className="card-detail-btn-arrow">{arrow}</span>
                </Link>
            </div>
        </div>
    )
}

export default Card