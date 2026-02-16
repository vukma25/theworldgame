import { useSelector } from "react-redux"
import { Link } from "react-router"
import { Box } from "@mui/material"
import { socials } from "./SocialPattern"

function Social({ children, link }) {

    return (
        <Link to={link}>
            {children}
        </Link>
    )
}

export default function Socials() {
    const { user_information: { socialLinks } } = useSelector((state) => state.profile)

    if (!socialLinks) return <></>

    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {Object.entries(socialLinks).map(([type, link]) => {
                if (link.length === 0) return null

                const icon = socials[type].icon
                return (<Social key={type} link={link}>
                    {icon}
                </Social>)
            }).filter(e => e)}
        </Box >
    )
}