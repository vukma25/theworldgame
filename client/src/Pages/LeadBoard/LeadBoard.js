import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Card, CardHeader, InputLabel, Divider,
    CircularProgress, Box, Select, MenuItem, FormControl,
} from '@mui/material';
import { Add, Flag } from '@mui/icons-material';
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import CustomizedMenus from '../../Components/StyledMenu/StyleMenu';
import api from '../../lib/api';
import BadgeAvatar from '../../Components/BadgeAvatar/BadgeAvatar';
import { sendRequestFriend } from '../../redux/features/user';
import { sendSignalClose } from '../../redux/features/menu'
import { useOnline } from '../../hook/useOnline';

function CardHeaderActions({ userId }) {
    const { user: { _id, friends } } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const relationship = [...friends, _id.toString()]
    const hasRelationship = relationship.some(id => id === userId.toString())

    function send(id, userId) {
        try {
            dispatch(sendRequestFriend({ id, userId }))
        } catch (error) {
            console.log(error)
        }
    }

    function handleClose() {
        dispatch(sendSignalClose())
    }

    if (hasRelationship) {
        return (<></>)
    }

    return (
        <CustomizedMenus hasShadow={true}>
            <MenuItem onClick={() => {
                send(user._id, userId)
                handleClose()
            }} disableRipple>
                <Add />
                Add friend
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
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

    async function getUser() {
        try {
            const response = await api.get('/user/getAllUser', { withCredentials: true })
            if (!response?.data?.users) {
                throw new Error("Get all user failed")
            }

            setUsers(response.data.users)
        } catch (error) {
            console.log("Get all user failed")
        }
    }

    useEffect(() => {
        getUser()
    }, [game])

    if (!users) {
        return (
            <CircularProgress />
        )
    }

    return (
        <Fragment>
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
                {users.map((e, index) => {
                    const { _id, username, avatar } = e

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
                                />
                            }
                            action={<CardHeaderActions userId={_id} />}
                            title={username}
                            subheader="2805"
                        />
                    </Card>)
                })}
            </Box>
            <GoTopBtn />
        </Fragment>
    )
}
