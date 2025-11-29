import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom';
import { CircularProgress } from '@mui/material'
import Navbar from '../../Components/Navbar/Navbar'
import Card from '../../Components/Card/Card'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import { games } from './data'
import '../../assets/styles/SearchPage.css';

function Search() {

    const [searchParams] = useSearchParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const query = searchParams.get('q');

    useEffect(() => {
        if (query) {
            fetchSearchResults(query);
        }
    }, [query]);

    const fetchSearchResults = async (searchQuery) => {
        setLoading(true);
        try {
            const query = searchQuery.split("+").join(" ");

            // Tạo promise để có thể await
            await new Promise(resolve => setTimeout(resolve, 1500));

            const data = games.filter(({ name, tags }) => {
                return (
                    name.toLowerCase().includes(query.toLowerCase()) ||
                    tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                );
            });

            setResults(data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            {loading && 
            <div className="search-overlay flex-div">
                <CircularProgress className='overlay-loading'/>
            </div>}
            {results.length > 0 ? 
            <div className="searchpage">
                {
                    results.map((e, index) => {
                        return <Card
                            key={index}
                            title={e.name}
                            tags={e.tags}
                            description={e.description}
                            source={e.source}
                        />
                    })
                }
                <GoTopBtn />
            </div> : 
            <div className='expect flex-div'>
                <p className='expect-des'>No result can be found</p>
                <Link className='expect-return' to="/">Go Home</Link>
            </div>
            }
        </>
    );
}

export default Search