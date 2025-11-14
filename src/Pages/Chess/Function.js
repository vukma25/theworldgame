
import move_sound from '../../assets/sound/chess/moveSelf.mp3'
import capture_sound from '../../assets/sound/chess/capture.mp3'
import castle_sound from '../../assets/sound/chess/castle.mp3'
import check_sound from '../../assets/sound/chess/moveCheck.mp3'

const move = new Audio(move_sound)
const capture = new Audio(capture_sound)
const check = new Audio(check_sound)
const castle = new Audio(castle_sound)

//lay vi tri con tro va kich thuoc cua o co 
export function calculateEssentialSize(e, bounding) {
    const xPointer = e.clientX
    const yPointer = e.clientY

    //bounding bang voi phan margin
    //can tru di de hien thi chinh xac quan co voi con tro
    const boardWidth = bounding.right - bounding.left
    const squareWidth = Math.floor(boardWidth * 12.5 / 100)

    return [xPointer, yPointer, squareWidth]
}

//gioi han bien ma quan co the di chuyen
export function createLimit(init, min, max) {
    if (init < min) return min
    if (init > max) return max
    return init
}

// tinh toan top left can di chuyen de quan co nam chinh giua con tro
export function calculateTopOrLeft(init, tol, sw) {
    return init - tol - sw / 2
}

//xac dinh o co thu bao nhieu
export function identifyRowAndCol(left, top, sw) {
    return [
        Math.ceil(Math.min(8, left / sw)),
        8 - Math.ceil(Math.min(8, top / sw))
    ]
}

//kiem tra o duoc cho la goi y nuoc di
export function matchSquareSuggest(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "suggest" ? square : 0
}

//kiem tra o duoc cho la se bi an
export function matchSquareTaken(board, row, col, square) {
    const action = board[8 - row - 1][col - 1]?.action
    return action === "canBeTaken" || action === "ep" ? square : 0
}

//kiem tra o co ma vua di chuyen den de nhap thanh
export function matchSquareCastle(board, row, col) {
    const action = board[8 - row - 1][col - 1]?.action
    if (action === 'castle') {
        const { curRook, reRook, square, squareKing } =
            board[8 - row - 1][col - 1]

        return [curRook, reRook, square, squareKing]
    }

    return []
}

// chuyen doi board tu mang 2D sang 1D
export function convertToArray(board) {
    let newArray = [];
    board.map(e => {
        newArray = [...newArray, ...e]
        return e
    })

    return newArray
}

