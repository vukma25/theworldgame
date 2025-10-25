import { Link } from 'react-router'

export default function Logo() {
    return (
        <Link to="/" className="logo-wrap">
            <span className="logo-badge">TWG</span>
            <div className="logo-title">
                <div className="logo-name">TheWorldGame</div>
                <div className="logo-sub">Play - Compete - Win</div>
            </div>
        </Link>
    )
}