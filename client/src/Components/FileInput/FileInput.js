import { Fragment, useRef } from "react"
import { IconButton } from "@mui/material"

export default function FileInput({ children, sx, name, loading, uploadAction, fileType = "image/png, image/jpeg, , .png, .jpg, .jpeg" }) {
    const fileRef = useRef(null)
    const btnRef = useRef(null)

    function fakeFileInput() {
        if (!fileRef.current) return
        fileRef.current.click()
    }

    function chooseImage(e) {
        const file = e.target.files[0]
        if (file && btnRef.current) {
            btnRef.current.click()
        }
    }

    return (
        <Fragment>
            <IconButton
                sx={{ ...sx }}
                onClick={fakeFileInput}
                disabled={loading}
            >
                {children}
            </IconButton>
            <form
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    overflow: "hidden",

                }}
                encType="multipart/form-data"
                onSubmit={uploadAction}
            >
                <input
                    type="file"
                    name={name}
                    ref={fileRef}
                    accept={fileType}
                    onChange={chooseImage}
                />
                <button type='submit' ref={btnRef}></button>
            </form>
        </Fragment>
    )
}