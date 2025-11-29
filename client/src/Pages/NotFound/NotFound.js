
import { useRouteError, Link } from 'react-router';
import '../../assets/styles/NotFound.css'

function NotFound() {
    const error = useRouteError();

    return (
        <div className="not-found-container">
            <div className="not-found-content flex-div">
                <div className="error-code">{error?.status || "404"}</div>

                <h1 className="error-title">Page Not Found</h1>

                <p className="error-message">
                    {error?.statusText || error?.message ||
                        "The page you are looking for doesn't exist or has been moved."}
                </p>

                <div className="action-buttons">
                    <Link to="/" className="home-button">
                        Go Back Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="back-button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;