import { useSelector, useDispatch } from "react-redux"
import { setSidebar } from "../../../redux/features/chat"
import { AppBar, Toolbar, Box, Typography, IconButton } from "@mui/material"
import BadgeAvatar from "../../../Components/BadgeAvatar/BadgeAvatar"
import { Group, MoreVert } from "@mui/icons-material"

export default function Header() {
    const { selectedConversation } = useSelector((state) => state.event)
    const dispatch = useDispatch()

    function handleOpenSidebar() {
        dispatch(setSidebar(true))
    }

    return (
        <AppBar position="static">
            <Toolbar sx={{
                display: "flex", justifyContent: "space-between",
                background: "linear-gradient(135deg, var(--brand-500), var(--brand-700))"
            }}>
                {selectedConversation ?
                    (<Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <BadgeAvatar username={selectedConversation.name} src={selectedConversation.avatar} online={false}/>
                        <Typography variant='h6'>{selectedConversation.name}</Typography>
                    </Box>)
                    : <Typography variant='h6'>Select a group to chat</Typography>
                }
                <Box sx={{display:"flex",alignItems:"center"}}>
                    <IconButton onClick={handleOpenSidebar}>
                        <Group sx={{fontSize:"2.5rem",color:"var(--cl-white-pure)"}} />
                    </IconButton>
                    <IconButton onClick={() => {}}>
                        <MoreVert sx={{fontSize:"2.5rem",color:"var(--cl-white-pure)"}} />
                    </IconButton>
                </Box>

            </Toolbar>
        </AppBar>
    )
}