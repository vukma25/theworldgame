function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export default function stringAvatar(name, style={}) {
    let res = {
        sx: {
            bgcolor: stringToColor(name),
            ...style
        },
    }
    const parts = name.split(' ')
    if (parts.length === 1) {
        res["children"] = `${name[0]}`
    }
    else if (parts.length > 1) {
        res["children"] = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }

    return res
}