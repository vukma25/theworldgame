/* eslint-env worker */

onmessage = async function (e) {
  const module = await import("./CaroAl.js")

  const AI = module.default

  const { data, action } = e.data

  if (action === "get_best_move") {

    try {
      postMessage({
        type: "loading",
        payload: true
      })

      const CaroAI = new AI(data.init)

      //cập nhật bàn cờ mới nhất - người chơi vừa đi xong
      CaroAI.setBoard(data.currentBoard)

      const bestMove = CaroAI.getBestMove()

      await new Promise(resolve => {
        setTimeout(() => {
          postMessage({
            type: "get_best_move_success",
            payload: bestMove
          })
          resolve()
        }, data.init.level === "hard" ? 1500 : data.init.level === "medium" ? 1000 : 500)
      })

    } catch (err) {
      postMessage({
        type: "get_best_move_failure",
        payload: data.currentBoard
      })
    } finally {
      postMessage({
        type: "loading",
        payload: false
      })
    }
  }
}