export const EMOJI_POOL = [
    '🍎', '🍌', '🍉', '🍇', '🍓', '🍍', '🥝', '🍑',
    '🍔', '🍕', '🌭', '🍣', '🍪', '🍩', '🧁', '🍰',
    '⚽', '🏀', '🏈', '🎾', '🏐', '🎱', '🏓', '🥊',
    '🚗', '🚀', '✈️', '🚲', '🚁', '🚂', '🛵', '🚜',
    '🐶', '🐱', '🦊', '🐻', '🐼', '🐸', '🐵', '🦄',
    '🌵', '🌲', '🌻', '🌷', '🌈', '❄️', '🔥', '⭐'
];

export function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function formatTime(time) {
    if (!time) return

    return `${time.minute.toString().padStart(2, '0')}:${time.second.toString().padStart(2, '0')}`;
}