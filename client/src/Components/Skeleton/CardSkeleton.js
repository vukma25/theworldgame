import { Skeleton, Stack } from '@mui/material'

export default function Variants() {
    return (
        <Stack spacing={1} sx={{ p: 1 }}>
            <Skeleton variant="rectangular" width={"100%"} height={80} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton sx={{ fontSize: '1rem' }} variant="text" />
            <Skeleton sx={{ fontSize: '1rem', width: "80%" }} variant="text" />
            <Skeleton variant="rounded" width={100} height={30} />
        </Stack>
    );
}
