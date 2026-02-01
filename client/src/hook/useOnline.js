import { useCallback } from "react"
import { useSelector } from "react-redux"

export const useOnline = () => {
    const { usersOnline } = useSelector((state) => state.event)

    const isOnline = useCallback((id) => {
        if (!id) return false

        return !!usersOnline.find(([userId, _]) => userId.toString() === id.toString())
    }, [usersOnline])

    return isOnline
}