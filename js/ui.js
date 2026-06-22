import { formatTime } from "./stats.js";

const boardElement =
    document.getElementById("board");

const timerElement =
    document.getElementById("timer");

const livesElement =
    document.getElementById("lives");

const winModal =
    document.getElementById("winModal");

const loseModal =
    document.getElementById("loseModal");

const darkModeBtn =
    document.getElementById("darkModeBtn");

export function renderBoard(
    board,
    originalBoard,
    notesBoard,
    onCellClick
) {

    boardElement.innerHTML = "";

    for (let row = 0; row < 9; row++) {

        for (let col = 0; col < 9; col++) {

            const cell =
                document.createElement(
                    "input"
                );

            cell.type = "text";

            cell.maxLength = 1;

            cell.classList.add(
                "cell"
            );

            cell.dataset.row = row;
            cell.dataset.col = col;

            const value =
                board[row][col];

            const notes =
                notesBoard[row][col];

            if (value !== 0) {
                cell.value = value;
            } else if (notes.length > 0) {
                cell.value = notes.join("");
                cell.classList.add(
                    "note"
                );
            }

            if (
                originalBoard[row][col] !== 0
            ) {

                cell.classList.add(
                    "fixed"
                );

                cell.disabled = true;
            }

            if (
                col === 2 ||
                col === 5
            ) {

                cell.classList.add(
                    "right-border"
                );

            }

            if (
                row === 2 ||
                row === 5
            ) {

                cell.classList.add(
                    "bottom-border"
                );

            }

            cell.addEventListener(
                "click",
                () =>
                    onCellClick(
                        row,
                        col,
                        cell
                    )
            );

            boardElement.appendChild(
                cell
            );

        }

    }

}

export function updateCell(
    row,
    col,
    value
) {

    const cell =
        document.querySelector(

            `[data-row="${row}"][data-col="${col}"]`

        );

    if (!cell) return;

    if (value === 0) {
        cell.value = "";
        cell.classList.remove("note");
    } else {
        cell.value = value;
        if (typeof value === "string") {
            cell.classList.add("note");
        } else {
            cell.classList.remove("note");
        }
    }
}

export function selectCell(
    cellElement
) {

    document
        .querySelectorAll(
            ".cell.selected"
        )
        .forEach(cell => {

            cell.classList.remove(
                "selected"
            );

        });

    cellElement.classList.add(
        "selected"
    );

}

export function markWrong(
    row,
    col
) {

    const cell =
        document.querySelector(

            `[data-row="${row}"][data-col="${col}"]`

        );

    if (!cell) return;

    cell.classList.add(
        "wrong"
    );

}

export function clearWrong(
    row,
    col
) {

    const cell =
        document.querySelector(

            `[data-row="${row}"][data-col="${col}"]`

        );

    if (!cell) return;

    cell.classList.remove(
        "wrong"
    );

}

export function highlightNumber(
    number
) {

    document
        .querySelectorAll(".cell")
        .forEach(cell => {

            cell.classList.remove(
                "highlight"
            );

            if (
                Number(cell.value)
                === number
            ) {

                cell.classList.add(
                    "highlight"
                );

            }

        });

}

export function updateTimer(
    seconds
) {

    timerElement.textContent =
        formatTime(seconds);

}

export function updateLives(
    lives
) {

    let hearts = "";

    for (
        let i = 0;
        i < lives;
        i++
    ) {

        hearts += "❤️";

    }

    for (
        let i = lives;
        i < 3;
        i++
    ) {

        hearts += "🤍";

    }

    livesElement.textContent =
        hearts;

}

export function showWinModal(
    time,
    mistakes
) {

    document.getElementById(
        "winTime"
    ).textContent =
        "Time: " + formatTime(time);

    document.getElementById(
        "winMistakes"
    ).textContent =
        "Mistakes: " + mistakes;

    winModal.classList.remove(
        "hidden"
    );

}

export function hideWinModal() {

    winModal.classList.add(
        "hidden"
    );

}

export function showLoseModal() {

    loseModal.classList.remove(
        "hidden"
    );

}

export function hideLoseModal() {

    loseModal.classList.add(
        "hidden"
    );

}

export function launchConfetti() {

    confetti({

        particleCount: 250,

        spread: 180,

        origin: {

            y: 0.6

        }

    });

}

export function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );

}

export function updateStatsUI(
    stats
) {

    document.getElementById(
        "gamesPlayed"
    ).textContent =
        stats.gamesPlayed;

    document.getElementById(
        "gamesWon"
    ).textContent =
        stats.gamesWon;

    document.getElementById(
        "bestTime"
    ).textContent =
        stats.bestTime === null
            ? "--"
            : formatTime(
                stats.bestTime
              );

    document.getElementById(
        "streak"
    ).textContent =
        stats.currentStreak;

}


