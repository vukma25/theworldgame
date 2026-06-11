import { Container, Grid, Skeleton } from "@mui/material"
import BackBtn from "../BackBtn/Back"

export default function ProfileSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <BackBtn />
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Skeleton variant="circle"       <Skeleton variant="rectangular" />
                </Grid>
 />
                    <Skeleton variant="text" />
                    <Skeleton variant="rounded" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" />
             
                <Grid size={{ xs: 12, md: 8 }}>
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="rounded" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" />
                    <Skeleton variant="rectangular" />
                </Grid>
            </Grid>
        </Container>
    )
}