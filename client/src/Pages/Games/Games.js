import { Fragment, useEffect, useState } from 'react';
import { Box, Typography } from "@mui/material"
import Card from '../../Components/Card/Card'
import Back from '../../Components/BackBtn/Back';
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import CardSkeleton from '../../Components/Skeleton/CardSkeleton'
import '../../assets/styles/Game.css';
import api from '../../lib/api';

export default function Game() {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadGame() {
            try {
                setLoading(true)
                const res = await api.get("/game/info", { withCredentials: true });
                setGames(res.data.games)
            } catch (error) {
                return
            } finally {
                setLoading(false)
            }
        }
        loadGame()
    }, [])

    return (
        <Fragment>
            <Box sx={{
                display: "flex", gap: 1, width: "100%", alignItems: "center", p: "2rem 0 0 1.5rem"
            }}>
                <Back />
                <Typography variant='h5' sx={{ fontSize: "2rem" }}>Games</Typography>
            </Box>
            <div className="gamepage">
                {
                    games.map(({ _id, name, description, source, tags }) => {
                        return <Card
                            key={_id}
                            title={name}
                            tags={tags}
                            description={description}
                            source={source}
                        />
                    })
                }
                {loading && (
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
                        .map((e) => <CardSkeleton key={e} />)
                )}
            </div>
            <GoTopBtn />
        </Fragment>
    )
}