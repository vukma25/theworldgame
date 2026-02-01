const SUDOKU_VARIANTS = {
    4: {
        name: "Mini Sudoku",
        regionSize: 2,
        difficulties: {
            1: {
                name: "Easy",
                cellsToRemove: 4,
                description: "Suitable for newbie"
            },
            2: {
                name: "Medium",
                cellsToRemove: 6,
                description: "Fundamental difficult"
            },
            3: {
                name: "Hard",
                cellsToRemove: 8,
                description: "Challenge for experienced player"
            }
        },
        maxRemovable: 10,
        minClues: 6
    },

    9: {
        name: "Standard Sudoku",
        regionSize: 3,
        difficulties: {
            1: {
                name: "Easy",
                cellsToRemove: 30,
                description: "Fundamental, and lots of hints"
            },
            2: {
                name: "Medium",
                cellsToRemove: 45,
                description: "Higher difficulty"
            },
            3: {
                name: "Hard",
                cellsToRemove: 55,
                description: "Challenge for brain"
            },
            4: {
                name: "Expert",
                cellsToRemove: 60,
                description: "Just for master"
            }
        },
        maxRemovable: 65,
        minClues: 16
    },

    16: {
        name: "Super Sudoku",
        regionSize: 4,
        difficulties: {
            1: {
                name: "Easy",
                cellsToRemove: 120,
                description: "Warm up with Super Sudoku"
            },
            2: {
                name: "Medium",
                cellsToRemove: 160,
                description: "The son of the god"
            },
            3: {
                name: "Hard",
                cellsToRemove: 190,
                description: "The path become the god"
            }
        },
        maxRemovable: 200,
        minClues: 56
    },

};

export default SUDOKU_VARIANTS;