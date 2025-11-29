
import { useRouteError, Link, useNavigate } from 'react-router-dom';
import { Warning } from '@mui/icons-material'
import '../../assets/styles/ErrorPage.css'

function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();

    console.error('Routing Error:', error);

    const handleReload = () => {
        window.location.reload();
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="error-container">
            <div className="error-content">
                <div className="error-icon">
                    <Warning sx={{fontSize:"5rem",color:"var(--cl-red-flag)"}}/>
                </div>

                <h1 className="error-title">
                    {error?.status === 404 ? 'Page Not Found' : 'Something Went Wrong'}
                </h1>

                <p className="error-message">
                    {error?.statusText || error?.message ||
                        "An unexpected error has occurred. Please try again later."}
                </p>

                <div className="action-buttons">
                    <button onClick={handleReload} className="reload-button">
                        Reload Page
                    </button>

                    <button onClick={handleGoBack} className="back-button">
                        Go Back
                    </button>

                    <Link to="/" className="home-button">
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;