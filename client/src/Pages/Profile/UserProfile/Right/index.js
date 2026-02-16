import { useState, useMemo, createContext } from "react"
import { useSelector } from "react-redux"
import { Card, CardHeader, CardContent, Divider } from "@mui/material"
import Title from "./Title"
import Tabs from './TabBar'
import EditMode from "./PersonalInfo/EditMode"
import ViewMode from "./PersonalInfo/ViewMode"
import FriendList from "./FriendList"

export const ProfileContext = createContext()

export default function RightPart() {
    const { user_information } = useSelector((state) => state.profile)
    const [tabValue, setTabValue] = useState(0)
    const [mode, setMode] = useState("view")

    const handleTabChange = (event, newValue) => {
        if (newValue === 1) { setMode("unset") }
        else { setMode("view") }
        setTabValue(newValue);
    };

    const info = useMemo(() => {
        const { username, role, bio, email, socialLinks } = user_information
        return { username, role, email, socialLinks, bio: bio || "" }
    }, [user_information])

    return (
        <ProfileContext.Provider value={{ mode, setMode }}>
            <Card>
                <CardHeader title={<Title />} />
                <Divider />
                <Tabs tabValue={tabValue} handleTabChange={handleTabChange} />
                <CardContent>
                    {tabValue === 0 && mode !== "unset" && (
                        mode === "view" ?
                            <ViewMode info={info} /> :
                            <EditMode info={info} />
                    )}

                    {tabValue === 1 && <FriendList />}
                </CardContent>
            </Card>
        </ProfileContext.Provider>
    )
}