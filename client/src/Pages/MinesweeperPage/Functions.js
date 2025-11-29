import open_sound from '../../assets/sound/minesweeper/notify.mp3'
import explosion_sound from '../../assets/sound/minesweeper/explosion.mp3'
import bind_flag_sound from '../../assets/sound/minesweeper/bind-flag.mp3'

const open = new Audio(open_sound)
const explosion = new Audio(explosion_sound)
const bindFlag = new Audio(bind_flag_sound)
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

//Construction of cells
// 'cells': new Array(size).fill({
//     opened: false,
//     flag: false,
//     isMine: false,
//     mine: 0
// })

function soundEffectOpen() {
    open.currentTime = 0
    open.play()
}
function soundEffectExplosion() {
    explosion.currentTime = 0
    explosion.play()
}
function soundEffectBindFlag() {
    bindFlag.currentTime = 0
    bindFlag.play()
}

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

export function isWin(copyCells){
    let isWin = (copyCells.cells.filter(cell => {
        return cell.isMine && cell.flag
    }).length === copyCells.mine) ||
        (copyCells.cells.filter(cell => {
            return cell.opened || cell.isMine
        }).length === copyCells.cells.length)

    return isWin
}

function checkWin(copyCells) {
    let isWin = (copyCells.cells.filter(cell => {
        return cell.isMine && cell.flag
    }).length === copyCells.mine) ||
        (copyCells.cells.filter(cell => {
            return cell.opened || cell.isMine
        }).length === copyCells.cells.length) 

    if (isWin) {
        copyCells.gameOver = true
        copyCells.message = 'So peak! You won the game'
    }

    return copyCells
}

function clearFlag(cells) {
    return cells.map(e => {
        return {
            ...e,
            'flag': false
        }
    })
}

function deepCopy(instance) {
    return {
        ...instance,
        'setTime': {
            ...instance.setTime
        },
        'cells': instance.cells.map(cell => ({...cell})),
        'tool': {
            ...instance.tool,
            'style': {
                ...instance.tool.style
            }
        }
    }
}

//Click cell for desktop
export function handleClickCell(index, minesweeper) {
    let copy = deepCopy(minesweeper)


    if (copy.gameOver || 
        copy.cells[index].flag ||
        (copy.level === 4 && !copy.isInGame)
    ) {
        if (copy.cells[index].flag) {
            copy.logError = 'This cell had flag! You can not active it'
            return copy
        }
        if (copy.level === 4){
            copy.logError = 'You have not confirm settings yet'
            return copy
        }

        return copy
    }

    if (copy.cells[index].isMine) {
        soundEffectExplosion()
        copy.gameOver = true
        copy.message = 'Oh no! You accidentally clicked on the mine'
        return copy
    }

    if (copy.cells[index].opened || copy.cells[index].flag) {
        return copy
    }

    soundEffectOpen()

    const [row, col] = [
        Math.floor(index / copy.col),
        index % copy.col
    ]

    copy.logError = ''
    if (copy.firstClick) {

        copy.cells = revealEmptyCells(
            row,
            col,
            copy.row,
            copy.col,
            generateMines(
                row,
                col,
                copy.row,
                copy.col,
                copy.mine,
                clearFlag(copy.cells)
            )
        )
        copy.flag = copy.mine

        return copy

    } else {

        copy.cells = revealEmptyCells(
            row,
            col,
            copy.row,
            copy.col,
            copy.cells
        )

        copy = checkWin(copy)
        return copy
    }

}

export function handleToggleFlag(index, minesweeper) {
    let copy = deepCopy(minesweeper)

    if (
        ((copy.cells[index].opened ||
            copy.flag === 0) &&
            !copy.cells[index].flag) ||
        copy.gameOver
    ) {
        if (copy.cells[index].opened) {
            copy.logError = 'This cell was opened! You can not active it'
        }
        else if (copy.flag === 0) {
            copy.logError = 'You have reached the limit of flags'
        }

        return copy
    }

    soundEffectBindFlag()
    copy.cells[index].flag = !copy.cells[index].flag

    //Upgrade flag
    if (copy.cells[index].flag) {
        copy.flag -= 1
    } else {
        copy.flag += 1
    }
    copy = checkWin(copy)
    return copy
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
            top: `${top - 30}px`,
            left: `${left - 30}px`
        }
    }

    if (col === cols - 1) {
        return {
            gridTemplateAreas: `
                "flag ."
                "close open"
            `,
            top: `${top}px`,
            left: `${left - 30}px`
        }
    }

    if (row === rows - 1) {
        return {
            gridTemplateAreas: `
                "open close"
                ". flag"
            `,
            top: `${top - 30}px`,
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





