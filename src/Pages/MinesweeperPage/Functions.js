
// Levels of game
export const levels = [
    {
        'level': 0,
        'row': 0,
        'col': 0,
        'proportion': 0,
        'mine': 0,
        'flag': 0,
        'setTime': {
            isTime: true,
            duration: 0
        },
        'cells': []
    },
    {
        'level': 1,
        'row': 10,
        'col': 10,
        'proportion': 1.5,
        'mine': 15,
        'flag': 15,
        'setTime': {
            isTime: true,
            duration: 300
        },
        'cells': new Array(100).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 2,
        'row': 15,
        'col': 15,
        'proportion': 2.5,
        'mine': 37,
        'flag': 37,
        'setTime': {
            isTime: true,
            duration: 420
        },
        'cells': new Array(225).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 3,
        'row': 25,
        'col': 25,
        'proportion': 4,
        'mine': 100,
        'flag': 100,
        'setTime': {
            isTime: true,
            duration: 600
        },
        'cells': new Array(625).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        })
    },
    {
        'level': 4,
        'row': 20,
        'col': 20,
        'proportion': 1.5,
        'mine': 30,
        'flag': 30,
        'setTime': {
            isTime: true,
            duration: 600
        },
        'cells': new Array(400).fill({
            opened: false,
            flag: false,
            isMine: false,
            mine: 0
        }),
        'hidden': false
    }
]


//Custom marks of Slider component
export const marks = [
    {
        value: 1.5,
        label: <label className="easy-green">Easy</label>
    },
    {
        value: 2.5,
        label: <label className="medium-purple">Medium</label>
    },
    {
        value: 4,
        label: <label className="hard-red">Hard</label>
    }
];

//logic game functions

export function convertToMinute(seconds) {
    return `${Math.floor(seconds / 60)}m`
}

export const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export const countDownClock = (clock) => {

    return true
}

//Construction of cells
// 'cells': new Array(size).fill({
//     opened: false,
//     flag: false,
//     isMine: false,
//     mine: 0
// })

function generateMines(initRow, initCol, rows, cols, mines, cells) {
    const minesPosition = new Set()


    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            minesPosition.add(`${initRow + i}, ${initCol + j}`)
        }
    }

    while (minesPosition.size < mines + 9) {
        const row = Math.floor(Math.random() * rows)
        const col = Math.floor(Math.random() * cols)

        if (!minesPosition.has(`${row}, ${col}`)) {
            minesPosition.add(`${row}, ${col}`)
            cells[row * cols + col].isMine = true
        }
    }
    return cells
}

function countMineAround(row, col, rows, cols, cells) {

    let count = 0
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue

            if (
                !((row + i < 0) || (row + i >= rows)) &&
                !((col + j < 0) || (col + j >= cols))
            ) {
                let cell = cells[(row + i) * cols + (col + j)]

                if (cell.isMine) {
                    count++;
                }
            }
        }
    }


    return count
}

function revealEmptyCells(row, col, rows, cols, cells) {

    function recursion(r, c) {
        if (cells[r * cols + c].isMine) return

        let mines = countMineAround(r, c, rows, cols, cells)
        cells[r * cols + c].opened = true

        if (mines > 0) {
            cells[r * cols + c].mine = mines
            return
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (
                        !((r + i < 0) || (r + i >= rows)) &&
                        !((c + j < 0) || (c + j >= cols)) &&
                        !(i === 0 && j === 0)
                    ) {
                        if (!cells[(r + i) * cols + (c + j)].opened &&
                            !cells[(r + i) * cols + (c + j)].flag) {
                            recursion(r + i, c + j)
                        }
                    }
                }
            }
        }
    }
    recursion(row, col)

    return cells

}

function checkWin(copyCells) {
    let isWin = (copyCells.cells.filter(cell => {
        return cell.isMine && cell.flag
    }).length === copyCells.flag) ||
        (copyCells.cells.filter(cell => {
            return cell.opened || cell.isMine
        }).length === copyCells.cells.length)


    if (isWin) {
        copyCells.gameOver = true
        copyCells.message = 'So peak! You won the game'
    }

    return copyCells
}

//Click cell for desktop
export function handleClickCell(index, copySettings) {

    if (copySettings.gameOver || 
        copySettings.cells[index].flag ||
        (copySettings.level === 4 && !copySettings.isInGame)
    ) {
        if (copySettings.cells[index].flag) {
            copySettings.logError = 'This cell had flag! You can not active it'
            return copySettings
        }
        if (copySettings.level === 4){
            copySettings.logError = 'You have not confirm settings yet'
            return copySettings
        }

        return copySettings
    }

    if (copySettings.cells[index].isMine) {
        copySettings.gameOver = true
        copySettings.message = 'Oh no! You accidentally clicked on the mine'
        return copySettings
    }

    if (copySettings.cells[index].opened || copySettings.cells[index].flag) {
        return copySettings
    }

    const [row, col] = [
        Math.floor(index / copySettings.col),
        index % copySettings.col
    ]

    copySettings.logError = ''
    if (copySettings.firstClick) {

        copySettings.cells = revealEmptyCells(
            row,
            col,
            copySettings.row,
            copySettings.col,
            generateMines(
                row,
                col,
                copySettings.row,
                copySettings.col,
                copySettings.mine,
                copySettings.cells
            )
        )

        return copySettings

    } else {

        copySettings.cells = revealEmptyCells(
            row,
            col,
            copySettings.row,
            copySettings.col,
            copySettings.cells
        )

        copySettings = checkWin(copySettings)
        return copySettings
    }

}

export function handleToggleFlag(index, copySettings) {

    if (
        ((copySettings.cells[index].opened ||
            copySettings.mine === 0) &&
            !copySettings.cells[index].flag) ||
        copySettings.gameOver
    ) {
        if (copySettings.cells[index].opened) {
            copySettings.logError = 'This cell was opened! You can not active it'
        }
        else if (copySettings.mine === 0) {
            copySettings.logError = 'You have reached the limit of flags'
        }

        return copySettings
    }

    copySettings.cells[index].flag = !copySettings.cells[index].flag

    //Upgrade flag
    if (copySettings.cells[index].flag) {
        copySettings.mine -= 1
    } else {
        copySettings.mine += 1
    }
    copySettings = checkWin(copySettings)
    return copySettings
}

// end logic

//responsive for tool
export function gridTemplateColumns(index, rows, cols, top, left) {
    const [row, col] = [
        Math.floor(index / cols),
        index % cols
    ]

    if (col === cols - 1 && row === rows - 1) {
        return {
            gridTemplateAreas: `
                "close open"
                "flag ."
            `,
            top: `${top - 40}px`,
            left: `${left - 40}px`
        }
    }

    if (col === cols - 1) {
        return {
            gridTemplateAreas: `
                "flag ."
                "close open"
            `,
            top: `${top}px`,
            left: `${left - 40}px`
        }
    }

    if (row == rows - 1) {
        return {
            gridTemplateAreas: `
                "open close"
                ". flag"
            `,
            top: `${top - 40}px`,
            left: `${left}px`
        }
    }

    else {
        return {
            gridTemplateAreas: `
                ". open"
                "flag close"
            `,
            top: `${top}px`,
            left: `${left}px`
        }
    }
}





