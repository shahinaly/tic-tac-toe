const game = (() => {

  // We index board starting from left to right, top to bottom,
  // and use a variable to track the current mark.
  let board = new Array(9);
  let currentMark = "x";
  let noMoves = 0;
  let winner;

  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const makeMove = function (coor) {

    if (board[coor] !== undefined || winner !== undefined) {
      return null;
    };

    board[coor] = currentMark;
    noMoves = noMoves + 1;

    if (checkGameOver()) {
      return false;
    };

    currentMark = (currentMark == "x") ? "o" : "x";
    return true;
  };

  const checkGameOver = function () {
    for (let line of WINNING_LINES) {
      let firstElement = board[line[0]];

      if (firstElement == board[line[1]] &&
        firstElement == board[line[2]] &&
        firstElement != undefined) {
        winner = (currentMark == "x") ? 1 : 2;
        return true;
      };
    };

    if (noMoves === 9) {
      console.log("tie");
      winner = 0;
      return true;
    };
    return false;
  };

  const getWinner = function () { return winner; };
  const getBoard = function () { return board; };

  const resetGame = function () {
    board.fill(undefined);
    noMoves = 0;
    winner = undefined;
    currentMark = "x";
  }
  const logBoard = function () {
    console.log(`${board[0]} ${board[1]} ${board[2]}`);
    console.log(`${board[3]} ${board[4]} ${board[5]}`);
    console.log(`${board[6]} ${board[7]} ${board[8]}`);
  };
  return { makeMove, getBoard, getWinner, resetGame, logBoard };
})();
const controller = (() => {

  /** Event Listeners **/

  /*** Game Logic ***/
  let cells = document.querySelectorAll(".cell");
  for (let cell of cells) {
    cell.addEventListener("click", (e) => {

      let playContinues = game.makeMove(e.target.id.slice(-1)); /* TODO: find a better selector */
      if (playContinues === false) /* Move was made and Game is over. */ {
        const winner = game.getWinner();
        const scores = players.updateScores(winner);
        displayWinner(winner);
        displayScores(scores);
        players.switchSides();
      };

      displayBoard();

    });
  };

  let btn = document.querySelector("button");
  btn.addEventListener(("click"), () => {
    resetBoard();
  });

  /** Functions **/

  const displayWinner = function (winner, hide = false) {
    const winnerEl = document.querySelector("#winner");
    if (hide) {
      winnerEl.textContent = "";
      winnerEl.style.display = "none";
      return;
    }

    if (winner === 0) {
      winnerEl.textContent = "It's a tie!";
    } else if (winner === 1 || winner === 2) {
      winnerEl.textContent = `Player ${players.getPlayer(winner)} wins!`
    }
    winnerEl.style.display = "block";
  };
  const displayBoard = function () {
    let board = game.getBoard();
    for (let cell in board) {
      document.querySelector("#cell-" + cell).textContent = board[cell];
    };
  };
  const displayScores = function (scores) {
    const scorePlayer1 = document.querySelector("#score-1");
    const scorePlayer2 = document.querySelector("#score-2");

    scorePlayer1.textContent = scores[1];
    scorePlayer2.textContent = scores[2];
  };
  const resetBoard = function () {
    game.resetGame();
    cells.forEach((cell) => { cell.textContent = ""; });
    displayWinner(undefined, hide = true);
  };

})();
const players = (() => {

  const player1 = {
    mark: 1,
    score: 0,
  }
  const player2 = {
    mark: 2,
    score: 0,
  }
  const updateScores = function (result) {

    if (result === 1 || result === 2) {
      (player1.mark === 1) ? player1.score++ : player2.score++;
    }

    return {
      1: player1.score,
      2: player2.score
    };
  };
  const switchSides = function () {
    player1.mark = (player1.mark === 1) ? 2 : 1;
    player2.mark = (player2.mark === 1) ? 2 : 1;
  }

  const getPlayer = function (mark) {
    return (player1.mark === mark) ? 1 : 2;
  }

  return { updateScores, getPlayer, switchSides };

})();
