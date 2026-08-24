import EmojiPicker from "emoji-picker-react"

const configDefault = {
    open: false,
    theme: "light",
    emojiStyle: "facebook",
    lazyLoadEmojis: true,
    autoFocusSearch: true,
    skinTonesDisabled: true
}

const style = {
    position: "absolute",
    top: "-40rem",
    left: ".5rem"
}

export default function Picker({ conf = {}, getEmoji }) {
    return <EmojiPicker
        {...{ ...configDefault, ...conf }}
        style={style}
        onEmojiClick={getEmoji} />
}