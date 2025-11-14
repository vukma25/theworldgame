import { useState } from "react"
import { Button } from "@mui/material"
import { Close } from "@mui/icons-material"

export default function Instruction() {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <Button
                variant="contained"
                onClick={() => {setIsOpen(true)}}
                className="instruction-btn"       
            >Instruction</Button>
        )
    }

    return (
        <div className="instruction-general">
            <div className="title flex-div">
                Quick instruction
                <Close onClick={() => { setIsOpen(false) }}/>
            </div>
            <p className="overall"><strong>Note:</strong> Each 200 score, speed will be automatically decrease</p>
            <div className="instruction-block">
                <h2 className="title">For PC</h2>
                <div className="control-key">
                    <div className="keys">
                        <kbd className="kdb">W</kbd>
                        <p>or</p>
                        <kbd className="kdb">UP</kbd>
                    </div>
                    <p className="control">Turn up</p>
                </div>
                <div className="control-key">
                    <div className="keys">
                        <kbd className="kdb">A</kbd>
                        <p>or</p>
                        <kbd className="kdb">LEFT</kbd>
                    </div>
                    <p className="control">Turn left</p>
                </div>
                <div className="control-key">
                    <div className="keys">
                        <kbd className="kdb">S</kbd>
                        <p>or</p>
                        <kbd className="kdb">DOWN</kbd>
                    </div>
                    <p className="control">Turn down</p>
                </div>
                <div className="control-key">
                    <div className="keys">
                        <kbd className="kdb">D</kbd>
                        <p>or</p>
                        <kbd className="kdb">RIGHT</kbd>
                    </div>
                    <p className="control">Turn right</p>
                </div>
            </div>
            <div className="instruction-block">
                <h2 className="title">For mobile</h2>
                <p className="description">
                    If you use mobile phone, you can see some buttons under board snake. Let click on them to control snake
                </p>
            </div>
        </div>
    )
}