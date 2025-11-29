import { useSelector, useDispatch } from 'react-redux'
import { useState, useEffect, useCallback, createContext } from 'react'
import { Outlet } from 'react-router-dom'
import { ChessGame } from './Function'
import BAP from './BoardAndPiece/BAP'
import MoveList from './MoveList'
import ChessModeSelector from './ChessModeSelector'
import GoTopBtn from '../../Components/GoTopBtn/GoTopBtn'
import Logger from '../../Components/Logger/Logger'
import ChessBot from './chessBot'
import '../../assets/styles/Chess.css'
import ChessSettings from './ChessSettings'
import PlayerInfoPanel from './PlayerInfoPanel'
import { setChess, setSettings, setStatus } from '../../redux/features/chess'
import { open, close } from '../../redux/features/modal'
import ChessModal from './ChessModal'
import Modal from '../../Components/Modal/Modal'

export const ChessContext = createContext()

export default function Chess() {
    const { chess, mode, settingsBoard, settings, playerSide } = useSelector((state) => state.chess)
    const { user } = useSelector((state) => state.auth)
    const modal = useSelector((state) => state.modal)
    const dispatch = useDispatch()
    const [log, setLog] = useState({
        "message": "",
        "type": "info"
    })

    const swap = useCallback(() => {
        chess.modifyDirection()
        dispatch(setChess(chess))
    }, [chess])

    useEffect(() => {
        if (!chess) {
            dispatch(setChess(new ChessGame()))

            const theme = JSON.parse(localStorage.getItem("chess-theme"))
            if (theme) {
                dispatch(setSettings(theme))
            }
        }
    }, [])

    useEffect(() => {
        if (chess?.status === "preparing") return

        if (settings.autoRotate) {
            swap()
        }
    }, [chess?.turn])

    useEffect(() => {
        if (chess?.hasCheckmate?.checkmate) {
            if (chess.hasCheckmate.by === playerSide) {
                dispatch(setStatus({
                    cur: 'win',
                    des: 'By checkmate'
                }))
            }
            else {
                dispatch(setStatus({
                    cur: 'lose',
                    des: 'By checkmate'
                }))
            }
            dispatch(open())
        }
        else if (chess?.isDraw?.draw) {
            dispatch(setStatus({
                cur: 'draw',
                des: chess.isDraw.reason
            }))
            dispatch(open())
        }
    }, [chess])

    useEffect(() => {
        if (chess) {
            dispatch(setChess(chess.getInit()))
        }
        dispatch(close())
    }, [])

    if (!chess) {
        return (<></>)
    }

    return (
        <ChessContext.Provider value={{ user }}>
            <div className="chess">
                <div className="chess-left-area flex-div">
                    <PlayerInfoPanel swap={swap} />
                    <BAP />
                </div>
                {chess.status === 'playing' &&
                    <MoveList />}
                {chess.status === 'preparing' &&
                    <ChessModeSelector setLog={setLog} />}
                {mode?.type === 'bot' &&
                    <ChessBot />}
                {settingsBoard && <ChessSettings />}
                {modal.value && <Modal>
                    <ChessModal />
                </Modal>}
                <Logger log={log} setLog={setLog} />
            </div>
            <GoTopBtn />
            <Outlet />
        </ChessContext.Provider>
    )
}
