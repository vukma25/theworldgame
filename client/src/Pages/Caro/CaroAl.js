
export default class AI {
    constructor(init) {
        this.board = init.board;
        this.size = init.size;
        this.ai = init.ai;
        this.player = init.ai === 1 ? 2 : 1;
        this.condition = init.size >= 15 ? 5 : 3;
        this.partition = { left: null, right: null, top: null, bottom: null };
        this.w = [0, 20, 17, 15.4, 14, 10];
        this.winningMove = 1000000;
        this.openFour = 100000;
        this.fork = 10000;
        this.level = init.level || 'medium';
    }

    setBoard(board) {
        this.board = board;
    }

    _partitionBoard() {
        let top = this.size - 1, left = this.size - 1, right = 0, bottom = 0;
        let found = false;
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.board[r][c] !== 0) {
                    found = true;
                    top = Math.min(top, r);
                    bottom = Math.max(bottom, r);
                    left = Math.min(left, c);
                    right = Math.max(right, c);
                }
            }
        }
        if (!found) {
            const center = Math.floor(this.size / 2);
            this.partition = {
                left: Math.max(0, center - 2),
                right: Math.min(this.size - 1, center + 2),
                top: Math.max(0, center - 2),
                bottom: Math.min(this.size - 1, center + 2)
            };
        } else {
            this.partition = {
                left: Math.max(0, left - 2),
                right: Math.min(this.size - 1, right + 2),
                top: Math.max(0, top - 2),
                bottom: Math.min(this.size - 1, bottom + 2)
            };
        }
    }

    hasNeighbors(i, j) {
        const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];
        for (let [di, dj] of dirs) {
            let ni = i + di, nj = j + dj;
            if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size && this.board[ni][nj] !== 0) {
                return true;
            }
        }
        return false;
    }

    winningPos(i, j, side) {
        let pattern3 = 0, pattern4 = 0, limit = this.condition
        let length = 1, nonBlockStart, nonBlockEnd, rightSide, reverseSide
        let iterator = 1

        // chiều ngang thuận
        while (
            j + iterator < this.size && 
            this.board[i][j + iterator] === side
        ) {
            length++; iterator++
        } rightSide = iterator
        // chiều ngang nghich
        iterator = 1
        while (
            j - iterator >= 0 && 
            this.board[i][j - iterator] === side
        ) {
            length++; iterator++
        } reverseSide = iterator

        if (length >= limit) return this.winningMove
        nonBlockStart = (j - reverseSide >= 0 && this.board[i][j - reverseSide] === 0)
        nonBlockEnd = (j + rightSide < this.size && this.board[i][j + rightSide] === 0)

        if (length === limit - 1 && (nonBlockStart || nonBlockEnd)) { pattern3++ }
        if (nonBlockStart && nonBlockEnd) {
            if (length === limit - 1) { pattern4++ }
            else if (length === limit - 2) pattern3++
        }

        //chiều dọc thuận
        length = 1;
        iterator = 1;
        while (
            i + iterator < this.size &&
            this.board[i + iterator][j] === side
        ) {
            length++; iterator++
        } rightSide = iterator
        // chiều dọc nghich
        iterator = 1
        while (
            i - iterator >= 0 &&
            this.board[i - iterator][j] === side
        ) {
            length++; iterator++
        } reverseSide = iterator

        if (length >= limit) return this.winningMove
        nonBlockStart = (i - reverseSide >= 0 && this.board[i - reverseSide][j] === 0)
        nonBlockEnd = (i + rightSide < this.size && this.board[i + rightSide][j] === 0)

        if (length === limit - 1 && (nonBlockStart || nonBlockEnd)) { pattern3++ }
        if (nonBlockStart && nonBlockEnd) {
            if (length === limit - 1) {pattern4++}
            else if (length === limit - 2) pattern3++
        }

        //chiều chéo phụ thuận
        length = 1;
        iterator = 1;
        while (
            i + iterator < this.size &&
            j + iterator < this.size &&
            this.board[i + iterator][j + iterator] === side
        ) {
            length++; iterator++
        } rightSide = iterator
        // chiều chéo phụ nghich
        iterator = 1
        while (
            i - iterator >= 0 &&
            j - iterator >= 0 &&
            this.board[i - iterator][j - iterator] === side
        ) {
            length++; iterator++
        } reverseSide = iterator

        if (length >= limit) return this.winningMove
        nonBlockStart = (
            i - reverseSide >= 0 &&
            j - reverseSide >= 0 &&
            this.board[i - reverseSide][j - reverseSide] === 0
        )
        nonBlockEnd = (
            i + rightSide < this.size && 
            j + rightSide < this.size && 
            this.board[i + rightSide][j + rightSide] === 0
        )

        if (length === limit - 1 && (nonBlockStart || nonBlockEnd)) { pattern3++ }
        if (nonBlockStart && nonBlockEnd) {
            if (length === limit - 1) {pattern4++}
            else if (length === limit - 2) pattern3++
        }

        //chiều chéo chính thuận
        length = 1;
        iterator = 1
        while (
            i - iterator >= 0 &&
            j + iterator < this.size &&
            this.board[i - iterator][j + iterator] === side
        ) {
            length++; iterator++
        } rightSide = iterator
        // chiều chéo chính nghich
        iterator = 1
        while (
            i + iterator < this.size &&
            j - iterator >= 0 &&
            this.board[i + iterator][j - iterator] === side
        ) {
            length++; iterator++
        } reverseSide = iterator

        if (length >= limit) return this.winningMove
        nonBlockStart = (
            i + reverseSide < this.size && 
            j - reverseSide >= 0 &&
            this.board[i + reverseSide][j - reverseSide] === 0
        )
        nonBlockEnd = (
            i - rightSide >= 0 && 
            j + rightSide < this.size &&
            this.board[i - rightSide][j + rightSide] === 0
        )

        if (length === limit - 1 && (nonBlockStart || nonBlockEnd)) { pattern3++ }
        if (nonBlockStart && nonBlockEnd) {
            if (length === limit - 1) {pattern4++}
            else if (length === limit - 2) pattern3++
        }

        if (pattern4 !== 0) return this.openFour
        if (pattern3 >= 2) return this.fork //tạo nước đôi hoặc nhiều hơn thế
        return -1

    }

    evaluatePos(a, side) {
        let maxA = -1;
        const { left, top, right, bottom } = this.partition;
        const opposite = side === 1 ? 2 : 1
        for (let i = top; i <= bottom; i++) {
            for (let j = left; j <= right; j++) {
                if (this.board[i][j] !== 0 || !this.hasNeighbors(i, j)) { a[i][j] = -1; continue; }
                let wp = this.winningPos(i, j, side);

                if (wp > 0) { a[i][j] = wp; } 
                else {
                    let nPos = [1, 1, 1, 1];
                    let dirA = [0, 0, 0, 0];
                    let A = [0, 0, 0, 0];

                    let minLeft = Math.max(j - this.condition - 1, 0)
                    let maxRight = Math.min(j + this.condition, this.size) 
                    let minTop = Math.max(i - this.condition - 1, 0) 
                    let maxBottom = Math.min(i + this.condition, this.size)

                    // Ngang
                    let m = 1; while (j + m < maxRight && this.board[i][j + m] !== opposite) { nPos[0]++; A[0] += this.w[m]; m++; }
                    if (j + m >= this.size || this.board[i][j + m] === opposite) A[0] -= (this.board[i][j + m - 1] === side) ? (this.w[this.condition] * -1) : 0;
                    m = 1; while (j - m >= minLeft && this.board[i][j - m] !== opposite) { nPos[0]++; A[0] += this.w[m]; m++; }
                    if (j - m < 0 || this.board[i][j - m] === opposite) A[0] -= (this.board[i][j - m + 1] === side) ? (this.w[this.condition] * -1) : 0;
                    dirA[0] = (nPos[0] > this.condition - 1) ? A[0] * A[0] : 0;
                    // Dọc
                    m = 1; while (i + m < maxBottom && this.board[i + m][j] !== opposite) { nPos[1]++; A[1] += this.w[m]; m++; }
                    if (i + m >= this.size || this.board[i + m][j] === opposite) A[1] -= (this.board[i + m - 1][j] === side) ? (this.w[this.condition] * -1) : 0;
                    m = 1; while (i - m >= minTop && this.board[i - m][j] !== opposite) { nPos[1]++; A[1] += this.w[m]; m++; }
                    if (i - m < 0 || this.board[i - m][j] === opposite) A[1] -= (this.board[i - m + 1][j] === side) ? (this.w[this.condition] * -1) : 0;
                    dirA[1] = (nPos[1] > this.condition - 1) ? A[1] * A[1] : 0;
                    // Chéo chính
                    m = 1; while (i + m < maxBottom && j + m < maxRight && this.board[i + m][j + m] !== opposite) { nPos[2]++; A[2] += this.w[m]; m++; }
                    if (i + m >= this.size || j + m >= this.size || this.board[i + m][j + m] === opposite) A[2] -= (this.board[i + m - 1][j + m - 1] === side) ? (this.w[this.condition] * -1) : 0;
                    m = 1; while (i - m >= minTop && j - m >= minLeft && this.board[i - m][j - m] !== opposite) { nPos[2]++; A[2] += this.w[m]; m++; }
                    if (i - m < 0 || j - m < 0 || this.board[i - m][j - m] === opposite) A[2] -= (this.board[i - m + 1][j - m + 1] === side) ? (this.w[this.condition] * -1) : 0;
                    dirA[2] = (nPos[2] > this.condition - 1) ? A[2] * A[2] : 0;
                    // Chéo phụ
                    m = 1; while (i + m < maxBottom && j - m >= minLeft && this.board[i + m][j - m] !== opposite) { nPos[3]++; A[3] += this.w[m]; m++; }
                    if (i + m >= this.size || j - m < 0 || this.board[i + m][j - m] === opposite) A[3] -= (this.board[i + m - 1][j - m + 1] === side) ? (this.w[this.condition] * -1) : 0;
                    m = 1; while (i - m >= minTop && j + m < maxRight && this.board[i - m][j + m] !== opposite) { nPos[3]++; A[3] += this.w[m];  m++; }
                    if (i - m < 0 || j + m >= this.size || this.board[i - m][j + m] === opposite) A[3] -= (this.board[i - m + 1][j + m - 1] === side) ? (this.w[this.condition] * -1) : 0;
                    dirA[3] = (nPos[3] > this.condition - 1) ? A[3] * A[3] : 0;
                    let A1 = 0, A2 = 0;
                    for (let k = 0; k <= 3; k++) {
                        if (dirA[k] >= A1) { A2 = A1; A1 = dirA[k]; }
                    }
                    a[i][j] = A1 + A2;
                }
                if (a[i][j] > maxA) maxA = a[i][j];
            }
        }
        return maxA;
    }

    getBestMove() {
        this._partitionBoard();
        let s = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        let q = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        let maxS = this.evaluatePos(s, this.player);
        let maxQ = this.evaluatePos(q, this.ai);

        let moves = [];
        const { left, top, right, bottom } = this.partition;
        for (let i = top; i <= bottom; i++) {
            for (let j = left; j <= right; j++) {
                if (q[i][j] > -1 || s[i][j] > -1) {
                    let value = maxQ >= maxS ? q[i][j] : s[i][j] * s[i][j];
                    moves.push({ value, index: [i, j] });
                }
            }
        }
        if (moves.length === 0) {
            let center = Math.floor(this.size / 2);
            return { r: center, c: center };
        }
        moves.sort((a, b) => b.value - a.value);

        let nTop;
        if (this.level === 'hard') nTop = Math.min(1, moves.length);
        else if (this.level === 'medium') nTop = Math.min(2, moves.length);
        else nTop = Math.min(4, moves.length);
        let randomK = Math.floor(Math.random() * nTop);
        return { r: moves[randomK].index[0], c: moves[randomK].index[1] };
    }
}