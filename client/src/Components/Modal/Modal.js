import { useDispatch } from 'react-redux'
import { close } from "../../redux/features/modal"
import '../../assets/styles/modal.css'

export default function Modal({ children }) {
    const dispatch = useDispatch()

    function closeModal(e) {
        if (e.target.id === "modal") {
            dispatch(close())
        }
    }

    return (
        <div 
            id="modal" 
            className="modal"
            onClick={closeModal}
        >
            {children}
        </div>
    )
}