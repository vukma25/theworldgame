/* eslint-env worker */

onmessage = async function(e) {
    const { size, difficulty, action } = e.data
    const module = await import("./CreateSudoku.js")

    const SudokuGame = module.default

    if (action === "generate_puzzle") {
        try {
            postMessage({ 
                type: "loading",
                payload: true
            })

            const sudoku = new SudokuGame({
                size,
                difficulty
            })
            const puzzle = sudoku.createPuzzle()
            const answers = sudoku.getAnswer()

            postMessage({
                type: "generate_success",
                payload: {
                    puzzle,
                    answers
                }
            })
        } catch (error) {
            postMessage({
                type: "error",
                payload: error.message
            })
        } finally {
            postMessage({
                type: "loading",
                payload: false
            })
        }
    }

}