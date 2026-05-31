class Game {

  // We index board starting from left to right, top to bottom,
  // and use a variable to track the current mark.

  constructor() {
    this.board = new Array(9).fill(undefined);
    this.currentMark = "x";
    this.noMoves = 0;
    this.winner;
    this.roundOver = false;

  }

  static WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  makeMove(coor) {

    if (this.board[coor] !== undefined || this.roundOver === true) {
      return false;
    };

    this.board[coor] = this.currentMark;
    this.noMoves = this.noMoves + 1;

    return true;
  };

  findWinner() {

    for (const [first, second, third] of Game.WINNING_LINES) {

      const firstElement = this.board[first];
      if (firstElement !== undefined &&
        firstElement === this.board[second] &&
        firstElement === this.board[third]) {

        this.winner = this.currentMark;
        return true;
      };
    };

    if (this.noMoves === 9) {
      this.winner = null;
      return true;
    };

    return false;
  };

  getWinner() { return this.winner; };
  getBoard() { return this.board; };
  endRound() { this.roundOver = true; };

  switchMarks() {
    this.currentMark = (this.currentMark === "x") ? "o" : "x";
  }
  resetGame() {
    this.board.fill(undefined);
    this.noMoves = 0;
    this.winner = undefined;
    this.currentMark = "x";
    this.roundOver = false;
  }
  logboard() {
    console.log(`${this.board[0]} ${this.board[1]} ${this.board[2]}`);
    console.log(`${this.board[3]} ${this.board[4]} ${this.board[5]}`);
    console.log(`${this.board[6]} ${this.board[7]} ${this.board[8]}`);
  };
}

class Controller {

  cells = document.querySelectorAll(".cell");

  constructor() {
    this.game = new Game();
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

  gamePlay(cellIndex) {
    /* make move and recieve outcome signal */
    const moveOutcome = this.game.makeMove(cellIndex);
    const roundOver = this.game.findWinner();

    /* Move is made and game continues */
    if (moveOutcome === true && roundOver === false) {
      this.game.switchMarks();
    }
    /* Move is made and Game is over. */
    else if (moveOutcome === true && roundOver === true) {
      const winner = this.game.getWinner();
      const scores = this.players.updateScores(winner);

      this.displayWinner(winner);
      this.displayScores(scores);
      this.players.switchSides();
      this.game.endRound();
    };
    this.displayBoard();
  }

  displayWinner(winner, hide = false) {
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
  displayBoard() {
    let boardArray = this.game.getBoard();
    let cellElements = document.querySelectorAll(".cell");
    for (let cell of cellElements) {
      cell.textContent = boardArray[cell.dataset.index];
    };
  };
  displayScores(scores) {
    const scorePlayer1 = document.querySelector("#score-1");
    const scorePlayer2 = document.querySelector("#score-2");

    scorePlayer1.textContent = scores[1];
    scorePlayer2.textContent = scores[2];
  };
  resetBoard() {
    this.game.resetGame();
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
  updateScores(result) {
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
  switchSides() {
    this.player1.mark = (this.player1.mark === "x") ? "o" : "x";
    this.player2.mark = (this.player2.mark === "x") ? "o" : "x";
  }

  getPlayer(mark) {
    return (this.player1.mark === mark) ? 1 : 2;
  }
}

const controller = new Controller();
