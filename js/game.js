import { generateSudoku } from "./generator.js";
import { cloneBoard } from "./solve.js";

import {
    renderBoard,
    selectCell,
    updateCell,

    markWrong,
    clearWrong,

    updateLives,
    updateTimer,
    updateStatsUI,

    showWinModal,
    hideWinModal,
    showLoseModal,
    hideLoseModal,
    toggleDarkMode,

    launchConfetti

} from "./ui.js";

import {
    loadStats,
    recordWin,
    recordLoss
} from "./stats.js";

let board = [];

let originalBoard = [];

let solution = [];

let notesBoard = [];

let selectedRow = null;
let selectedCol = null;

let lives = 3;

let mistakes = 0;

let timer = 0;

let timerInterval = null;

let gameFinished = false;
let noteMode = false;
let actionHistory = [];
let redoHistory = [];

const difficultySelect =
    document.getElementById(
        "difficulty"
    );

const newGameBtn =
    document.getElementById(
        "newGameBtn"
    );

const darkModeBtn =
    document.getElementById(
        "darkModeBtn"
    );

const hintBtn =
    document.getElementById(
        "hintBtn"
    );

const notesBtn =
    document.getElementById(
        "notesBtn"
    );

const undoBtn =
    document.getElementById(
        "undoBtn"
    );

const redoBtn =
    document.getElementById(
        "redoBtn"
    );

const solveBtn =
    document.getElementById(
        "solveBtn"
    );

const tryAgainBtn =
    document.getElementById(
        "tryAgainBtn"
    );

const playAgainBtn =
    document.getElementById(
        "playAgainBtn"
    );

function startTimer() {

    stopTimer();

    timerInterval =
        setInterval(() => {

            timer++;

            updateTimer(timer);

        }, 1000);

}
function stopTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}

function startNewGame() {

    const difficulty =
        difficultySelect.value;

    const game =
        generateSudoku(
            difficulty
        );

    board =
        game.puzzle.map(
            row => [...row]
        );

    originalBoard =
        game.puzzle.map(
            row => [...row]
        );

    solution =
        game.solution;

    notesBoard =
        createNotesBoard();

    lives = 3;

    mistakes = 0;

    timer = 0;

    gameFinished = false;

    updateLives(lives);

    updateTimer(0);
    updateStatsUI(loadStats());

    renderBoard(
        board,
        originalBoard,
        notesBoard,
        handleCellSelect
    );

    actionHistory = [];
    redoHistory = [];
    startTimer();
}

function createNotesBoard() {
    return Array.from(
        { length: 9 },
        () => Array.from(
            { length: 9 },
            () => []
        )
    );
}

function formatNotes(notes) {
    return notes.length > 0
        ? notes.join("")
        : "";
}

function saveHistory() {
    actionHistory.push({
        board: cloneBoard(board),
        notesBoard: notesBoard.map(row => row.map(cell => [...cell])),
        selectedRow,
        selectedCol,
        lives,
        mistakes
    });

    if (actionHistory.length > 50) {
        actionHistory.shift();
    }

    redoHistory.length = 0;
}

function restoreHistory(state) {
    board = cloneBoard(state.board);
    notesBoard = state.notesBoard.map(row => row.map(cell => [...cell]));
    selectedRow = state.selectedRow;
    selectedCol = state.selectedCol;
    lives = state.lives;
    mistakes = state.mistakes;
}

function undoMove() {
    if (actionHistory.length === 0) {
        return;
    }

    redoHistory.push({
        board: cloneBoard(board),
        notesBoard: notesBoard.map(row => row.map(cell => [...cell])),
        selectedRow,
        selectedCol,
        lives,
        mistakes
    });

    const previous = actionHistory.pop();

    restoreHistory(previous);

    renderBoard(
        board,
        originalBoard,
        notesBoard,
        handleCellSelect
    );

    updateLives(lives);
}

function redoMove() {
    if (redoHistory.length === 0) {
        return;
    }

    actionHistory.push({
        board: cloneBoard(board),
        notesBoard: notesBoard.map(row => row.map(cell => [...cell])),
        selectedRow,
        selectedCol,
        lives,
        mistakes
    });

    const next = redoHistory.pop();

    restoreHistory(next);

    renderBoard(
        board,
        originalBoard,
        notesBoard,
        handleCellSelect
    );

    updateLives(lives);
}

function useHint() {
    if (
        selectedRow === null ||
        selectedCol === null ||
        originalBoard[selectedRow][selectedCol] !== 0
    ) {
        return;
    }

    saveHistory();

    const correctValue =
        solution[selectedRow][selectedCol];

    board[selectedRow][selectedCol] = correctValue;

    updateCell(
        selectedRow,
        selectedCol,
        correctValue
    );

    clearWrong(
        selectedRow,
        selectedCol
    );

    checkWin();
}

function toggleNotesMode() {
    noteMode = !noteMode;

    notesBtn.classList.toggle(
        "active",
        noteMode
    );
}


function solvePuzzle() {
    saveHistory();

    board =
        solution.map(row => [...row]);

    renderBoard(
        board,
        originalBoard,
        notesBoard,
        handleCellSelect
    );

    gameFinished = true;
    stopTimer();
}

