import {
    isValid,
    countSolutions,
    cloneBoard
} from "./solve.js";

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(
            Math.random() * (i + 1)
        );

        [arr[i], arr[j]] =
        [arr[j], arr[i]];
    }

    return arr;
}

function createEmptyBoard() {

    return Array.from(
        { length: 9 },
        () => Array(9).fill(0)
    );

}

function fillBoard(board) {

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            if (board[row][col] === 0) {

                const numbers =
                    shuffle([
                        1,2,3,4,5,6,7,8,9
                    ]);

                for (const num of numbers) {

                    if (
                        isValid(
                            board,
                            row,
                            col,
                            num
                        )
                    ) {

                        board[row][col] = num;

                        if (
                            fillBoard(board)
                        ) {
                            return true;
                        }

                        board[row][col] = 0;
                    }

                }

                return false;
            }

        }

    }

    return true;
}

function generateSolvedBoard() {

    const board =
        createEmptyBoard();

    fillBoard(board);

    return board;
}

function getCellsToRemove(
    difficulty
) {

    switch (difficulty) {

        case "easy":
            return 35;

        case "medium":
            return 45;

        case "hard":
            return 55;

        default:
            return 45;

    }

}

function removeCells(
    board,
    cellsToRemove
) {

    let removed = 0;

    while (
        removed < cellsToRemove
    ) {

        const row =
            Math.floor(
                Math.random() * 9
            );

        const col =
            Math.floor(
                Math.random() * 9
            );

        if (
            board[row][col] === 0
        ) {
            continue;
        }

        const backup =
            board[row][col];

        board[row][col] = 0;

        const copy =
            cloneBoard(board);

        const solutions =
            countSolutions(copy);

        if (solutions !== 1) {

            board[row][col] =
                backup;

        } else {

            removed++;

        }

    }

}

export function generateSudoku(
    difficulty = "medium"
) {

    const solution =
        generateSolvedBoard();

    const puzzle =
        cloneBoard(solution);

    const cellsToRemove =
        getCellsToRemove(
            difficulty
        );

    removeCells(
        puzzle,
        cellsToRemove
    );

    return {

        puzzle,
        solution

    };

}