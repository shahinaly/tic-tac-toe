const game = (() => {

  // We index board starting from left to right, top to bottom,
  // and use a variable to track the current mark.
  let board = new Array(9);
  let currentMark = "x";
  let noMoves = 0;
  let winner;
  let roundOver = false;

  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const makeMove = function (coor) {

    if (board[coor] !== undefined || roundOver === true) {
      return false;
    };

    board[coor] = currentMark;
    noMoves = noMoves + 1;

    return true;
  };
  const findWinner = function () {

    for (const [first, second, third] of WINNING_LINES) {

      const firstElement = board[first];
      if (firstElement !== undefined &&
        firstElement === board[second] &&
        firstElement === board[third]) {

        winner = currentMark;
        return true;
      };
    };

    if (noMoves === 9) {
      winner = null;
      return true;
    };

    return false;
  };

  const getWinner = () => { return winner; };
  const getBoard = () => { return board; };
  const endRound = () => { roundOver = true; }

  const switchMarks = function () {
    currentMark = (currentMark === "x") ? "o" : "x";
  }
  const resetGame = function () {
    board.fill(undefined);
    noMoves = 0;
    winner = undefined;
    currentMark = "x";
    roundOver = false;
  }
  const logBoard = function () {
    console.log(`${board[0]} ${board[1]} ${board[2]}`);
    console.log(`${board[3]} ${board[4]} ${board[5]}`);
    console.log(`${board[6]} ${board[7]} ${board[8]}`);
  };
  return { makeMove, findWinner, getBoard, getWinner, switchMarks, resetGame, logBoard, endRound };
})();

const controller = (() => {

  /** Event Listeners **/

  let cells = document.querySelectorAll(".cell");
  for (let cell of cells) {
    cell.addEventListener("click", (e) => {
      gamePlay(e.target.dataset.index);
    });
  };

  let btn = document.querySelector("button");
  btn.addEventListener(("click"), () => {
    resetBoard();
  });

  /** Functions **/

  const gamePlay = function (cellIndex) {
    /* make move and recieve outcome signal */
    const moveOutcome = game.makeMove(cellIndex);
    const roundOver = game.findWinner();

    /* Move is made and game continues */
    if (moveOutcome === true && roundOver === false) {
      game.switchMarks();
    }
    /* Move is made and Game is over. */
    else if (moveOutcome === true && roundOver === true) {
      const winner = game.getWinner();
      const scores = players.updateScores(winner);

      displayWinner(winner);
      displayScores(scores);
      players.switchSides();
      game.endRound();
    };
    displayBoard();
  }

  const displayWinner = function (winner, hide = false) {
    const winnerEl = document.querySelector("#winner");
    if (hide) {
      winnerEl.textContent = "";
      winnerEl.style.display = "none";
      return;
    }
    if (winner === null) {
      winnerEl.textContent = "It's a tie!";
    } else if (winner === "x" || winner === "o") {
      winnerEl.textContent = `Player ${players.getPlayer(winner)} wins!`
    }
    winnerEl.style.display = "block";
  };
  const displayBoard = function () {
    let boardArray = game.getBoard();
    let cellElements = document.querySelectorAll(".cell");
    for (let cell of cellElements) {
      cell.textContent = boardArray[cell.dataset.index];
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
    mark: "x",
    score: 0,
  }
  const player2 = {
    mark: "o",
    score: 0,
  }
  const updateScores = function (result) {
    if (player1.mark === result) {
      player1.score++;
    } else if (player2.mark === result) {
      player2.score++;
    }
    return {
      1: player1.score,
      2: player2.score
    };
  };
  const switchSides = function () {
    player1.mark = (player1.mark === "x") ? "o" : "x";
    player2.mark = (player2.mark === "x") ? "o" : "x";
  }

  const getPlayer = function (mark) {
    return (player1.mark === mark) ? 1 : 2;
  }

  return { updateScores, getPlayer, switchSides };

})();
