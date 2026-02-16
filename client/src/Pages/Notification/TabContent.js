import { Fragment } from "react"
import { Chip } from '@mui/material'
import Friend from './Type/Friend'
import Info from './Type/Info'

export default function TabContent({ content, tab }) {
    return (
        <Fragment>
            {
                content.length !== 0 ?
                    content.map(({ title, content, reveal }) => {
                        if (tab === 0) {
                            return (
                                <Friend key={reveal.id} title={title} content={content} reveal={reveal} />
                            )
                        } else {
                            return <Info key={reveal.id} title={title} content={content} reveal={reveal} />
                        }
                    }) :
                    <Chip label="No any notification" sx={{ width: "90%", margin: "2rem auto" }} />
            }
        </Fragment>
    )
}