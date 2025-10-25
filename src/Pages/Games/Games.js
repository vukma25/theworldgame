
import Card from '../../Components/Card/Card'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import { games } from './data'
import '../../assets/styles/Game.css';

export default function Game () {

    return (
        <div className="gamepage">
            {
                games.map((e, index) => {
                    return <Card 
                        key={index}
                        title={e.name}
                        tags={e.tags}
                        description = {e.description}
                        source={e.source}
                    />
                })
            }
            <GoTopBtn />
        </div>
    )
}