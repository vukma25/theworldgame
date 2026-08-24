import { Box, Typography, Skeleton } from '@mui/material'

export default function MessageSkeleton({ process }) {
    return (
        <Box sx={{ width: "100%", display: "flex", alignItems: "start", gap: ".5rem", justifyContent: "flex-end" }}>
            <Box sx={{ position: "relative" }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <svg width={100} height={100} viewBox='0 0 100 100'>
                        <circle cx={50} cy={50} r={25} stroke="var(--cl-primary-blue)"
                            strokeWidth={5}
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 25 * (process / 100)} ${2 * Math.PI * 25 * (1 - process / 100)}`}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)" />
                        <text
                            x="50"
                            y="53"
                            textAnchor="middle"
                            fontSize="12"
                            fontWeight="bold"
                            fill="var(--cl-primary-blue)"
                        >
                            {process}%
                        </text>
                    </svg>
                </Box>
                <Skeleton variant='rectangular' width={300} height={300} sx={{ borderRadius: "1.5rem .5rem 1.5rem 1.5rem" }} />
            </Box>
            <Skeleton variant='circular' width={30} height={30} />
        </Box>
    )
}