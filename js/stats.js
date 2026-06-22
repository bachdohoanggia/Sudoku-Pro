const STATS_KEY = "sudoku-stats";

function getDefaultStats() {

    return {

        gamesPlayed: 0,
        gamesWon: 0,

        bestTime: null,

        currentStreak: 0,
        longestStreak: 0,

        totalMistakes: 0

    };

}

export function loadStats() {

    const data =
        sessionStorage.getItem(
            STATS_KEY
        );

    if (!data) {

        return getDefaultStats();

    }

    return JSON.parse(data);

}

export function saveStats(
    stats
) {

    sessionStorage.setItem(
        STATS_KEY,
        JSON.stringify(stats)
    );

}

export function recordWin(
    timeInSeconds,
    mistakes
) {

    const stats =
        loadStats();

    stats.gamesPlayed++;

    stats.gamesWon++;

    stats.currentStreak++;

    stats.totalMistakes +=
        mistakes;

    if (
        stats.currentStreak >
        stats.longestStreak
    ) {

        stats.longestStreak =
            stats.currentStreak;

    }

    if (

        stats.bestTime === null ||

        timeInSeconds <
        stats.bestTime

    ) {

        stats.bestTime =
            timeInSeconds;

    }

    saveStats(stats);

    return stats;
}

export function recordLoss(
    mistakes
) {

    const stats =
        loadStats();

    stats.gamesPlayed++;

    stats.currentStreak = 0;

    stats.totalMistakes +=
        mistakes;

    saveStats(stats);

    return stats;
}

export function getWinRate() {

    const stats =
        loadStats();

    if (
        stats.gamesPlayed === 0
    ) {

        return 0;

    }

    return Math.round(

        stats.gamesWon /

        stats.gamesPlayed *

        100

    );

}

export function getAverageMistakes() {

    const stats =
        loadStats();

    if (
        stats.gamesPlayed === 0
    ) {

        return 0;

    }

    return (

        stats.totalMistakes /

        stats.gamesPlayed

    ).toFixed(1);

}

export function resetStats() {

    saveStats(
        getDefaultStats()
    );

}

export function formatTime(
    seconds
) {

    if (
        seconds === null
    ) {

        return "--";

    }

    const mins =
        Math.floor(
            seconds / 60
        );

    const secs =
        seconds % 60;

    return (
        String(mins)
            .padStart(2, "0")
        +
        ":"
        +
        String(secs)
            .padStart(2, "0")
    );

}