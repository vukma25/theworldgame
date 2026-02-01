

import { Box, Tabs, Tab } from "@mui/material"
import { Person, Group } from "@mui/icons-material"

export default function TabBar({ tabValue, handleTabChange }) {

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab icon={<Person />} label="Detail" />
                <Tab icon={<Group />} label={`Friends`} />
            </Tabs>
        </Box>
    )
}