function restartGame() {
    hideLoseModal();
    hideWinModal();
    startNewGame();
}

function handleCellSelect(
    row,
    col,
    cellElement
) {

    if (gameFinished) {
        return;
    }

    selectedRow = row;
    selectedCol = col;

    selectCell(
        cellElement
    );
}

function placeNumber(
    number
) {

    if (
        selectedRow === null ||
        selectedCol === null
    ) {

        return;
    }

    if (
        originalBoard[
            selectedRow
        ][
            selectedCol
        ] !== 0
    ) {

        return;
    }

    if (noteMode) {
        saveHistory();

        const notes =
            notesBoard[selectedRow][
                selectedCol
            ];

        const index =
            notes.indexOf(number);

        if (index !== -1) {
            notes.splice(index, 1);
        } else {
            notes.push(number);
            notes.sort((a, b) => a - b);
        }

        updateCell(
            selectedRow,
            selectedCol,
            formatNotes(notes)
        );

        return;
    }

    const correctValue =
        solution[
            selectedRow
        ][
            selectedCol
        ];

    notesBoard[selectedRow][
        selectedCol
    ] = [];

    if (
        number !== correctValue
    ) {

        markWrong(
            selectedRow,
            selectedCol
        );

        lives--;

        mistakes++;

        updateLives(
            lives
        );

        if (
            lives <= 0
        ) {

            gameOver();

        }

        return;
    }

    clearWrong(
        selectedRow,
        selectedCol
    );

    board[
        selectedRow
    ][
        selectedCol
    ] = number;

    updateCell(
        selectedRow,
        selectedCol,
        number
    );

    checkWin();
}

function checkWin() {

    for (
        let row = 0;
        row < 9;
        row++
    ) {

        for (
            let col = 0;
            col < 9;
            col++
        ) {

            if (
                board[row][col]
                !==
                solution[row][col]
            ) {

                return;
            }

        }

    }

    winGame();
}

function winGame() {

    gameFinished = true;

    stopTimer();

    const stats = recordWin(
        timer,
        mistakes
    );

    updateStatsUI(stats);
    showWinModal(
        timer,
        mistakes
    );

    launchConfetti();
}

function gameOver() {

    gameFinished = true;

    stopTimer();

    const stats = recordLoss(
        mistakes
    );

    updateStatsUI(stats);
    showLoseModal();
}

document
    .querySelectorAll(
        ".number-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    Number(
                        button.dataset
                            .number
                    );

                placeNumber(
                    value
                );

            }
        );

    });

document
    .getElementById(
        "eraseBtn"
    )
    .addEventListener(
        "click",
        () => {

            if (
                selectedRow === null
            ) {

                return;
            }

            if (
                originalBoard[
                    selectedRow
                ][
                    selectedCol
                ] !== 0
            ) {

                return;
            }

            saveHistory();

            board[
                selectedRow
            ][
                selectedCol
            ] = 0;
            notesBoard[
                selectedRow
            ][
                selectedCol
            ] = [];

            updateCell(
                selectedRow,
                selectedCol,
                0
            );

        }
    );

hintBtn.addEventListener(
    "click",
    useHint
);

notesBtn.addEventListener(
    "click",
    toggleNotesMode
);

undoBtn.addEventListener(
    "click",
    undoMove
);

redoBtn.addEventListener(
    "click",
    redoMove
);

solveBtn.addEventListener(
    "click",
    solvePuzzle
);

document.addEventListener(
    "keydown",
    handleKeyboardInput
);

tryAgainBtn.addEventListener(
    "click",
    restartGame
);

playAgainBtn.addEventListener(
    "click",
    restartGame
);

darkModeBtn.addEventListener(
    "click",
    toggleDarkMode
);

newGameBtn.addEventListener(
    "click",
    startNewGame
);
startNewGame();

function handleKeyboardInput(event) {
    if (
        gameFinished ||
        selectedRow === null ||
        selectedCol === null
    ) {
        return;
    }

    const key = event.key;

    if (/^[1-9]$/.test(key)) {
        event.preventDefault();
        placeNumber(Number(key));
        return;
    }

    if (key === "Backspace" || key === "Delete") {
        event.preventDefault();

        if (
            originalBoard[selectedRow][selectedCol] !==
            0
        ) {
            return;
        }

        saveHistory();

        board[selectedRow][selectedCol] = 0;
        notesBoard[selectedRow][selectedCol] = [];

        updateCell(
            selectedRow,
            selectedCol,
            0
        );
        return;
    }

    if (
        key === "ArrowUp" ||
        key === "ArrowDown" ||
        key === "ArrowLeft" ||
        key === "ArrowRight"
    ) {
        event.preventDefault();
        moveSelectedCell(key);
    }
}

function moveSelectedCell(key) {
    let row = selectedRow;
    let col = selectedCol;

    if (key === "ArrowUp") {
        row = Math.max(0, row - 1);
    } else if (key === "ArrowDown") {
        row = Math.min(8, row + 1);
    } else if (key === "ArrowLeft") {
        col = Math.max(0, col - 1);
    } else if (key === "ArrowRight") {
        col = Math.min(8, col + 1);
    }

    const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );

    if (cell) {
        selectedRow = row;
        selectedCol = col;
        selectCell(cell);
        cell.focus();
    }
}