export class ChessGame {
    constructor(state = {}) {
        this.status = state.status ?? 'preparing'
        this.board = state.board ?? [
            [{
                'square': 57,
                'type': 'br',
                'value': 5
            }, {
                'square': 58,
                'type': 'bn',
                'value': 3
            }, {
                'square': 59,
                'type': 'bb',
                'value': 3
            }, {
                'square': 60,
                'type': 'bq',
                'value': 9
            }, {
                'square': 61,
                'type': 'bk',
                'value': 10
            }, {
                'square': 62,
                'type': 'bb',
                'value': 3
            }, {
                'square': 63,
                'type': 'bn',
                'value': 3
            }, {
                'square': 64,
                'type': 'br',
                'value': 5
            }],
            [{
                'square': 49,
                'type': 'bp',
                'value': 1
            }, {
                'square': 50,
                'type': 'bp',
                'value': 1
            }, {
                'square': 51,
                'type': 'bp',
                'value': 1
            }, {
                'square': 52,
                'type': 'bp',
                'value': 1
            }, {
                'square': 53,
                'type': 'bp',
                'value': 1
            }, {
                'square': 54,
                'type': 'bp',
                'value': 1
            }, {
                'square': 55,
                'type': 'bp',
                'value': 1
            }, {
                'square': 56,
                'type': 'bp',
                'value': 1
            }],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{
                'square': 9,
                'type': 'wp',
                'value': 1
            }, {
                'square': 10,
                'type': 'wp',
                'value': 1
            }, {
                'square': 11,
                'type': 'wp',
                'value': 1
            }, {
                'square': 12,
                'type': 'wp',
                'value': 1
            }, {
                'square': 13,
                'type': 'wp',
                'value': 1
            }, {
                'square': 14,
                'type': 'wp',
                'value': 1
            }, {
                'square': 15,
                'type': 'wp',
                'value': 1
            }, {
                'square': 16,
                'type': 'wp',
                'value': 1
            }],
            [{
                'square': 1,
                'type': 'wr',
                'value': 5
            }, {
                'square': 2,
                'type': 'wn',
                'value': 3
            }, {
                'square': 3,
                'type': 'wb',
                'value': 3
            }, {
                'square': 4,
                'type': 'wq',
                'value': 9
            }, {
                'square': 5,
                'type': 'wk',
                'value': 10
            }, {
                'square': 6,
                'type': 'wb',
                'value': 3
            }, {
                'square': 7,
                'type': 'wn',
                'value': 3
            }, {
                'square': 8,
                'type': 'wr',
                'value': 5
            }]
        ]
        this.pieces = state.pieces ?? [
            {
                'id': 1,
                'piece': 'bp',
                'square': 49,
                'coordinate': [1, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 2,
                'piece': 'bp',
                'square': 50,
                'coordinate': [1, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 3,
                'piece': 'bp',
                'square': 51,
                'coordinate': [1, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 4,
                'piece': 'bp',
                'square': 52,
                'coordinate': [1, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 5,
                'piece': 'bp',
                'square': 53,
                'coordinate': [1, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 6,
                'piece': 'bp',
                'square': 54,
                'coordinate': [1, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 7,
                'piece': 'bp',
                'square': 55,
                'coordinate': [1, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 8,
                'piece': 'bp',
                'square': 56,
                'coordinate': [1, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 9,
                'piece': 'br',
                'square': 57,
                'coordinate': [0, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 10,
                'piece': 'bn',
                'square': 58,
                'coordinate': [0, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 11,
                'piece': 'bb',
                'square': 59,
                'coordinate': [0, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 12,
                'piece': 'bq',
                'square': 60,
                'coordinate': [0, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 13,
                'piece': 'bk',
                'square': 61,
                'coordinate': [0, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 14,
                'piece': 'bb',
                'square': 62,
                'coordinate': [0, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 15,
                'piece': 'bn',
                'square': 63,
                'coordinate': [0, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 16,
                'piece': 'br',
                'square': 64,
                'coordinate': [0, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 17,
                'piece': 'wp',
                'square': 9,
                'coordinate': [6, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 18,
                'piece': 'wp',
                'square': 10,
                'coordinate': [6, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 19,
                'piece': 'wp',
                'square': 11,
                'coordinate': [6, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 20,
                'piece': 'wp',
                'square': 12,
                'coordinate': [6, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 21,
                'piece': 'wp',
                'square': 13,
                'coordinate': [6, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 22,
                'piece': 'wp',
                'square': 14,
                'coordinate': [6, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 23,
                'piece': 'wp',
                'square': 15,
                'coordinate': [6, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 24,
                'piece': 'wp',
                'square': 16,
                'coordinate': [6, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 25,
                'piece': 'wr',
                'square': 1,
                'coordinate': [7, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 26,
                'piece': 'wn',
                'square': 2,
                'coordinate': [7, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 27,
                'piece': 'wb',
                'square': 3,
                'coordinate': [7, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 28,
                'piece': 'wq',
                'square': 4,
                'coordinate': [7, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 29,
                'piece': 'wk',
                'square': 5,
                'coordinate': [7, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 30,
                'piece': 'wb',
                'square': 6,
                'coordinate': [7, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 31,
                'piece': 'wn',
                'square': 7,
                'coordinate': [7, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 32,
                'piece': 'wr',
                'square': 8,
                'coordinate': [7, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            }
        ]
        this.squares = state.squares ?? {
            '1': [0, 695],
            '2': [100, 695],
            '3': [200, 695],
            '4': [300, 695],
            '5': [400, 695],
            '6': [500, 695],
            '7': [600, 695],
            '8': [700, 695],

            '9': [0, 595],
            '10': [100, 595],
            '11': [200, 595],
            '12': [300, 595],
            '13': [400, 595],
            '14': [500, 595],
            '15': [600, 595],
            '16': [700, 595],

            '17': [0, 496],
            '18': [100, 496],
            '19': [200, 496],
            '20': [300, 496],
            '21': [400, 496],
            '22': [500, 496],
            '23': [600, 496],
            '24': [700, 496],

            '25': [0, 398],
            '26': [100, 398],
            '27': [200, 398],
            '28': [300, 398],
            '29': [400, 398],
            '30': [500, 398],
            '31': [600, 398],
            '32': [700, 398],

            '33': [0, 300],
            '34': [100, 300],
            '35': [200, 300],
            '36': [300, 300],
            '37': [400, 300],
            '38': [500, 300],
            '39': [600, 300],
            '40': [700, 300],

            '41': [0, 200],
            '42': [100, 200],
            '43': [200, 200],
            '44': [300, 200],
            '45': [400, 200],
            '46': [500, 200],
            '47': [600, 200],
            '48': [700, 200],

            '49': [0, 100],
            '50': [100, 100],
            '51': [200, 100],
            '52': [300, 100],
            '53': [400, 100],
            '54': [500, 100],
            '55': [600, 100],
            '56': [700, 100],

            '57': [0, 0],
            '58': [100, 0],
            '59': [200, 0],
            '60': [300, 0],
            '61': [400, 0],
            '62': [500, 0],
            '63': [600, 0],
            '64': [700, 0],
        }
        this.coordinates = state.coordinates ?? [
            [0.5, 3.5, 8],
            [0.5, 16, 7],
            [0.5, 28.5, 6],
            [0.5, 41, 5],
            [0.5, 53.5, 4],
            [0.5, 66, 3],
            [0.5, 78.5, 2],
            [0.5, 91, 1],
            [10, 99, "a"],
            [22.25, 99, "b"],
            [34.75, 99, "c"],
            [47.25, 99, "d"],
            [59.75, 99, "e"],
            [72.25, 99, "f"],
            [84.75, 99, "g"],
            [97.25, 99, "h"]
        ]
        this.methods = state.methods ?? [
            {
                'piece': 'bishop',
                'move': [
                    { 'scope': 1, 'coordinate': [1, -1] },
                    { 'scope': 1, 'coordinate': [1, 1] },
                    { 'scope': 1, 'coordinate': [-1, -1] },
                    { 'scope': 1, 'coordinate': [-1, 1] }
                ],
                'alias': ['bb', 'wb']
            },
            {
                'piece': 'rook',
                'move': [
                    { 'scope': 1, 'coordinate': [1, 0] },
                    { 'scope': 1, 'coordinate': [-1, 0] },
                    { 'scope': 1, 'coordinate': [0, -1] },
                    { 'scope': 1, 'coordinate': [0, 1] }
                ],
                'alias': ['br', 'wr']
            },
            {
                'piece': 'queen',
                'move': [
                    { 'scope': 1, 'coordinate': [1, -1] },
                    { 'scope': 1, 'coordinate': [1, 1] },
                    { 'scope': 1, 'coordinate': [-1, -1] },
                    { 'scope': 1, 'coordinate': [-1, 1] },
                    { 'scope': 1, 'coordinate': [1, 0] },
                    { 'scope': 1, 'coordinate': [-1, 0] },
                    { 'scope': 1, 'coordinate': [0, -1] },
                    { 'scope': 1, 'coordinate': [0, 1] }
                ],
                'alias': ['bq', 'wq']
            },
            {
                'piece': 'knight',
                'move': [
                    { 'scope': 0, 'coordinate': [2, 1] },
                    { 'scope': 0, 'coordinate': [2, -1] },
                    { 'scope': 0, 'coordinate': [1, -2] },
                    { 'scope': 0, 'coordinate': [1, 2] },
                    { 'scope': 0, 'coordinate': [-1, -2] },
                    { 'scope': 0, 'coordinate': [-1, 2] },
                    { 'scope': 0, 'coordinate': [-2, -1] },
                    { 'scope': 0, 'coordinate': [-2, 1] }
                ],
                'alias': ['bn', 'wn']
            },
            {
                'piece': 'king',
                'move': [
                    { 'scope': 0, 'coordinate': [1, 1] },
                    { 'scope': 0, 'coordinate': [1, 0] },
                    { 'scope': 0, 'coordinate': [1, -1] },
                    { 'scope': 0, 'coordinate': [0, -1] },
                    { 'scope': 0, 'coordinate': [0, 1] },
                    { 'scope': 0, 'coordinate': [-1, -1] },
                    { 'scope': 0, 'coordinate': [-1, 0] },
                    { 'scope': 0, 'coordinate': [-1, 1] }
                ],
                'castle': [
                    //chieu quan den o duoi
                    [
                        { 'side': 'q', 'coordinate': [0, 2] },
                        { 'side': 'k', 'coordinate': [0, -2] }
                    ],

                    //chieu quan trang o duoi
                    [
                        { 'side': 'q', 'coordinate': [0, -2] },
                        { 'side': 'k', 'coordinate': [0, 2] }
                    ]
                ],
                'alias': ['bk', 'wk']
            },
            {
                'piece': 'pawn',
                'move': [
                    [
                        { 'scope': 0, 'coordinate': [-1, 0] },
                        { 'scope': 0, 'coordinate': [-2, 0] }
                    ],
                    [
                        { 'scope': 0, 'coordinate': [1, 0] },
                        { 'scope': 0, 'coordinate': [2, 0] }
                    ]
                ],
                'takeSpecial': [
                    [
                        { 'scope': 0, 'cor': [-1, -1] },
                        { 'scope': 0, 'cor': [-1, 1] }
                    ],
                    [
                        { 'scope': 0, 'cor': [1, -1] },
                        { 'scope': 0, 'cor': [1, 1] }
                    ]
                ],
                'alias': ['wp']
            },
            {
                'piece': 'pawn',
                'move': [
                    [
                        { 'scope': 0, 'coordinate': [1, 0] },
                        { 'scope': 0, 'coordinate': [2, 0] }
                    ],
                    [
                        { 'scope': 0, 'coordinate': [-1, 0] },
                        { 'scope': 0, 'coordinate': [-2, 0] }
                    ]
                ],
                'takeSpecial': [
                    [
                        { 'scope': 0, 'cor': [1, -1] },
                        { 'scope': 0, 'cor': [1, 1] }
                    ],
                    [
                        { 'scope': 0, 'cor': [-1, -1] },
                        { 'scope': 0, 'cor': [-1, 1] }
                    ]
                ],
                'alias': ['bp']
            },
        ]
        this.turn = state.turn ?? 'w'
        this.attacks = state.attacks ?? {
            'w': [17, 18, 19, 20, 21, 22, 23, 24],
            'b': [41, 42, 43, 44, 45, 46, 47, 48]
        }
        this.protects = state.protects ?? {
            'w': [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
            'b': [49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63]
        }
        this.canCastle = state.canCastle ?? {
            'w': {
                'k': true,
                'q': true
            },
            'b': {
                'k': true,
                'q': true
            }
        }
        this.direction = state.direction ?? 1
        this.squaresEP = state.squaresEP ?? []
        this.pins = state.pins ?? []
        this.hasPawnPromotion = state.hasPawnPromotion ?? false
        this.listPawnCanBecome = state.listPawnCanBecome ?? []
        this.hasCheckmate = state.hasCheckmate ?? {
            'checkmate': false,
            'by': ''
        }
        this.isDraw = state.isDraw ?? {
            draw: false,
            reason: ''
        }
        this.moves = state.moves ?? []
        this.bout = state.bout ?? 1
        this.fen = state.fen ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
        this.sound = {
            move,
            capture,
            check,
            castle
        }
    }

    //setters
    setBoard(board) {
        this.board = board
    }

    setPieces(pieces) {
        this.pieces = pieces
    }

    setListPawnCanBecome(list) {
        this.listPawnCanBecome = list
    }

    setStatus(status) {
        this.status = status
    }

    // getters
    getBoard() {
        const board = this.board
        return board
    }

    getPieces() {
        const pieces = this.pieces
        return pieces
    }

    getMoves() {
        const moves = this.moves
        return moves
    }

    getCoordinates() {
        const coordinate = this.coordinates
        return coordinate
    }

    getInit() {
        const status = 'preparing'
        const board = [
            [{
                'square': 57,
                'type': 'br',
                'value': 5
            }, {
                'square': 58,
                'type': 'bn',
                'value': 3
            }, {
                'square': 59,
                'type': 'bb',
                'value': 3
            }, {
                'square': 60,
                'type': 'bq',
                'value': 9
            }, {
                'square': 61,
                'type': 'bk',
                'value': 10
            }, {
                'square': 62,
                'type': 'bb',
                'value': 3
            }, {
                'square': 63,
                'type': 'bn',
                'value': 3
            }, {
                'square': 64,
                'type': 'br',
                'value': 5
            }],
            [{
                'square': 49,
                'type': 'bp',
                'value': 1
            }, {
                'square': 50,
                'type': 'bp',
                'value': 1
            }, {
                'square': 51,
                'type': 'bp',
                'value': 1
            }, {
                'square': 52,
                'type': 'bp',
                'value': 1
            }, {
                'square': 53,
                'type': 'bp',
                'value': 1
            }, {
                'square': 54,
                'type': 'bp',
                'value': 1
            }, {
                'square': 55,
                'type': 'bp',
                'value': 1
            }, {
                'square': 56,
                'type': 'bp',
                'value': 1
            }],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{}, {}, {}, {}, {}, {}, {}, {}],
            [{
                'square': 9,
                'type': 'wp',
                'value': 1
            }, {
                'square': 10,
                'type': 'wp',
                'value': 1
            }, {
                'square': 11,
                'type': 'wp',
                'value': 1
            }, {
                'square': 12,
                'type': 'wp',
                'value': 1
            }, {
                'square': 13,
                'type': 'wp',
                'value': 1
            }, {
                'square': 14,
                'type': 'wp',
                'value': 1
            }, {
                'square': 15,
                'type': 'wp',
                'value': 1
            }, {
                'square': 16,
                'type': 'wp',
                'value': 1
            }],
            [{
                'square': 1,
                'type': 'wr',
                'value': 5
            }, {
                'square': 2,
                'type': 'wn',
                'value': 3
            }, {
                'square': 3,
                'type': 'wb',
                'value': 3
            }, {
                'square': 4,
                'type': 'wq',
                'value': 9
            }, {
                'square': 5,
                'type': 'wk',
                'value': 10
            }, {
                'square': 6,
                'type': 'wb',
                'value': 3
            }, {
                'square': 7,
                'type': 'wn',
                'value': 3
            }, {
                'square': 8,
                'type': 'wr',
                'value': 5
            }]
        ]
        const pieces = [
            {
                'id': 1,
                'piece': 'bp',
                'square': 49,
                'coordinate': [1, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 2,
                'piece': 'bp',
                'square': 50,
                'coordinate': [1, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 3,
                'piece': 'bp',
                'square': 51,
                'coordinate': [1, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 4,
                'piece': 'bp',
                'square': 52,
                'coordinate': [1, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 5,
                'piece': 'bp',
                'square': 53,
                'coordinate': [1, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 6,
                'piece': 'bp',
                'square': 54,
                'coordinate': [1, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 7,
                'piece': 'bp',
                'square': 55,
                'coordinate': [1, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 8,
                'piece': 'bp',
                'square': 56,
                'coordinate': [1, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 9,
                'piece': 'br',
                'square': 57,
                'coordinate': [0, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 10,
                'piece': 'bn',
                'square': 58,
                'coordinate': [0, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 11,
                'piece': 'bb',
                'square': 59,
                'coordinate': [0, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 12,
                'piece': 'bq',
                'square': 60,
                'coordinate': [0, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 13,
                'piece': 'bk',
                'square': 61,
                'coordinate': [0, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 14,
                'piece': 'bb',
                'square': 62,
                'coordinate': [0, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 15,
                'piece': 'bn',
                'square': 63,
                'coordinate': [0, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 16,
                'piece': 'br',
                'square': 64,
                'coordinate': [0, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 17,
                'piece': 'wp',
                'square': 9,
                'coordinate': [6, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 18,
                'piece': 'wp',
                'square': 10,
                'coordinate': [6, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 19,
                'piece': 'wp',
                'square': 11,
                'coordinate': [6, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 20,
                'piece': 'wp',
                'square': 12,
                'coordinate': [6, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 21,
                'piece': 'wp',
                'square': 13,
                'coordinate': [6, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 22,
                'piece': 'wp',
                'square': 14,
                'coordinate': [6, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 23,
                'piece': 'wp',
                'square': 15,
                'coordinate': [6, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 24,
                'piece': 'wp',
                'square': 16,
                'coordinate': [6, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
                'deploy': false
            },
            {
                'id': 25,
                'piece': 'wr',
                'square': 1,
                'coordinate': [7, 0],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 26,
                'piece': 'wn',
                'square': 2,
                'coordinate': [7, 1],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 27,
                'piece': 'wb',
                'square': 3,
                'coordinate': [7, 2],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 28,
                'piece': 'wq',
                'square': 4,
                'coordinate': [7, 3],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 29,
                'piece': 'wk',
                'square': 5,
                'coordinate': [7, 4],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 30,
                'piece': 'wb',
                'square': 6,
                'coordinate': [7, 5],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 31,
                'piece': 'wn',
                'square': 7,
                'coordinate': [7, 6],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            },
            {
                'id': 32,
                'piece': 'wr',
                'square': 8,
                'coordinate': [7, 7],
                'allowMove': {
                    'move': [],
                    'take': []
                },
                'ban': false,
            }
        ]
        const squares = {
            '1': [0, 695],
            '2': [100, 695],
            '3': [200, 695],
            '4': [300, 695],
            '5': [400, 695],
            '6': [500, 695],
            '7': [600, 695],
            '8': [700, 695],

            '9': [0, 595],
            '10': [100, 595],
            '11': [200, 595],
            '12': [300, 595],
            '13': [400, 595],
            '14': [500, 595],
            '15': [600, 595],
            '16': [700, 595],

            '17': [0, 496],
            '18': [100, 496],
            '19': [200, 496],
            '20': [300, 496],
            '21': [400, 496],
            '22': [500, 496],
            '23': [600, 496],
            '24': [700, 496],

            '25': [0, 398],
            '26': [100, 398],
            '27': [200, 398],
            '28': [300, 398],
            '29': [400, 398],
            '30': [500, 398],
            '31': [600, 398],
            '32': [700, 398],

            '33': [0, 300],
            '34': [100, 300],
            '35': [200, 300],
            '36': [300, 300],
            '37': [400, 300],
            '38': [500, 300],
            '39': [600, 300],
            '40': [700, 300],

            '41': [0, 200],
            '42': [100, 200],
            '43': [200, 200],
            '44': [300, 200],
            '45': [400, 200],
            '46': [500, 200],
            '47': [600, 200],
            '48': [700, 200],

            '49': [0, 100],
            '50': [100, 100],
            '51': [200, 100],
            '52': [300, 100],
            '53': [400, 100],
            '54': [500, 100],
            '55': [600, 100],
            '56': [700, 100],

            '57': [0, 0],
            '58': [100, 0],
            '59': [200, 0],
            '60': [300, 0],
            '61': [400, 0],
            '62': [500, 0],
            '63': [600, 0],
            '64': [700, 0],
        }
        const methods = [
            {
                'piece': 'bishop',
                'move': [
                    { 'scope': 1, 'coordinate': [1, -1] },
                    { 'scope': 1, 'coordinate': [1, 1] },
                    { 'scope': 1, 'coordinate': [-1, -1] },
                    { 'scope': 1, 'coordinate': [-1, 1] }
                ],
                'alias': ['bb', 'wb']
            },
            {
                'piece': 'rook',
                'move': [
                    { 'scope': 1, 'coordinate': [1, 0] },
                    { 'scope': 1, 'coordinate': [-1, 0] },
                    { 'scope': 1, 'coordinate': [0, -1] },
                    { 'scope': 1, 'coordinate': [0, 1] }
                ],
                'alias': ['br', 'wr']
            },
            {
                'piece': 'queen',
                'move': [
                    { 'scope': 1, 'coordinate': [1, -1] },
                    { 'scope': 1, 'coordinate': [1, 1] },
                    { 'scope': 1, 'coordinate': [-1, -1] },
                    { 'scope': 1, 'coordinate': [-1, 1] },
                    { 'scope': 1, 'coordinate': [1, 0] },
                    { 'scope': 1, 'coordinate': [-1, 0] },
                    { 'scope': 1, 'coordinate': [0, -1] },
                    { 'scope': 1, 'coordinate': [0, 1] }
                ],
                'alias': ['bq', 'wq']
            },
            {
                'piece': 'knight',
                'move': [
                    { 'scope': 0, 'coordinate': [2, 1] },
                    { 'scope': 0, 'coordinate': [2, -1] },
                    { 'scope': 0, 'coordinate': [1, -2] },
                    { 'scope': 0, 'coordinate': [1, 2] },
                    { 'scope': 0, 'coordinate': [-1, -2] },
                    { 'scope': 0, 'coordinate': [-1, 2] },
                    { 'scope': 0, 'coordinate': [-2, -1] },
                    { 'scope': 0, 'coordinate': [-2, 1] }
                ],
                'alias': ['bn', 'wn']
            },
            {
                'piece': 'king',
                'move': [
                    { 'scope': 0, 'coordinate': [1, 1] },
                    { 'scope': 0, 'coordinate': [1, 0] },
                    { 'scope': 0, 'coordinate': [1, -1] },
                    { 'scope': 0, 'coordinate': [0, -1] },
                    { 'scope': 0, 'coordinate': [0, 1] },
                    { 'scope': 0, 'coordinate': [-1, -1] },
                    { 'scope': 0, 'coordinate': [-1, 0] },
                    { 'scope': 0, 'coordinate': [-1, 1] }
                ],
                'castle': [
                    //chieu quan den o duoi
                    [
                        { 'side': 'q', 'coordinate': [0, 2] },
                        { 'side': 'k', 'coordinate': [0, -2] }
                    ],

                    //chieu quan trang o duoi
                    [
                        { 'side': 'q', 'coordinate': [0, -2] },
                        { 'side': 'k', 'coordinate': [0, 2] }
                    ]
                ],
                'alias': ['bk', 'wk']
            },
            {
                'piece': 'pawn',
                'move': [
                    [
                        { 'scope': 0, 'coordinate': [-1, 0] },
                        { 'scope': 0, 'coordinate': [-2, 0] }
                    ],
                    [
                        { 'scope': 0, 'coordinate': [1, 0] },
                        { 'scope': 0, 'coordinate': [2, 0] }
                    ]
                ],
                'takeSpecial': [
                    [
                        { 'scope': 0, 'cor': [-1, -1] },
                        { 'scope': 0, 'cor': [-1, 1] }
                    ],
                    [
                        { 'scope': 0, 'cor': [1, -1] },
                        { 'scope': 0, 'cor': [1, 1] }
                    ]
                ],
                'alias': ['wp']
            },
            {
                'piece': 'pawn',
                'move': [
                    [
                        { 'scope': 0, 'coordinate': [1, 0] },
                        { 'scope': 0, 'coordinate': [2, 0] }
                    ],
                    [
                        { 'scope': 0, 'coordinate': [-1, 0] },
                        { 'scope': 0, 'coordinate': [-2, 0] }
                    ]
                ],
                'takeSpecial': [
                    [
                        { 'scope': 0, 'cor': [1, -1] },
                        { 'scope': 0, 'cor': [1, 1] }
                    ],
                    [
                        { 'scope': 0, 'cor': [-1, -1] },
                        { 'scope': 0, 'cor': [-1, 1] }
                    ]
                ],
                'alias': ['bp']
            },
        ]
        const coordinates = [
            [0.5, 3.5, 8],
            [0.5, 16, 7],
            [0.5, 28.5, 6],
            [0.5, 41, 5],
            [0.5, 53.5, 4],
            [0.5, 66, 3],
            [0.5, 78.5, 2],
            [0.5, 91, 1],
            [10, 99, "a"],
            [22.25, 99, "b"],
            [34.75, 99, "c"],
            [47.25, 99, "d"],
            [59.75, 99, "e"],
            [72.25, 99, "f"],
            [84.75, 99, "g"],
            [97.25, 99, "h"]
        ]
        const turn = 'w'
        const attacks = {
            'w': [17, 18, 19, 20, 21, 22, 23, 24],
            'b': [41, 42, 43, 44, 45, 46, 47, 48]
        }
        const protects = {
            'w': [2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15, 16],
            'b': [49, 50, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62, 63]
        }
        const canCastle = {
            'w': {
                'k': true,
                'q': true
            },
            'b': {
                'k': true,
                'q': true
            }
        }
        const direction = 1
        const squaresEP = []
        const pins = []
        const hasPawnPromotion = false
        const listPawnCanBecome = []
        const hasCheckmate = {
            'checkmate': false,
            'by': ''
        }
        const isDraw = {
            draw: false,
            reason: ''
        }
        const moves = []
        const bout = 1
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

        const init = {
            status,
            board,
            pieces,
            squares,
            methods,
            coordinates,
            turn,
            attacks,
            protects,
            canCastle,
            pins,
            squaresEP,
            direction,
            hasPawnPromotion,
            listPawnCanBecome,
            hasCheckmate,
            isDraw,
            bout,
            moves,
            fen,
        }
        return new ChessGame(init)
    }

    getState() {
        let status = this.status
        let board = this.board
        let pieces = this.pieces
        let squares = this.squares
        let turn = this.turn
        let methods = this.methods
        let coordinates = this.coordinates
        let attacks = this.attacks
        let protects = this.protects
        let canCastle = this.canCastle
        let pins = this.pins
        let squaresEP = this.squaresEP
        let direction = this.direction
        let hasPawnPromotion = this.hasPawnPromotion
        let listPawnCanBecome = this.listPawnCanBecome
        let hasCheckmate = this.hasCheckmate
        let moves = this.moves
        let bout = this.bout
        let fen = this.fen
        let isDraw = this.isDraw

        const state = {
            status,
            board,
            pieces,
            squares,
            methods,
            coordinates,
            turn,
            attacks,
            protects,
            canCastle,
            pins,
            squaresEP,
            direction,
            hasPawnPromotion,
            listPawnCanBecome,
            hasCheckmate,
            isDraw,
            moves,
            bout,
            fen,
        }

        return new ChessGame(state)
    }

    //methods
    modifySquare(square) {
        const [row, col] = this.calRowAndCol(square)
        const newSquare = 8 * (8 - (7 - row) - 1) + (7 - col) + 1
        return newSquare
    }

    modifyAttacks() {
        this.attacks = {
            'w': this.attacks.w.map(e => this.modifySquare(e)),
            'b': this.attacks.b.map(e => this.modifySquare(e))
        }
    }

    modifyProtects() {
        this.protects = {
            'w': this.protects.w.map(e => this.modifySquare(e)),
            'b': this.protects.b.map(e => this.modifySquare(e))
        }
    }

    modifyPins() {
        this.pins = this.pins.map(({ direction, square }) => {
            return {
                'direction': direction.map(e => -e),
                'square': this.modifySquare(square)
            }
        })
    }

    modifySquareEP() {
        this.squaresEP = this.squaresEP.map(square => {
            return {
                ...square,
                'sq': this.modifySquare(square.sq),
                'takeSq': square.takeSq.map(s => this.modifySquare(s))
            }
        })
    }

    rollPieces() {
        this.pieces = this.pieces.map(piece => {
            return {
                ...piece,
                'allowMove': {
                    'move': piece.allowMove.move.map(e => this.modifySquare(e)),
                    'take': piece.allowMove.take.map(e => this.modifySquare(e))
                },
                'square': this.modifySquare(piece.square),
                'coordinate': this.calRowAndCol(this.modifySquare(piece.square))
            }
        })
    }

    rollBoard() {
        const values = {
            'p': 1,
            'b': 3,
            'n': 3,
            'r': 5,
            'q': 9,
            'k': 10
        }
        const freshBoard = this.board.map(squares => {
            return squares.map(() => {
                return {}
            })
        })
        this.pieces.forEach(({ piece, square }) => {
            const [row, col] = this.calRowAndCol(square)
            freshBoard[row][col] = {
                'square': square,
                'type': piece,
                'value': values[piece[1]]
            }
        })

        this.board = freshBoard
    }

    modifyCoordinate() {
        if (this.direction === 1) {
            this.coordinates = [
                [0.5, 3.5, 8],
                [0.5, 16, 7],
                [0.5, 28.5, 6],
                [0.5, 41, 5],
                [0.5, 53.5, 4],
                [0.5, 66, 3],
                [0.5, 78.5, 2],
                [0.5, 91, 1],
                [10, 99, "a"],
                [22.25, 99, "b"],
                [34.75, 99, "c"],
                [47.25, 99, "d"],
                [59.75, 99, "e"],
                [72.25, 99, "f"],
                [84.75, 99, "g"],
                [97.25, 99, "h"]
            ]
        } else {
            this.coordinates = [
                [0.5, 3.5, 1],
                [0.5, 16, 2],
                [0.5, 28.5, 3],
                [0.5, 41, 4],
                [0.5, 53.5, 5],
                [0.5, 66, 6],
                [0.5, 78.5, 7],
                [0.5, 91, 8],
                [10, 99, "h"],
                [22.25, 99, "g"],
                [34.75, 99, "f"],
                [47.25, 99, "e"],
                [59.75, 99, "d"],
                [72.25, 99, "c"],
                [84.75, 99, "b"],
                [97.25, 99, "a"]
            ]
        }
    }

    modifyDirection() {
        this.direction = this.direction === 1 ? 0 : 1
        this.rollPieces()
        this.rollBoard()
        this.modifyCoordinate()
        this.modifyAttacks()
        this.modifyProtects()
        this.modifyPins()
        this.modifySquareEP()
    }

    //==============================================================
    // dành riêng để cập nhật ui không ảnh hưởng đến logic
    findEPSquare(square) {
        for (let i = 0; i < this.squaresEP.length; i++) {
            const { sq } = this.squaresEP[i]
            if (sq === square) return this.squaresEP[i]
        }
        return null
    }

    // danh dau cac o goi y nuoc di
    markCanBeTaken(namePiece, square, row, col, board) {
        if (
            (col < 8 && col >= 0) &&
            (row < 8 && row >= 0)
        ) {

            let sq = 8 * (8 - row - 1) + col + 1
            let ep = this.findEPSquare(sq)

            if (
                board[row][col]?.type?.[0] &&
                namePiece[0] !== board[row][col]?.type?.[0]
            ) {
                board[row][col] = {
                    ...board[row][col],
                    'action': 'canBeTaken',
                    'byPiece': namePiece,
                    'takeSquare': square
                }
            }
            else if (
                ['wp', 'bp'].includes(namePiece) &&
                ep?.takeSq?.includes(square) &&
                ep && ep?.color !== namePiece[0]
            ) {
                board[row][col] = {
                    'action': 'ep',
                    'byPiece': namePiece,
                    'takeSquare': square,
                    'square': sq
                }
            }

        }
    }

    //danh dau ca o bi an quan
    markSuggest(square, namePiece, row, col, board) {
        board[row][col] = {
            'action': 'suggest',
            'forPiece': namePiece,
            'square': 8 * (8 - row - 1) + col + 1,
            'moveToSquare': square
        }
    }

    //danh dau cac o khi vua di chuyen den thi nhap thanh
    markCastle(squareKing, side, color, row, col, piece, board) {
        let currentRook = 0
        let replaceRook = 0
        const square = 8 * (8 - row - 1) + col + 1

        if (this.direction === 1) {
            if (color === 'w') {
                if (side === 'k') {
                    currentRook = 8
                    replaceRook = square - 1
                } else {
                    currentRook = 1
                    replaceRook = square + 1
                }
            }
            else {
                if (side === 'k') {
                    currentRook = 64
                    replaceRook = square - 1
                } else {
                    currentRook = 57
                    replaceRook = square + 1
                }
            }
        }
        else {
            if (color === 'w') {
                if (side === 'k') {
                    currentRook = 57
                    replaceRook = square + 1
                } else {
                    currentRook = 64
                    replaceRook = square - 1
                }
            }
            else {
                if (side === 'k') {
                    currentRook = 1
                    replaceRook = square + 1
                } else {
                    currentRook = 8
                    replaceRook = square - 1
                }
            }
        }

        board[row][col] = {
            'action': 'castle',
            'curRook': currentRook,
            'reRook': replaceRook,
            'square': square,
            'squareKing': squareKing,
            'forPiece': piece
        }
    }

    //xoa cac o goi y va o an quan
    clearMoveAndTake(board) {
        const cleanedBoard = board.map(squares => {
            return squares.map(square => {
                if (
                    square.action === 'suggest' ||
                    square.action === 'castle' ||
                    square.action === 'ep'
                ) {
                    return {}
                } else if (square.action === 'canBeTaken') {
                    return {
                        'square': square.square,
                        'type': square.type,
                        'value': square.value
                    }
                }
                return square
            })
        })

        return cleanedBoard
    }

    //hien thi cac nuoc di va cac quan co the an
    displayInvalidMoveAndTake(namePiece, square, coordinate, board) {

        board = this.clearMoveAndTake(board)
        const pi = this.findPiece(square)
        const [rowK, colK] = this.kingSquare(namePiece[0] + 'k')
        if (pi.ban) return board

        const squarePinned = this.checkSquareIsPinned(square)

        //quân mã đã bị ghim thì không thể di chuyển
        if (namePiece[1] === 'n' && squarePinned) return board

        //quân cờ khác bị ghim vẫn có thể có khả di chuyển
        let piece = null
        if (squarePinned) {
            piece = this.modifyMethods(namePiece, squarePinned.direction)
        } else {
            piece = this.methods.find(p => p.alias.includes(namePiece))
        }

        if (!piece) return board

        if (
            pi.allowMove.move.length !== 0 ||
            pi.allowMove.take.length !== 0
        ) {
            pi.allowMove.move.forEach(sq => {
                const [row, col] = this.calRowAndCol(sq)
                this.markSuggest(square, namePiece, row, col, board)
            })
            pi.allowMove.take.forEach(sq => {
                const [row, col] = this.calRowAndCol(sq)
                this.markCanBeTaken(namePiece, square, row, col, board)
            })

            return board
        }
        if (
            this.attacks[namePiece[0] === 'w' ? 'b' : 'w'].includes(8 * (7 - rowK) + colK + 1) &&
            namePiece[1] !== 'k'
        ) {
            return board
        }

        const move = Array.isArray(piece.move[0]) ? piece.move[this.direction] : piece.move
        for (let k = 0; k < move.length; k++) {
            const { coordinate: [dy, dx], scope } = move[k]
            let row = coordinate[0] - dy;
            let col = coordinate[1] + dx;

            if (scope) {

                while (col < 8 && col >= 0 && row < 8 && row >= 0) {

                    if (Object.keys(board[row][col]).length === 0 || board[row][col]?.action === 'ep') {
                        this.markSuggest(square, namePiece, row, col, board)

                        row -= dy
                        col += dx
                    } else {
                        this.markCanBeTaken(namePiece, square, row, col, board);
                        break
                    }
                }
            }
            else {
                if ((col < 8 && col >= 0) && (row < 8 && row >= 0)) {

                    //ap dung voi quan tot
                    if (['wp', 'bp'].includes(namePiece)) {
                        // hien thi cac o co the di
                        if (
                            Object.keys(board[row][col]).length === 0
                        ) {
                            this.markSuggest(square, namePiece, row, col, board)
                            if (pi.deploy) {
                                break
                            }
                        } else break
                    }

                    else if (['wk', 'bk'].includes(namePiece)) {
                        const colorOpp = namePiece[0] === 'w' ? 'b' : 'w'

                        if (this.attacks[colorOpp].includes(8 * (8 - row - 1) + col + 1) ||
                            this.protects[colorOpp].includes(8 * (8 - row - 1) + col + 1)
                        ) continue

                        else {
                            if (
                                Object.keys(board[row][col]).length === 0
                            ) {
                                this.markSuggest(square, namePiece, row, col, board)
                            }
                            else {
                                this.markCanBeTaken(namePiece, square, row, col, board)
                            }
                        }

                        if ((this.canCastle[namePiece[0]].k || this.canCastle[namePiece[0]].q) && (row === 0 || row === 7)) {
                            piece.castle[this.direction].forEach(({ side, coordinate: [y, x] }) => {
                                if (this.checkCanCastle(namePiece[0], side, square)) {
                                    this.markCastle(
                                        square,
                                        side,
                                        namePiece[0],
                                        coordinate[0] - y,
                                        coordinate[1] + x,
                                        namePiece,
                                        board
                                    )
                                }
                            })
                        }
                    }

                    //quan co con lai nhu ma
                    else {
                        if (
                            Object.keys(board[row][col]).length === 0
                        ) {
                            this.markSuggest(square, namePiece, row, col, board)
                        }
                        else {
                            this.markCanBeTaken(namePiece, square, row, col, board)
                        }
                    }
                }
            }
        }

        //vì quân tốt các phương thức di chuyển và ăn quân độc lập
        if (['wp', 'bp'].includes(namePiece)) {
            piece.takeSpecial[this.direction].forEach(({ cor: [z, t] }) => {
                this.markCanBeTaken(namePiece, square, coordinate[0] - z, coordinate[1] + t, board)
            })
        }

        return board
    }
    // hết ui ================================================================

    //tim quan co dua tren vi tri cua no
    findPiece(square) {
        return this.pieces.find(p => p.square === square)
    }

    //kiem tra o ben trai co la tot cua doi phuong hay khon --> ap dung cho bat tot qua duong
    matchLeftSquareIsPawn(color, square) {
        const squareLeftSide = square - 1
        const [r, c] = this.calRowAndCol(squareLeftSide)
        if (this.board[r][c]?.type?.[1] === 'p' && color !== this.board[r][c]?.type?.[0]) {
            return true
        } else return false
    }

    //tuong tu nhu matchLeftSquareIsPawn
    matchRightSquareIsPawn(color, square) {
        const squareRightSide = square + 1
        const [r, c] = this.calRowAndCol(squareRightSide)
        if (this.board[r][c]?.type?.[1] === 'p' && color !== this.board[r][c]?.type?.[0]) {
            return true
        } else return false
    }

    //kiem tra co the bat tot qua duong
    isEnPassant(color, square) {
        const [_, col] = this.calRowAndCol(square)

        if (col === 0) {
            return this.matchRightSquareIsPawn(color, square)
        }
        else if (col === 7) {
            return this.matchLeftSquareIsPawn(color, square)
        }
        else {
            return (
                this.matchRightSquareIsPawn(color, square) ||
                this.matchLeftSquareIsPawn(color, square)
            )
        }
    }

    allowEnPassant(step, reSquare, piece) {
        if (step === 2 && this.isEnPassant(piece[0], reSquare)) {
            const squareEP = reSquare > 32 ? reSquare + 8 : reSquare - 8
            const bySquare = []
            const [_, col] = this.calRowAndCol(reSquare)

            if (col === 0) {
                bySquare.push(reSquare + 1)
            } else if (col === 7) {
                bySquare.push(reSquare - 1)
            } else {
                if (this.matchLeftSquareIsPawn(piece[0], reSquare)) {
                    bySquare.push(reSquare - 1)
                }
                if (this.matchRightSquareIsPawn(piece[0], reSquare)) {
                    bySquare.push(reSquare + 1)
                }
            }

            return {
                'color': piece[0],
                'sq': squareEP,
                'takeSq': bySquare
            }
        }
        return null
    }

    //kiem tra nhap thanh canh vua
    canCastleSideKing(color, colorOpp, kingSquare) {
        for (let i = 1; i <= 2; i++) {
            const nextSquare = this.direction === 1 ? kingSquare + i : kingSquare - i
            const [row, col] = this.calRowAndCol(nextSquare)
            if ((col >= 8 || col < 0) || (row >= 8 || row < 0)) return false
            if (this.board[row][col]?.type) return false
            if (this.attacks[colorOpp].includes(nextSquare) || this.attacks[colorOpp].includes(kingSquare)) return false
            if (!this.canCastle[color].k) return false
        }
        return true
    }

    //kiem tra nhap thanh canh hau
    canCastleSideQueen(color, colorOpp, kingSquare) {
        for (let i = 1; i <= 3; i++) {
            const nextSquare = this.direction === 1 ? kingSquare - i : kingSquare + i
            const [row, col] = this.calRowAndCol(nextSquare)
            if ((col >= 8 || col < 0) || (row >= 8 || row < 0)) return false
            if (this.board[row][col]?.type) return false
            if (this.attacks[colorOpp].includes(nextSquare) || this.attacks[colorOpp].includes(kingSquare)) return false
            if (!this.canCastle[color].q) {
                return false
            }
        }
        return true
    }

    //kiem tra co the nhap thanh
    checkCanCastle(color, side, kingSquare) {

        const colorOpp = color === 'w' ? 'b' : 'w'
        //1 la quan trang nam phia duoi, 0 la quan trang nam phia tren
        if (color === 'w') {
            if (side === 'k') {
                return this.canCastleSideKing(color, colorOpp, kingSquare)
            } else {
                return this.canCastleSideQueen(color, colorOpp, kingSquare)
            }
        }
        else {
            if (side === 'k') {
                return this.canCastleSideKing(color, colorOpp, kingSquare)
            } else {
                return this.canCastleSideQueen(color, colorOpp, kingSquare)
            }
        }
    }

    checkSquareIsPinned(square) {
        return this.pins.find(sq => sq.square === square)
    }

    absolutePinned(move, direction) {
        for (const { coordinate } of move) {
            if (
                JSON.stringify(coordinate) === JSON.stringify(direction)
            ) return true
        }
        return false
    }

    //direction o day la huong di chuyen cua quan co, khac voi direction la phuong cua ban co
    modifyMethods(piece, direction) {
        const methodOfPiece = this.methods.find(p => p.alias.includes(piece))
        if (['wp', 'bp'].includes(piece)) {
            if (this.isDiagonal(direction)) {
                return {
                    'piece': methodOfPiece.piece,
                    'move': [[], []],
                    'takeSpecial': [
                        [{ 'scope': 0, 'cor': -[direction[0], -direction[1]] }],
                        [{ 'scope': 0, 'cor': [direction[0], direction[1]] }]
                    ],
                    'alias': methodOfPiece.alias
                }
            }
            else if (direction[1] === 0) {
                return {
                    'piece': methodOfPiece.piece,
                    'move': methodOfPiece.move,
                    'takeSpecial': [[], []],
                    'alias': methodOfPiece.alias
                }
            } else if (direction[0] === 0) {
                return {
                    'piece': methodOfPiece.piece,
                    'move': [[], []],
                    'takeSpecial': [[], []],
                    'alias': methodOfPiece.alias
                }
            }
        }
        else if (
            ['wn', 'bn'].includes(piece) ||
            (['wr', 'br'].includes(piece) && this.isDiagonal(direction)) ||
            (['wb', 'bb'].includes(piece) && this.isStraight(direction))
        ) {
            return {
                'piece': methodOfPiece.piece,
                'move': [],
                'alias': methodOfPiece.alias
            }
        }
        if (this.absolutePinned(methodOfPiece.move, direction)) {
            return {
                'piece': methodOfPiece.piece,
                'move': [
                    { 'scope': 1, 'coordinate': [direction[0], direction[1]] },
                    { 'scope': 1, 'coordinate': [-direction[0], -direction[1]] }
                ],
                'alias': methodOfPiece.alias
            }
        }
        return methodOfPiece
    }

    //tinh toan hang, cot dua tren vi tri o
    calRowAndCol(square) {
        return [
            square % 8 === 0 ?
                8 - Math.floor(square / 8) :
                7 - Math.floor(square / 8),
            square % 8 === 0 ? 7 : square % 8 - 1
        ]
    }

    //hoan doi 2 o
    replace(row, col, newRow, newCol, square) {
        this.board[newRow][newCol] = {
            ...this.board[row][col],
            'square': square
        }
        this.board[row][col] = {}
    }

    //xac dinh cac o tan cong va bao ve cua mot quan co
    //mục đích thực sự của làm này là để lấy tất các ô cờ mà quân cờ kiểm soát được
    pieceAttackOrProtectPieces(piece, coor) {
        const methodOfPiece = this.methods.find(p => p.alias.includes(piece))
        const [y, x] = coor
        const squareBeAttacked = []
        const squareBeProtected = []
        const move = Array.isArray(methodOfPiece.move[0]) ?
            methodOfPiece.move[this.direction] :
            methodOfPiece.move

        for (const { coordinate: [dy, dx], scope } of move) {
            let row = y - dy;
            let col = x + dx;
            let square = 8 * (8 - row - 1) + col + 1

            if (scope) {
                while (col < 8 && col >= 0 && row < 8 && row >= 0) {
                    //kiểm soát cả nhưng ô của vua đối thủ và đằng sau vua đối thủ nếu quân cờ tấn công thuộc dạng scope
                    if (Object.keys(this.board[row][col]).length === 0 ||
                        ((this.board[row][col]?.type?.[1] === 'k') && piece[0] !== this.board[row][col]?.type?.[0])
                    ) {
                        squareBeAttacked.push(JSON.stringify({
                            'type': piece[0],
                            'sp': square
                        }))

                        row -= dy
                        col += dx
                        square = 8 * (8 - row - 1) + col + 1
                    }
                    else {
                        if (piece[0] !== this.board[row][col]?.type[0]) {
                            squareBeAttacked.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))

                        } else {
                            squareBeProtected.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))
                        }
                        break
                    }
                }
            } else {
                if (['wp', 'bp'].includes(piece)) {
                    methodOfPiece.takeSpecial[this.direction].forEach(({ cor: [z, t] }) => {
                        let row = y - z;
                        let col = x + t;
                        const square = 8 * (8 - row - 1) + col + 1
                        if (col < 8 && col >= 0 && row < 8 && row >= 0) {
                            if (Object.keys(this.board[row][col]).length === 0) {
                                squareBeAttacked.push(JSON.stringify({
                                    'type': piece[0],
                                    'sp': square
                                }))
                            } else {
                                if (piece[0] !== this.board[row][col]?.type[0]) {
                                    squareBeAttacked.push(JSON.stringify({
                                        'type': piece[0],
                                        'sp': square
                                    }))
                                } else {
                                    squareBeProtected.push(JSON.stringify({
                                        'type': piece[0],
                                        'sp': square
                                    }))
                                }
                            }
                        }
                    })
                    break
                } else {
                    if (col < 8 && col >= 0 && row < 8 && row >= 0) {
                        if (Object.keys(this.board[row][col]).length === 0) {
                            squareBeAttacked.push(JSON.stringify({
                                'type': piece[0],
                                'sp': square
                            }))
                        } else {
                            if (piece[0] !== this.board[row][col]?.type[0]) {
                                squareBeAttacked.push(JSON.stringify({
                                    'type': piece[0],
                                    'sp': square
                                }))
                            } else {
                                squareBeProtected.push(JSON.stringify({
                                    'type': piece[0],
                                    'sp': square
                                }))
                            }
                        }
                    }
                }
            }
        }

        return {
            'attacks': squareBeAttacked,
            'protects': squareBeProtected
        }
    }

    //xac dinh tat ca cac o bao ve va tan cong cua ca hai ben - den va trang
    //mục đích để quân vua không được phép di chuyển vào những ô này
    //cũng như không ăn được nhưng quân cờ có bảo kê
    matchAllSquareBeAttackedOrBeProtected() {
        let squaresBeAttacked = []
        let squaresBeProtected = []

        this.pieces.forEach(({ piece, coordinate }) => {
            const { attacks, protects } = this.pieceAttackOrProtectPieces(piece, coordinate)

            squaresBeAttacked = [...new Set(squaresBeAttacked.concat(attacks))]
            squaresBeProtected = [...new Set(squaresBeProtected.concat(protects))]
        })

        const attacks = {
            'w': squaresBeAttacked.map((e) => {
                const { type, sp } = JSON.parse(e)
                if (type === 'w') return sp
                return null
            }).filter(p => p),
            'b': squaresBeAttacked.map((e) => {
                const { type, sp } = JSON.parse(e)
                if (type === 'b') return sp
                return null
            }).filter(p => p)
        }
        const protects = {
            'w': squaresBeProtected.map((e) => {
                const { type, sp } = JSON.parse(e)
                if (type === 'w') return sp
                return null
            }).filter(p => p),
            'b': squaresBeProtected.map((e) => {
                const { type, sp } = JSON.parse(e)
                if (type === 'b') return sp
                return null
            }).filter(p => p)
        }

        this.attacks = attacks
        this.protects = protects
    }

    //mat nhap thanh canh vua
    disableCastleSideKing(square) {
        if (this.direction === 1) {
            if (square === 8) { //white
                return {
                    ...this.canCastle,
                    'w': {
                        'k': false,
                        'q': this.canCastle.w.q
                    }
                }
            } return { // square 64
                ...this.canCastle,
                'b': {
                    'k': false,
                    'q': this.canCastle.b.q
                }
            }
        } else {
            if (square === 1) { // black
                return {
                    ...this.canCastle,
                    'b': {
                        'k': false,
                        'q': this.canCastle.b.q
                    }
                }
            } return {
                ...this.canCastle,
                'w': {
                    'k': false,
                    'q': this.canCastle.w.q
                }
            }
        }
    }

    //mat nhap thanh canh hau
    disableCastleSideQueen(square) {
        if (this.direction === 1) {
            if (square === 1) {
                return {
                    ...this.canCastle,
                    'w': {
                        'k': this.canCastle.w.k,
                        'q': false
                    }
                }
            } return { // square 57
                ...this.canCastle,
                'b': {
                    'k': this.canCastle.b.k,
                    'q': false
                }
            }
        } else {
            if (square === 64) {
                return {
                    ...this.canCastle,
                    'w': {
                        'k': this.canCastle.w.k,
                        'q': false
                    }
                }
            } return { // square 8
                ...this.canCastle,
                'b': {
                    'k': this.canCastle.b.k,
                    'q': false
                }
            }
        }
    }

    //mat nhap thanh
    disableCastle(piece, square, takenSquare) {

        //trường hợp vua di chuyển hoặc ăn quân
        if (['wk', 'bk'].includes(piece)) {
            if (piece[0] === 'w') {
                this.canCastle = {
                    ...this.canCastle,
                    'w': {
                        'k': false,
                        'q': false
                    }
                }
            }
            else {
                this.canCastle = {
                    ...this.canCastle,
                    'b': {
                        'k': false,
                        'q': false
                    }
                }
            }

        }

        //trường hợp quân xe
        else if (['wr', 'br'].includes(piece)) {
            const color = piece[0]

            if (color === 'w') {
                // nếu xe ăn quân xe của đối phương -> mất nhập thành của bên mình và bên đối thủ
                if (takenSquare === 57 || takenSquare === 8) this.canCastle = this.disableCastleSideQueen(takenSquare)
                if (takenSquare === 1 || takenSquare === 64) this.canCastle = this.disableCastleSideKing(takenSquare)
                // nếu xe di chuyển hoặc ăn quân -> mất nhập thành cánh của quân xe đấy
                if (
                    (square === 8 && this.direction === 1) ||
                    (square === 57 && this.direction === 0)
                ) {
                    this.canCastle = this.disableCastleSideKing(square)
                }
                if (
                    (square === 1 && this.direction === 1) ||
                    (square === 64 && this.direction === 0)
                ) {
                    this.canCastle = this.disableCastleSideQueen(square)
                }
            } else {
                if (takenSquare === 1 || takenSquare === 64) this.canCastle = this.disableCastleSideQueen(takenSquare)
                if (takenSquare === 8 || takenSquare === 57) this.canCastle = this.disableCastleSideKing(takenSquare)
                if (
                    (square === 8 && this.direction === 0) ||
                    (square === 57 && this.direction === 1)
                ) {
                    this.canCastle = this.disableCastleSideQueen(square)
                }
                if (
                    (square === 1 && this.direction === 0) ||
                    (square === 64 && this.direction === 1)
                ) {
                    this.canCastle = this.disableCastleSideKing(square)
                }
            }
        } else {
            // nếu quân xe bị ăn -> mất nhập thành cánh của quân xe đấy
            const color = piece[0]
            if (color === 'w') {
                if (takenSquare === 57 || takenSquare === 8) this.canCastle = this.disableCastleSideQueen(takenSquare)
                else if (takenSquare === 1 || takenSquare === 64) this.canCastle = this.disableCastleSideKing(takenSquare)
            } else {
                if (takenSquare === 1 || takenSquare === 64) this.canCastle = this.disableCastleSideQueen(takenSquare)
                else if (takenSquare === 8 || takenSquare === 57) this.canCastle = this.disableCastleSideKing(takenSquare)
            }
        }
    }

    matchAllSquareEP(step, relocatedSquare, piece) {
        if (['wp', 'bp'].includes(piece)) {
            const newSquareEP = this.allowEnPassant(
                step,
                relocatedSquare,
                piece
            )

            if (newSquareEP) {
                this.squaresEP = [newSquareEP]
                return
            }
        }
        this.squaresEP = []
    }

    kingSquare(color) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.board[i][j]?.type === color) {
                    return [i, j]
                }
            }
        }
    }

    isDiagonal(coordinate) {
        return Math.abs(coordinate[0]) === Math.abs(coordinate[1])
    }

    isStraight(coordinate) {
        return coordinate[0] === 0 || coordinate[1] === 0
    }

    matchAllSquaresBePinned() {
        const king = this.methods.find(k => k.piece === 'king')
        const pins = []

        for (const typeOfKing of king.alias) {
            const [rowKing, colKing] = this.kingSquare(typeOfKing)

            for (const { coordinate: [dy, dx] } of king.move) {
                let squarePinned = null
                let newRow = rowKing
                let newCol = colKing

                for (let step = 1; step < 8; step++) {
                    newRow -= dy
                    newCol += dx

                    if (newCol >= 8 || newCol < 0 || newRow >= 8 || newRow < 0) break

                    if (!this.board[newRow][newCol]?.type) continue

                    if (this.board[newRow][newCol].type[0] === typeOfKing[0]) {
                        if (squarePinned === null) {
                            squarePinned = {
                                'square': 8 * (8 - newRow - 1) + newCol + 1,
                                'direction': [dy, dx]
                            }
                        } else {
                            break
                        }
                    } else {
                        if (squarePinned) {
                            if (
                                this.board[newRow][newCol].type[1] === 'q' ||
                                (this.board[newRow][newCol].type[1] === 'r' && this.isStraight(squarePinned.direction)) ||
                                (this.board[newRow][newCol].type[1] === 'b' && this.isDiagonal(squarePinned.direction))
                            ) {
                                pins.push(squarePinned)
                            } else break
                        }
                    }
                }
            }
        }
        this.pins = pins
    }

    replaceAction(rowReSquare, colReSquare, currentSquare, relocatedSquare) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].square === currentSquare && ['wp', 'bp'].includes(this.pieces[i].piece)) {
                this.pieces[i] = {
                    ...this.pieces[i],
                    'square': relocatedSquare,
                    'coordinate': [rowReSquare, colReSquare],
                    'deploy': true
                }
            } else if (this.pieces[i].square === currentSquare) {
                this.pieces[i] = {
                    ...this.pieces[i],
                    'square': relocatedSquare,
                    'coordinate': [rowReSquare, colReSquare],
                }
            }
        }
    }

    captureAction(takenSquare) {
        this.pieces = this.pieces.filter(p => {
            if (p.square === takenSquare) {
                return false
            } return true
        })
    }

    soundEffect(castle, type = "move") {
        if (this.kingDanger('w') || this.kingDanger('b')) {
            this.sound.check.currentTime = 0
            this.sound.check.play()
            return
        } else if (castle) {
            this.sound.castle.currentTime = 0
            this.sound.castle.play()
            return
        } else if (type === "move") {
            this.sound.move.currentTime = 0
            this.sound.move.play()
            return
        } else {
            this.sound.capture.currentTime = 0
            this.sound.capture.play()
            return
        }
    }

    //di chuyen quan co den vi tri moi
    replacePiece(
        currentSquare,
        relocatedSquare,
        piece,
        isCastle = false
    ) {
        if (piece[0] === this.turn || isCastle) {

            const [rowCurSquare, colCurSquare] = this.calRowAndCol(currentSquare)
            const [rowReSquare, colReSquare] = this.calRowAndCol(relocatedSquare)

            //cap nhat lai luot
            this.turn = piece[0] === 'w' ? 'b' : 'w'
            //============================================================================================

            //cap nhat ca vi tri co the bat tot qua duong
            this.matchAllSquareEP(Math.abs(rowReSquare - rowCurSquare), relocatedSquare, piece)
            //============================================================================================

            //co the nhap thanh hay da mat nhap thanh
            const canCastle = this.canCastle
            this.disableCastle(piece, currentSquare, 0)
            //============================================================================================

            //Cap nhat o co tren ban co
            this.replace(
                rowCurSquare,
                colCurSquare,
                rowReSquare,
                colReSquare,
                relocatedSquare
            )
            //============================================================================================

            //Cap nhat trang thai, vi tri quan co
            //template piece 
            // {
            //     'id': 23,
            //     'piece': 'wp',
            //     'square': 15,
            //     'coordinate': [6, 6],
            //     'deploy': false
            // }
            this.replaceAction(rowReSquare, colReSquare, currentSquare, relocatedSquare)
            this.matchAllSquareBeAttackedOrBeProtected()
            this.matchAllSquaresBePinned()
            this.justAllowMove(this.turn)
            this.checkmate(this.turn)
            if (this.notEnoughForce()) {
                this.isDraw = {
                    draw: true,
                    reason: 'Insufficient Material'
                }
            }

            //vi nhap thanh va 2 lan di chuyen quan phai gioi han de chi xuat ra 1 nuoc di
            if (isCastle && piece[1] === 'r') {
                return this.getState()
            }
            //============================================================================

            //============================================================================
            this.soundEffect(isCastle)

            //thêm và show ra nuoc di tren movelist
            let typeMove = 'replace'
            if (!canCastle[piece[0]].k && isCastle) {
                typeMove = 'castleSideKing'
            } else if (!canCastle[piece[0]].q && isCastle) {
                typeMove = 'castleSideQueen'
            }

            const move = this.generateMove(
                typeMove,
                this.kingDanger(this.turn),
                this.hasCheckmate.checkmate,
                relocatedSquare
            )

            if (this.moves?.[this.bout - 1]) {
                this.moves[this.bout - 1] = {
                    ...this.moves[this.bout - 1],
                    'black': {
                        move,
                        piece
                    }
                }
                this.bout += 1
            } else {
                this.moves.push({
                    'turn': this.bout,
                    'white': {
                        move,
                        piece
                    }
                })
            }
            //==============================================================================

            this.fen = this.generateFENString(
                this.calculateFiftyRule()
            )

            return this.getState()
            //============================================================================================
        }
        return this.getState()
    }

    //gam giong voi replacePiece, cung di chuyen quan co den vi tri moi, nhung quan co cu o vi tri moi do se bien mat --> an quan
    capturePiece(
        currentSquare,
        takenSquare,
        piece
    ) {

        if (piece[0] === this.turn) {

            this.turn = piece[0] === 'w' ? 'b' : 'w'

            const [rowCurSquare, colCurSquare] = this.calRowAndCol(currentSquare)
            const [rowTaSquare, colTaSquare] = this.calRowAndCol(takenSquare)

            this.disableCastle(piece, currentSquare, takenSquare)

            if (
                ['wp', 'bp'].includes(piece) &&
                this.squaresEP.length !== 0
            ) {
                if (
                    this.squaresEP[0].takeSq.includes(currentSquare) &&
                    this.squaresEP[0].sq === takenSquare
                ) {
                    const newTakenSquare = takenSquare > 32 ? takenSquare - 8 : takenSquare + 8
                    const [row, col] = this.calRowAndCol(newTakenSquare)
                    this.board[row][col] = {}

                    this.captureAction(newTakenSquare)
                    this.replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare)
                } else {
                    this.captureAction(takenSquare)
                    this.replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare)
                }
            } else {
                //nuoc an quan binh thuong
                this.captureAction(takenSquare)
                this.replaceAction(rowTaSquare, colTaSquare, currentSquare, takenSquare)
            }

            this.replace(
                rowCurSquare,
                colCurSquare,
                rowTaSquare,
                colTaSquare,
                takenSquare
            )

            this.matchAllSquareBeAttackedOrBeProtected()
            this.matchAllSquaresBePinned()
            this.justAllowMove(this.turn)
            this.checkmate(this.turn)
            if (this.notEnoughForce()) {
                this.isDraw = {
                    draw: true,
                    reason: 'Insufficient Material'
                }
            }

            this.soundEffect(false, "capture")

            const move = this.generateMove(
                'capture',
                this.kingDanger(this.turn),
                this.hasCheckmate.checkmate,
                takenSquare,
                currentSquare
            )

            if (this.moves?.[this.bout - 1]) {
                this.moves[this.bout - 1] = {
                    ...this.moves[this.bout - 1],
                    'black': {
                        move,
                        piece
                    }
                }
                this.bout += 1
            } else {
                this.moves.push({
                    'turn': this.bout,
                    'white': {
                        move,
                        piece
                    }
                })
            }

            this.fen = this.generateFENString(
                this.calculateFiftyRule()
            )

            return this.getState()
        }

        return this.getState()
    }

    isPawnPromotion(piece, row) {
        return (
            (piece === 'wp' && row === 0 && this.direction === 1) ||
            (piece === 'wp' && row === 7 && this.direction === 0) ||
            (piece === 'bp' && row === 0 && this.direction === 0) ||
            (piece === 'bp' && row === 7 && this.direction === 1)
        )
    }

    pawnPromotionByReplaceOrCapture(replace, capture) {
        if (replace !== 0) {
            const [row, _] = this.calRowAndCol(replace)
            return [row, replace, { 'action': 'replace' }]
        } else if (capture !== 0) {
            const [row, _] = this.calRowAndCol(capture)
            return [row, capture, { 'action': 'capture' }]
        } return [-1, -1, {}]
    }

    listPawnAbleToTransform(piece, square, reSquare, action, row) {
        const color = piece[0]
        const queen = color + 'q'
        const rook = color + 'r'
        const bishop = color + 'b'
        const knight = color + 'n'

        if (row === 0) {
            this.listPawnCanBecome = [
                {
                    'type': queen,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare
                },
                {
                    'type': rook,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare - 8
                },
                {
                    'type': bishop,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare - 16
                },
                {
                    'type': knight,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare - 24
                },
                {
                    'type': 'cancelPromotion',
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare - 32
                }
            ]
        } else if (row === 7) {
            this.listPawnCanBecome = [
                {
                    'type': queen,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare
                },
                {
                    'type': rook,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare + 8
                },
                {
                    'type': bishop,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare + 16
                },
                {
                    'type': knight,
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare + 24
                },
                {
                    'type': 'cancelPromotion',
                    'action': action,
                    'curSquare': square,
                    'reSquare': reSquare,
                    'location': reSquare + 32
                }
            ]
        }
    }

    fillColor(square, light, dark) {
        const [i, j] = this.calRowAndCol(square)
        if (
            (i % 2 === 0 && j % 2 === 0) ||
            (i % 2 === 1 && j % 2 === 1)
        ) return light
        return dark
    }

    modifyMaterial(square, type) {
        for (let i = 0; i < this.pieces.length; i++) {
            if (this.pieces[i].square === square) {
                this.pieces[i].piece = type
                break
            }
        }
    }

    modifyBoard(square, type) {
        const [row, col] = this.calRowAndCol(square)
        const point = {
            'r': 5,
            'n': 3,
            'b': 3,
            'q': 9
        }
        this.board[row][col] = {
            ...this.board[row][col],
            'value': point[type[1]],
            'type': type
        }
    }

    getAllAttackSquareOfPiece(piece, square) {
        const methodOfPiece = this.methods.find(p => p.alias.includes(piece))
        const squares = []
        const [row, col] = this.calRowAndCol(square)

        if (['wp', 'bp'].includes(piece)) {
            methodOfPiece.takeSpecial[this.direction].forEach(({ cor: [dy, dx] }) => {
                const newRow = row - dy
                const newCol = col + dx
                if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                    if (
                        this.board[newRow][newCol]?.type &&
                        piece[0] !== this.board[newRow][newCol]?.type?.[0]
                    ) {
                        squares.push(8 * (8 - newRow - 1) + newCol + 1)
                    }
                }
            })
        } else {
            methodOfPiece.move.forEach(({ scope, coordinate: [dy, dx] }) => {
                let newRow = row - dy
                let newCol = col + dx

                // hau, tuong, xe
                if (scope) {
                    let sq = null
                    while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                        if (this.board[newRow][newCol]?.type) {
                            if (piece[0] === this.board[newRow][newCol].type[0]) break

                            if (
                                piece[0] !== this.board[newRow][newCol].type[0] &&
                                !sq
                            ) {
                                sq = 8 * (8 - newRow - 1) + newCol + 1
                                squares.push(sq)
                            } else break
                        } else {
                            newRow -= dy
                            newCol += dx
                        }
                    }
                }
                // ma
                else {
                    if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                        if (
                            this.board[newRow][newCol]?.type &&
                            piece[0] !== this.board[newRow][newCol]?.type?.[0]
                        ) {
                            squares.push(8 * (8 - newRow - 1) + newCol + 1)
                        }
                    }
                }
            })
        }

        return squares
    }

    getAllMoveSquareOfPiece(piece, square) {
        const methodOfPiece = this.methods.find(p => p.alias.includes(piece))
        const squares = []
        const [row, col] = this.calRowAndCol(square)

        if (['wp', 'bp'].includes(piece)) {
            for (const { coordinate: [dy, dx] } of methodOfPiece.move[this.direction]) {
                const newRow = row - dy
                const newCol = col + dx
                if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                    if (
                        Object.keys(this.board[newRow][newCol]).length === 0
                    ) {
                        squares.push(8 * (8 - newRow - 1) + newCol + 1)
                    }
                } else break
            }
        } else {
            for (const { scope, coordinate: [dy, dx] } of methodOfPiece.move) {
                let newRow = row - dy
                let newCol = col + dx

                // hau, tuong, xe
                if (scope) {
                    while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                        if (
                            Object.keys(this.board[newRow][newCol]).length === 0
                        ) {
                            squares.push(8 * (8 - newRow - 1) + newCol + 1)
                            newRow -= dy
                            newCol += dx
                        } else break
                    }
                }
                // ma
                else {
                    if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {

                        if (
                            Object.keys(this.board[newRow][newCol]).length === 0
                        ) {
                            squares.push(8 * (8 - newRow - 1) + newCol + 1)
                        }
                    }
                }
            }
        }

        return squares
    }

    findAllPieceAttackKing(color) {
        const [rowK, colK] = this.kingSquare(color + 'k')
        const king = 8 * (7 - rowK) + colK + 1
        const moveOfKing = this.methods.find(k => k.piece === 'king')?.move
        const moveOfKnight = this.methods.find(k => k.piece === 'knight')?.move
        const attackers = []

        // kiểm các hướng của vua xem có quân nào đang tấn công không
        moveOfKing.forEach(({ coordinate: [dy, dx] }) => {
            let newRow = rowK - dy
            let newCol = colK + dx

            while ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                if (
                    this.board[newRow][newCol]?.type &&
                    this.board[newRow][newCol]?.type?.[0] !== color
                ) {
                    if (this.getAllAttackSquareOfPiece(
                        this.board[newRow][newCol].type,
                        this.board[newRow][newCol].square
                    ).includes(king)) {
                        attackers.push({
                            'piece': this.board[newRow][newCol].type,
                            'square': 8 * (7 - newRow) + newCol + 1
                        })
                    }
                    break
                }
                else if (
                    this.board[newRow][newCol]?.type &&
                    this.board[newRow][newCol]?.type?.[0] === color
                ) { break }
                else {
                    newRow -= dy
                    newCol += dx
                }
            }
        })

        // quân mã nó không nằm trên các hướng thẳng mặt hay chéo vua
        moveOfKnight.forEach(({ coordinate: [dy, dx] }) => {
            let newRow = rowK - dy
            let newCol = colK + dx

            if ((newCol >= 0 && newCol < 8) && (newRow >= 0 && newRow < 8)) {
                if (this.board[newRow][newCol]?.type?.[1] === 'n' &&
                    this.board[newRow][newCol]?.type?.[0] !== color
                ) {
                    attackers.push({
                        'piece': this.board[newRow][newCol].type,
                        'square': 8 * (7 - newRow) + newCol + 1
                    })
                }
            }
        })


        return attackers
    }

    findAllSquareFromKingToCheck(color, attacker) {
        let squares = [];
        const [rowK, colK] = this.kingSquare(color + 'k')
        const [rowA, colA] = this.calRowAndCol(attacker.square)

        if (attacker.piece[1] !== 'n') {

            const dy = Math.sign(rowA - rowK)
            const dx = Math.sign(colA - colK)

            let newRow = rowK + dy
            let newCol = colK + dx

            while (newRow !== rowA || newCol !== colA) {
                squares.push(8 * (7 - newRow) + newCol + 1)
                newRow += dy
                newCol += dx
            }
        }

        return squares;
    }

    justAllowMove(color) {
        const attackers = this.findAllPieceAttackKing(color)

        if (attackers.length > 2) {
            for (let i = 0; i < this.pieces.length; i++) {
                if (this.pieces[i].piece[0] === color && this.pieces[i].piece[1] !== 'k') this.pieces[i].ban = true
            }
        }
        else if (attackers.length === 1) {
            const path = this.findAllSquareFromKingToCheck(color, attackers[0])
            for (let i = 0; i < this.pieces.length; i++) {
                const { piece, square } = this.pieces[i]
                const pins = this.pins.map(({ square: sq }) => sq)
                if (piece[0] === color && piece[1] !== 'k' && !pins.includes(square)) {
                    let moves = this.getAllMoveSquareOfPiece(piece, square)
                    let takes = this.getAllAttackSquareOfPiece(piece, square)

                    moves = moves.filter(move => path.includes(move))
                    takes = takes.filter(take => take === attackers[0].square)

                    this.pieces[i].allowMove = {
                        'move': moves,
                        'take': takes
                    }
                }
            }
        }
        else {
            for (let i = 0; i < this.pieces.length; i++) {
                this.pieces[i].ban = false
                this.pieces[i].allowMove = {
                    'move': [],
                    'take': []
                }
            }
        }
    }

    noMoreMove(color) {
        for (let i = 0; i < this.pieces.length; i++) {
            const { piece: name, square } = this.pieces[i]
            if (name[0] === color && (name[1] !== 'k' || name[1] !== 'q')) {
                const p = this.methods.find(p => p.alias.includes(name))
                const pinned = this.pins.find(({ square: sq }) => sq === square)
                const [r, c] = this.calRowAndCol(square)
                if (p.piece === 'pawn') {
                    const conditions = []
                    const { move, takeSpecial } = p

                    if (pinned) {
                        if (this.isStraight(pinned.direction) && pinned.direction[0] === 0) continue // ghim ngang thì chắc chắn không thể đi
                        if (this.isStraight(pinned.direction) && pinned.direction[1] === 0) {
                            const [i, j] = move[this.direction][0].coordinate
                            if (Object.keys(this.board[r - i][c + j]).length !== 0) continue // ghim dọc và quân ghim chặn ngay trước 1 ô
                            else return false
                        }
                        if (this.isDiagonal(pinned.direction)) {
                            let [x, y] = pinned.direction
                            for (let take of takeSpecial[this.direction]) {
                                const [i, j] = take.cor
                                if (x === -i && y === -j) {
                                    x = -i
                                    y = -j
                                }
                            }
                            if ((r - i < 0) || (r - i >= 8) || (c + j < 0) || (c + j >= 8)) continue
                            if (Object.keys(this.board[r - i][c + j]).length === 0) continue // ghim chéo và không thể ăn quân ghim
                        }
                    }

                    const [i, j] = move[this.direction][0].coordinate
                    if (Object.keys(this.board[r - i][c + j]).length === 0) return false // ô ngay phía trước có bị bịt không

                    const takeSomething = []
                    for (let take of takeSpecial[this.direction]) {
                        const [i, j] = take.cor
                        if ((r - i < 0) || (r - i >= 8) || (c + j < 0) || (c + j >= 8)) continue
                        if (
                            Object.keys(this.board[r - i][c + j]).length !== 0 &&
                            this.board[r - i][c + j].type[0] !== name[0]
                        ) return false // không thể ăn quân nào để thoát 
                    }
                    conditions.push(takeSomething.every(e => e))

                    if (this.squaresEP.length !== 0) {
                        if (this.squaresEP[0].takenSq.includes(square)) return false // con tốt này có thể bắt tốt qua đường không
                    }
                }
                else if (p.piece === 'knight') {
                    if (pinned) continue
                    for (let mov of p.move) {
                        let [i, j] = mov.coordinate
                        if ((r - i < 0) || (r - i >= 8) || (c + j < 0) || (c + j >= 8)) continue
                        if (Object.keys(this.board[r - i][c + j]).length === 0) return false
                        if (
                            Object.keys(this.board[r - i][c + j]).length !== 0 &&
                            this.board[r - i][c + j].type[0] !== name[0]
                        ) return false
                    }
                }
                else if (p.piece === 'bishop') {
                    if (pinned) {
                        if (this.isStraight(pinned.direction)) continue
                    }
                    for (let mov of p.move) {
                        let [i, j] = mov.coordinate
                        if ((r - i < 0) || (r - i >= 8) || (c + j < 0) || (c + j >= 8)) continue
                        if (Object.keys(this.board[r - i][c + j]).length === 0) return false
                        if (
                            Object.keys(this.board[r - i][c + j]).length !== 0 && 
                            this.board[r - i][c + j].type[0] !== name[0]
                        ) return false
                    }
                }
                else if (p.piece === 'rook') {
                    if (pinned) {
                        if (this.isDiagonal(pinned.direction)) continue
                    }
                    for (let mov of p.move) {
                        let [i, j] = mov.coordinate
                        if ((r - i < 0) || (r - i >= 8) || (c + j < 0) || (c + j >= 8)) continue
                        if (Object.keys(this.board[r - i][c + j]).length === 0) return false
                        if (
                            Object.keys(this.board[r - i][c + j]).length !== 0 &&
                            this.board[r - i][c + j].type[0] !== name[0]
                        ) return false
                    }
                }
            }
        }

        return true
    }

    notEnoughForce() {
        if (this.pieces.length === 2) {
            return true
        }
        if (this.pieces.length === 3) {
            const remainPiece = this.pieces.filter(p => p.piece[1] === 'n' || p.piece[1] === 'b')
            if (remainPiece.length === 1) return true
        }
        if (this.pieces.length === 4) {
            const bishops = this.pieces.filter(p => p.piece[1] === 'b')
            if (bishops.length === 2 && bishops[0].piece !== bishops[1].piece) {
                const [x, y] = bishops[0].coordinate
                const [z, t] = bishops[1].coordinate

                const color1 = (x + y) % 2
                const color2 = (z + t) % 2

                if (color1 === color2) return true
            }

            const knights = this.pieces.filter(p => p.piece[1] === 'n')
            if (knights.length === 2 && knights[0].piece === knights[1].piece) return true
        }

        return false
    }

    checkmate(color) {
        const colorOpp = color === 'w' ? 'b' : 'w'
        const [rowK, colK] = this.kingSquare(color + 'k')
        const squareKing = 8 * (7 - rowK) + colK + 1
        const king = this.methods.find(k => k.piece === 'king')
        const invalidMoveOfKing = king.move.map(({ coordinate: [dy, dx] }) => {
            const newRow = rowK - dy
            const newCol = colK + dx
            const newSquare = 8 * (7 - newRow) + newCol + 1

            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) return 0

            if (
                this.board[newRow][newCol]?.type?.[0] === color ||
                (this.board[newRow][newCol]?.type?.[0] !== color &&
                    this.protects[colorOpp].includes(newSquare))
            ) return 0
            if (this.attacks[colorOpp].includes(newSquare)) return 0
            return newSquare
        }).filter(sq => sq)

        const noAnyInvalidMove = invalidMoveOfKing.length === 0
        const kingDanger = this.attacks[colorOpp].includes(squareKing)
        const noPreventCheckByPiece = this.pieces.filter(piece => {
            return (
                piece.piece[0] === color &&
                (piece.allowMove.move.length !== 0 ||
                    piece.allowMove.take.length !== 0)
            )
        }).length === 0

        if (noAnyInvalidMove && kingDanger && noPreventCheckByPiece) {
            this.hasCheckmate = {
                'checkmate': true,
                'by': colorOpp
            }
            return
        }

        if (noAnyInvalidMove && !kingDanger) {
            console.log('ok')
            if (this.noMoreMove(color)) {
                this.isDraw = {
                    draw: true,
                    reason: 'Stalemate'
                }
            }
        }

        this.hasCheckmate = {
            'checkmate': false,
            'by': ''
        }

    }

    kingDanger(color) {
        const [r, c] = this.kingSquare(color + 'k')
        return this.attacks[color === 'w' ? 'b' : 'w'].includes(8 * (7 - r) + c + 1)
    }

    generateMove(typeMove, kingthreat, checkmate, reSquare, curSquare = 0) {
        let strMove = ''

        const coordinate = [
            {
                'col': ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
                'row': ['1', '2', '3', '4', '5', '6', '7', '8']
            },
            {
                'col': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
                'row': ['8', '7', '6', '5', '4', '3', '2', '1']
            }
        ]
        const [_, cc] = this.calRowAndCol(curSquare)
        const [rr, rc] = this.calRowAndCol(reSquare)

        if (typeMove === 'castleSideKing') {
            strMove += 'O-O'
        } else if (typeMove === 'castleSideQueen') {
            strMove += 'O-O-O'
        } else if (typeMove === 'replace') {
            strMove += coordinate[this.direction].col[rc] + coordinate[this.direction].row[rr]
        } else {
            strMove += (
                coordinate[this.direction].col[cc] +
                'x' +
                coordinate[this.direction].col[rc] +
                coordinate[this.direction].row[rr]
            )
        }

        if (checkmate) {
            strMove += '#'
            return strMove
        }
        if (kingthreat) {
            strMove += '+'
        }
        return strMove
    }

    identifyCoordinate() {
        if (!this.squaresEP?.[0]?.sq) return '-'

        const coordinate = [
            {
                'col': ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
                'row': ['1', '2', '3', '4', '5', '6', '7', '8']
            },
            {
                'col': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
                'row': ['8', '7', '6', '5', '4', '3', '2', '1']
            }
        ]
        const [row, col] = this.calRowAndCol(this.squaresEP[0].sq)
        return (
            coordinate[this.direction].col[col] + coordinate[this.direction].row[row]
        )
    }

    generateCastleString() {
        let res = ''

        if (this.canCastle.w.k) {
            res += 'K'
        }
        if (this.canCastle.w.q) {
            res += 'Q'
        }
        if (this.canCastle.b.k) {
            res += 'k'
        }
        if (this.canCastle.b.q) {
            res += 'q'
        }

        if (res.length === 0) {
            return '-'
        } else return res
    }

    generateFENString(fiftyRule) {
        let FEN = ''

        const EPString = this.identifyCoordinate()
        const castleString = this.generateCastleString()

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (Object.keys(this.board[i][j]).length === 0) {
                    let interator = j
                    let count = 1

                    while (
                        interator + 1 < 8 &&
                        Object.keys(this.board[i]?.[interator + 1]).length === 0
                    ) {
                        count += 1
                        interator += 1
                    }

                    FEN += `${count}`
                    j = interator
                } else {
                    if (this.board[i][j].type[0] === 'w') {
                        FEN += this.board[i][j].type[1].toUpperCase()
                    } else {
                        FEN += this.board[i][j].type[1]
                    }
                }
            }
            if (i !== 7) {
                FEN += '/'
            }
        }

        if (this.direction === 0) {
            FEN = FEN.split("").reverse().join("")
        }

        FEN = `${FEN} ${this.turn} ${castleString} ${EPString} ${fiftyRule} ${this.bout}`
        return FEN
    }

    isCaptureOrPawnMove(move, piece) {
        return /^.?x./.test(move) || piece[1] === 'p'
    }

    lastCaptureOrPawnMove(turn, color) {
        const { move, piece } = color
        if (this.isCaptureOrPawnMove(move, piece)) {
            return {
                'turn': turn,
                'color': piece[0]
            }
        } return {}
    }

    calculateNumberMoves(turn) {
        let allMove = 0
        for (let i = turn; i < this.moves.length; i++) {
            allMove += Object.keys(this.moves[i]).length - 1
        }

        return allMove
    }

    calculateFiftyRule() {
        let last = {}

        for (const { turn, white, black } of this.moves) {
            let res = this.lastCaptureOrPawnMove(turn, white)
            last = {
                ...last,
                ...res
            }

            if (black) {
                res = this.lastCaptureOrPawnMove(turn, black)
                last = {
                    ...last,
                    ...res
                }
            }
        }


        if (last?.turn && last?.turn === this.moves.length) {
            if (
                last.color === 'w' &&
                this.moves[last.turn - 1].hasOwnProperty('black')
            ) {
                return 1
            }
            return 0
        } else if (last?.turn && last?.turn !== this.moves.length) {
            const allMove = this.calculateNumberMoves(last.turn)
            if (
                last.color === 'w'
            ) {
                return allMove + 1
            }
            return allMove
        } else {
            return this.calculateNumberMoves(0)
        }
    }


    //  danh cho chess bot =================================================================
    // =============================================================================================

    convertCorToSquare(cor) {
        const coordinate = [
            { 'h': 0, 'g': 1, 'f': 2, 'e': 3, 'd': 4, 'c': 5, 'b': 6, 'a': 7 },
            { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 }
        ]

        const col = coordinate[this.direction][cor[0]]
        const row = this.direction === 1 ? 8 - parseInt(cor[1]) : parseInt(cor[1]) - 1
        const square = 8 * (7 - row) + col + 1

        return square
    }

    typeAction(currentSquare, relocatedSquare) {
        const piece = this.findPiece(currentSquare)
        const canBePiece = this.findPiece(relocatedSquare) // ô di chuyển tới có thể là quân cờ hoặc có thể là trống

        if (!piece) return { 'piece': null, 'action': 'none' }

        // 9 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên đường chéo /
        // 7 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên đường chéo \
        // 8 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này cùng nằm trên cùng cột |
        // 1 là độ lệch của ô hiện tại với ô di chuyển đến, và 2 này nằm ngay cạnh nhau trên hàng --
        // và đây cũng là các nước di chuyển bth của quân vua, còn nhập thành thì độ lệch sẽ thường là 2
        // or maybe có thể viết là [2].includes(different)
        const different = relocatedSquare - currentSquare

        if (piece.piece[1] === 'k' && Math.abs(different) === 2) {
            if (this.direction === 1) {
                if (different > 0) return { 'piece': piece, 'action': 'castle', 'side': 'k' }
                return { 'piece': piece, 'action': 'castle', 'side': 'q' }
            } else {
                if (different < 0) return { 'piece': piece, 'action': 'castle', 'side': 'k' }
                return { 'piece': piece, 'action': 'castle', 'side': 'q' }
            }
        }

        if (!canBePiece) {
            return { 'piece': piece, 'action': 'move' }
        }

        return { 'piece': piece, 'action': 'take' }
    }

    validateMove(res, relocatedSquare, kingDanger) {
        const { piece: pie, action } = res
        const { piece, allowMove, ban } = pie

        if (action === 'none') return false
        if (action === 'castle') {
            return this.canCastle[piece[0]][res.side]
        }

        if (piece[1] === 'k') return true

        if (
            (
                (allowMove[action].length > 0 && allowMove[action].includes(relocatedSquare)) ||
                (allowMove[action].length === 0 && !kingDanger)
            ) &&
            !ban

        ) {
            return true
        }

        return false
    }

    identifyRookSquare(color, side) {
        if (color === 'w') {
            if (side === 'k' && this.direction === 1) return 8
            if (side === 'k' && this.direction === 0) return 57
            if (side === 'q' && this.direction === 1) return 1
            if (side === 'q' && this.direction === 0) return 64
        }
        else {
            if (side === 'k' && this.direction === 1) return 64
            if (side === 'k' && this.direction === 0) return 1
            if (side === 'q' && this.direction === 1) return 57
            if (side === 'q' && this.direction === 0) return 8
        }
    }

    chessBotMove(move) {
        const currentSquare = this.convertCorToSquare(move.substring(0, 2))
        const relocatedSquare = this.convertCorToSquare(move.substring(2, 4))
        const promotion = move?.[4]
        const res = this.typeAction(currentSquare, relocatedSquare)
        const { piece: pie, action } = res
        if (!pie) return this.getState()

        let { piece } = pie
        const kingBeThreated = this.kingDanger(piece[0])

        if (!this.validateMove(res, relocatedSquare, kingBeThreated)) return this.getState()

        if (promotion) {
            piece = piece[0] + promotion
            this.modifyMaterial(currentSquare, piece)
            this.modifyBoard(currentSquare, piece)
        }

        if (action === 'castle') {
            const rookSquare = this.identifyRookSquare(piece[0], res.side)

            const reRookSquare =
                (rookSquare === 1 || rookSquare === 57) ?
                    relocatedSquare + 1 :
                    relocatedSquare - 1
            let tempRes = this.getState().replacePiece(
                rookSquare,
                reRookSquare,
                piece[0] + 'r',
                true
            )
            tempRes = tempRes.replacePiece(
                currentSquare,
                relocatedSquare,
                piece,
                true
            )

            return tempRes
        }

        else if (action === 'move') {
            return this.replacePiece(
                currentSquare,
                relocatedSquare,
                piece
            )

        }

        else if (action === 'take') {
            return this.capturePiece(
                currentSquare,
                relocatedSquare,
                piece
            )
        }

        return this.getState()
    }
}