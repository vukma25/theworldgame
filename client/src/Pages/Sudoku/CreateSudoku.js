
export default class SudokuGame {
    constructor(variant = {}) {
        this._size = variant?.size || 9
        this._grid = Array.from({ length: variant?.size || 9 }, () =>
            Array.from({ length: variant?.size || 9 }, () => 0)
        )
        this.difficulty = variant?.difficulty || 40
        this.answers = []
        this.puzzle = []
    }


    //getter
    getPuzzle() {
        let newPuzzle = this.puzzle
        return newPuzzle
    }

    getSolution() {
        let newSolution = this.solution
        return newSolution
    }

    getSize() {
        let size = this._size
        return size
    }

    getAnswer() {
        const answers = this.answers
        return answers
    }

    //methods 
    _solve() {
        for (let row = 0; row < this._size; row++) {
            for (let col = 0; col < this._size; col++) {
                if (this._grid[row][col] === 0) {

                    for (let num = 1; num <= this._size; num++) {
                        if (this._isValid(row, col, num)) {
                            this._grid[row][col] = num

                            if (this._solve()) {
                                return true
                            }

                            this._grid[row][col] = 0
                        }
                    }

                    //không có số nào hợp lệ để điền
                    return false
                }
            }
        }

        // không còn ô nào = 0 nữa -> giải xong
        return true
    }

    _isValid(row, col, num, grid = this._grid) {

        //kiểm tra hàng có số num chưa
        for (let i = 0; i < this._size; i++) {
            if (grid[row][i] === num) return false
        }

        //kiểm tra cột
        for (let i = 0; i < this._size; i++) {
            if (grid[i][col] === num) return false
        }


        //kiểm tra khu vực ô vuông lớn
        // ví dụ 9x9 thì kiểm tra các khu vực 3x3
        const areaSize = Math.sqrt(this._size)
        const [row_area, col_area] = [
            areaSize * Math.floor(row / areaSize),
            areaSize * Math.floor(col / areaSize)
        ]
        for (let i = 0; i < areaSize; i++) {
            for (let j = 0; j < areaSize; j++) {
                if (grid[i + row_area][j + col_area] === num) {
                    return false
                }
            }
        }

        return true
    }

    _clearGrid() {
        this._grid = Array.from({ length: this._size || 9 }, () =>
            Array.from({ length: this._size || 9 }, () => 0)
        )
    }

    _generateSuccessfullyGrid() {
        for (let row = 0; row < this._size; row++) {
            for (let col = 0; col < this._size; col++) {
                if (this._grid[row][col] === 0) return false
            }
        }

        return true
    }

    _generateFullGird() {

        while (!this._generateSuccessfullyGrid()) {

            this._clearGrid()

            const position = new Set()
            // tạo ngẫu nhiên 10 số vào grid để khởi tạo -> sau đó solve
            // cho ra một bảng hoàn chỉnh
            for (let i = 0; i < 10; i++) {
                const [row, col] = [
                    Math.floor(Math.random() * this._size),
                    Math.floor(Math.random() * this._size)
                ]
                const num = Math.floor(Math.random() * this._size) + 1

                if (
                    !position.has(`${row}-${col}`) &&
                    this._isValid(row, col, num)
                ) {
                    this._grid[row][col] = num
                    position.add(`${row}-${col}`)
                }
            }

            this._solve()

        }

    }

    _getPositions() {
        const positions = []
        for (let row = 0; row < this._size; row++) {
            for (let col = 0; col < this._size; col++) {
                positions.push([row, col])
            }
        }

        return positions
    }

    _shuffleArray(array) {
        const shuffled = array.map(([row, col]) => [row, col]); // Tạo bản copy
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Hoán đổi
        }
        return shuffled;
    }

    _hasUniqueSolution(grid) {
        const copyGrid = grid.map(rows => {
            return rows.map(col => col)
        })

        const solutions = []

        const countSolutions = () => {
            for (let row = 0; row < this._size; row++) {
                for (let col = 0; col < this._size; col++) {
                    if (copyGrid[row][col] === 0) {
                        for (let num = 1; num <= this._size; num++) {
                            if (this._isValid(row, col, num, copyGrid)) {
                                copyGrid[row][col] = num
                                countSolutions()
                                copyGrid[row][col] = 0

                                if (this._size < 16 && solutions.length > 1) return
                                if (this._size === 16 && solutions.length > 2) return
                            }
                        }

                        return
                    }
                }
            }
            solutions.push(1)
        }
        countSolutions()
        return solutions.length === 1

    }

    createPuzzle() {
        const positions = this._getPositions()
        const shuffledPositions = this._shuffleArray(positions)

        let removed = 0
        this._generateFullGird()

        //gán bằng bảng full sau đó xóa bớt các ô để tạo câu đố
        this.puzzle = this._grid.map(rows => {
            return rows.map(col => col)
        })

        for (const square of shuffledPositions) {
            if (removed >= this.difficulty) break

            const [row, col] = square
            const backup = this.puzzle[row][col]
            this.puzzle[row][col] = 0

            if (this._hasUniqueSolution(this.puzzle)) {
                removed += 1
            }
            else {
                this.puzzle[row][col] = backup
            }
        }


        //tạo xong câu đố thì cũng tạo thêm lời giải tương ứng
        this._createAnswer()

        return this.puzzle
    }

    _createAnswer() {
        const answers = []
        for (let row = 0; row < this._size; row++) {
            for (let col = 0; col < this._size; col++) {
                if (this.puzzle[row][col] === 0) {
                    answers.push({
                        "square": [row, col],
                        "correct-value": this._grid[row][col]
                    })
                }
            }
        }

        this.answers = answers
    }

}