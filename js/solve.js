export function isValid(board, row, col, num) {

    for (let c = 0; c < 9; c++) {

        if (board[row][c] === num) {
            return false;
        }

    }

    for (let r = 0; r < 9; r++) {

        if (board[r][col] === num) {
            return false;
        }

    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let r = startRow; r < startRow + 3; r++) {

        for (let c = startCol; c < startCol + 3; c++) {

            if (board[r][c] === num) {
                return false;
            }

        }

    }

    return true;
}

export function findEmpty(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                return [row, col];

            }

        }

    }

    return null;
}

export function solve(board) {

    const empty = findEmpty(board);

    if (empty === null) {
        return true;
    }

    const [row, col] = empty;

    for (let num = 1; num <= 9; num++) {

        if (isValid(board, row, col, num)) {

            board[row][col] = num;

            if (solve(board)) {
                return true;
            }

            board[row][col] = 0;
        }

    }

    return false;
}

export function countSolutions(board) {

    let count = 0;

    function backtrack() {

        const empty = findEmpty(board);

        if (empty === null) {

            count++;

            return;
        }

        const [row, col] = empty;

        for (let num = 1; num <= 9; num++) {

            if (isValid(board, row, col, num)) {

                board[row][col] = num;

                backtrack();

                board[row][col] = 0;

                if (count > 1) {
                    return;
                }

            }

        }

    }

    backtrack();

    return count;
}

export function cloneBoard(board) {

    return board.map(row => [...row]);

}