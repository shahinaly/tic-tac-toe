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

class Controller {

  cells = document.querySelectorAll(".cell");

  constructor() {
    this.players = new Players();

    /** Event Listeners **/
    for (let cell of this.cells) {
      cell.addEventListener("click", (e) => {
        this.gamePlay(e.target.dataset.index);
      });
    };

    let btn = document.querySelector("button");
    btn.addEventListener(("click"), () => {
      this.resetBoard();
    });

  }

  /** Functions **/

  gamePlay = function (cellIndex) {
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
      const scores = this.players.updateScores(winner);

      this.displayWinner(winner);
      this.displayScores(scores);
      this.players.switchSides();
      game.endRound();
    };
    this.displayBoard();
  }

  displayWinner = function (winner, hide = false) {
    const winnerEl = document.querySelector("#winner");
    if (hide) {
      winnerEl.textContent = "";
      winnerEl.style.display = "none";
      return;
    }
    if (winner === null) {
      winnerEl.textContent = "It's a tie!";
    } else if (winner === "x" || winner === "o") {
      winnerEl.textContent = `Player ${this.players.getPlayer(winner)} wins!`
    }
    winnerEl.style.display = "block";
  };
  displayBoard = function () {
    let boardArray = game.getBoard();
    let cellElements = document.querySelectorAll(".cell");
    for (let cell of cellElements) {
      cell.textContent = boardArray[cell.dataset.index];
    };
  };
  displayScores = function (scores) {
    const scorePlayer1 = document.querySelector("#score-1");
    const scorePlayer2 = document.querySelector("#score-2");

    scorePlayer1.textContent = scores[1];
    scorePlayer2.textContent = scores[2];
  };
  resetBoard = function () {
    game.resetGame();
    this.cells.forEach((cell) => { cell.textContent = ""; });
    this.displayWinner(undefined, true);
  };

}

class Players {
  constructor() {
    this.player1 = {
      mark: "x",
      score: 0,
    }
    this.player2 = {
      mark: "o",
      score: 0,
    }
  }
  updateScores = function (result) {
    if (this.player1.mark === result) {
      this.player1.score++;
    } else if (this.player2.mark === result) {
      this.player2.score++;
    }
    return {
      1: this.player1.score,
      2: this.player2.score
    };
  };
  switchSides = function () {
    this.player1.mark = (this.player1.mark === "x") ? "o" : "x";
    this.player2.mark = (this.player2.mark === "x") ? "o" : "x";
  }

  getPlayer = function (mark) {
    return (this.player1.mark === mark) ? 1 : 2;
  }
}

const controller = new Controller();
