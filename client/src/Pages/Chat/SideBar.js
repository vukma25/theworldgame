import { useSelector, useDispatch } from "react-redux"
import { setSidebar } from "../../redux/features/chat"
import { Drawer } from "@mui/material"
import ListGroup from "./ListGroup"

export default function Sidebar() {
    const { sidebar } = useSelector((state) => state.chat)
    const dispatch = useDispatch()

    function handleCloseSidebar() {
        dispatch(setSidebar(false))
    }

    return (
        <Drawer
            open={sidebar}
            variant={false ? "permanent" : "temporary"}
            onClose={handleCloseSidebar }
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