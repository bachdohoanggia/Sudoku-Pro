const SAVE_KEY = "sudoku-save";

const SETTINGS_KEY =
    "sudoku-settings";


const REPLAY_KEY =
    "sudoku-replay";

export function saveGame(
    gameData
) {

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(gameData)
        );

        return true;

    } catch (error) {

        console.error(error);

        return false;
    }

}

export function loadGame() {

    try {

        const data =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(error);

        return null;
    }

}

export function clearSave() {

    localStorage.removeItem(
        SAVE_KEY
    );

}

export function saveSettings(
    settings
) {

    localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );

}

export function loadSettings() {

    const settings =
        localStorage.getItem(
            SETTINGS_KEY
        );

    if (!settings) {

        return {

            darkMode: false

        };

    }

    return JSON.parse(settings);

}


export function saveReplay(
    replayData
) {

    localStorage.setItem(
        REPLAY_KEY,
        JSON.stringify(
            replayData
        )
    );

}

export function loadReplay() {

    const data =
        localStorage.getItem(
            REPLAY_KEY
        );

    if (!data) {

        return [];

    }

    return JSON.parse(data);

}