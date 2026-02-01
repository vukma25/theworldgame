import { Box, Grid, Paper, Typography } from "@mui/material"

export default function ViewMode({ info }) {

    const { bio, socialLinks, ...other } = info

    function Field(field, value) {
        return (
            <Grid key={field} size={{ xs: 12, sm: 6 }}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {field}
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                        {value}
                    </Typography>
                </Paper>
            </Grid>
        )
    }

    return (
        <Box>
            <Grid container spacing={2}>
                {
                    Object.keys(other).map((field) => {
                        return Field(field, info[field])
                    })
                }
            </Grid>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Bio
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {bio}
                </Typography>
            </Paper>
        </Box>
    )
}