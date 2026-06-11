import { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Card, CardHeader, InputLabel,
    CircularProgress, Box, Select, MenuItem, FormControl,
    Typography, Chip
} from '@mui/material';
import { Flag } from '@mui/icons-material';
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import CustomizedMenus from '../../Components/StyledMenu/StyleMenu';
import api from '../../lib/api';
import BadgeAvatar from '../../Components/BadgeAvatar/BadgeAvatar';
import Back from '../../Components/BackBtn/Back'
import { sendSignalClose } from '../../redux/features/menu'
import { useOnline } from '../../hook/useOnline';

function CardHeaderActions({ userId }) {
    const dispatch = useDispatch()

    function handleClose() {
        dispatch(sendSignalClose())
    }

    return (
        <CustomizedMenus hasShadow={true}>
            <MenuItem onClick={handleClose} disableRipple>
                <Flag />
                Report for cheating
            </MenuItem>
        </CustomizedMenus>
    )
}

export default function LeadBoard() {
    const isOnline = useOnline()

    const [users, setUsers] = useState([])
    const [game, setGame] = useState('chess')

    function selectGame(e) {
        setGame(e.target.value)
    }

    useEffect(() => {
        async function getTopPlayer() {
            try {
                const response = await api.post(`/leaderboard/${game}/top-player`, {
                    difficulty: "easy"
                }, { withCredentials: true })
                setUsers(response.data.top)
            } catch (error) {
                console.log("Get all user failed")
                setUsers([])
            }
        }
        getTopPlayer()
    }, [game])

    if (!users) {
        return (
            <CircularProgress />
        )
    }

    return (
        <Fragment>
            <Box sx={{
                display: "flex", gap: 1, width: "90%",
                margin: "1rem auto", alignItems: "center"
            }}>
                <Back />
                <Typography variant='h5' sx={{ fontSize: "1.75rem" }}>Leaderboard</Typography>
            </Box>

            <Box sx={{
                width: "100%",
                minWidth: "40rem",
                display: "flex",
                alignItems: "center",
                gap: ".5rem",
                flexDirection: "column",
                cursor: "pointer",
                margin: "3rem 0"
            }}>
                <FormControl sx={{ width: "90%", display: "flex" }}>
                    <InputLabel
                        id="select-game-top-player"
                        sx={{ fontSize: "1.25rem" }}
                    >Game</InputLabel>
                    <Select
                        sx={{ width: "20rem", fontSize: "1.25rem" }}
                        label={"Game"}
                        labelId="select-game-top-player"
                        value={game}
                        onChange={selectGame}
                    >
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"chess"}>Chess</MenuItem>
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"caro"}>Caro</MenuItem>
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"fastfinger"}>Fast Finger</MenuItem>
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"snake"}>Snake</MenuItem>
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"sudoku"}>Sudoku</MenuItem>
                        <MenuItem sx={{ fontSize: "1.25rem" }} value={"minesweeper"}>Minesweeper</MenuItem>
                    </Select>
                </FormControl>
                {users.length === 0 &&
                    <Chip label="No data" sx={{ width: "90%", margin: "2rem auto" }} />}
                {users.map(({ player, stats }, index) => {
                    const { _id, username, avatar } = player

                    return (<Card sx={{ width: "90%" }} key={index}>
                        <CardHeader
                            sx={{
                                '&:hover': {
                                    background: "var(--brand-500)",
                                    '& .MuiCardHeader-content span': { color: "var(--cl-white-pure)" }
                                },
                                '& .MuiCardHeader-content span': { fontSize: "1.4rem" }
                            }}
                            avatar={
                                <BadgeAvatar
                                    username={username}
                                    src={avatar}
                                    online={isOnline(_id)}
                                    id={_id}
                                />
                            }
                            action={<CardHeaderActions userId={_id} />}
                            title={username}
                            subheader={stats.time}
                        />
                    </Card>)
                })}
            </Box>
            <GoTopBtn />
        </Fragment>
    )
}
