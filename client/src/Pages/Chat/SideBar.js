import { useContext } from "react"
import { Drawer } from "@mui/material"
import ListGroup from "./ListGroup"
import { StateContext } from "./Chat"

export default function Sidebar() {
    const { sidebar, handleClose } = useContext(StateContext)

    return (
        <Drawer
            open={sidebar}
            variant={false ? "permanent" : "temporary"}
            onClose={handleClose}
            sx={{
                width: 400,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 400,
                    boxSizing: 'border-box',
                },
            }}
        >
            <ListGroup />
        </Drawer>
    )
}