"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

//TODO: make docstrings

const btnDiv = document.createElement("div");

//TODO: add default colors to the form inputs themselves
const player1color = document.createElement("input");
player1color.placeholder = "Player 1 color";
const player2color = document.createElement("input");
player2color.placeholder = "Player 2 color";
btnDiv.append(player1color);
btnDiv.append(player2color);

const startBtn = document.createElement("button");
startBtn.innerHTML = "START GAME!";
const page = document.getElementById("game");
btnDiv.append(startBtn);
page.prepend(btnDiv);
startBtn.addEventListener("click", function () {
  new Game(6, 7, player1color.value, player2color.value);
});

class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  // pass in default color values for each player
  //TODO: maybe figure out how to add defaut colors for players, or add validation
  // that colors have been chosen
  constructor(height=6, width=7, p1Color = "red", p2Color = "blue") {
    this.width = width;
    this.height = height;
    this.board = [];
    this.makeHtmlBoard();
    this.makeBoard();
    this.gameStatus = true;
    this.player1 = new Player(p1Color);
    this.player2 = new Player(p2Color);
    this.currPlayer = this.player1;
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width })); // please explain this
    }
  }

  makeHtmlBoard() {
    const HTMLboard = document.getElementById("board");
    HTMLboard.innerHTML = "";
    // console.log(HTMLboard);

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    HTMLboard.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `c-${y}-${x}`);
        row.append(cell);
      }

      HTMLboard.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    // piece.classList.add(`p${this.currPlayer}`);
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2); // what the heck does this actually do stylistically?? Magic# :(

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    // console.log(evt.target.id)
    if (this.gameStatus === false) {
      return;
    }
    const x = Number(evt.target.id);

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      this.gameStatus = false;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check for tie
    if (this.board.every((row) => row.every((cell) => cell))) {
      this.gameStatus = false;
      return this.endGame("Tie!");
    }

    // switch players
    this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1;
  }

  checkForWin() {
    //TODO: rewrite _win as arrow function so it doesn't create its own this
    const _win = (cells) =>
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x <= this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        //TODO: try to call/bind _win here
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

// new Game(6, 7);

/*
const width = 7;
const height = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
*/

/** makeBoard: create in-JS board structure:
 *   board = array of rows, each row is array of cells  (board[y][x])
 */

/*
function makeBoard() {
  for (let y = 0; y < height; y++) {
    board.push(Array.from({ length: width }));
  }
}*/

/** makeHtmlBoard: make HTML table and row of column tops. */

// function makeHtmlBoard() {
//   const board = document.getElementById('board');

//   // make column tops (clickable area for adding a piece to that column)
//   const top = document.createElement('tr');
//   top.setAttribute('id', 'column-top');
//   top.addEventListener('click', handleClick);

//   for (let x = 0; x < width; x++) {
//     const headCell = document.createElement('td');
//     headCell.setAttribute('id', x);
//     top.append(headCell);
//   }

//   board.append(top);

//   // make main part of board
//   for (let y = 0; y < height; y++) {
//     const row = document.createElement('tr');

//     for (let x = 0; x < width; x++) {
//       const cell = document.createElement('td');
//       cell.setAttribute('id', `c-${y}-${x}`);
//       row.append(cell);
//     }

//     board.append(row);
//   }
// }

/** findSpotForCol: given column x, return top empty y (null if filled) */

// function findSpotForCol(x) {
//   for (let y = height - 1; y >= 0; y--) {
//     if (!board[y][x]) {
//       return y;
//     }
//   }
//   return null;
// }

/** placeInTable: update DOM to place piece into HTML table of board */

// function placeInTable(y, x) {
//   const piece = document.createElement("div");
//   piece.classList.add("piece");
//   piece.classList.add(`p${currPlayer}`);
//   piece.style.top = -50 * (y + 2);

//   const spot = document.getElementById(`c-${y}-${x}`);
//   spot.append(piece);
// }

/** endGame: announce game end */

// function endGame(msg) {
//   alert(msg);
// }

/** handleClick: handle click of column top to play piece */

// function handleClick(evt) {
//   // get x from ID of clicked cell
//   const x = +evt.target.id;

//   // get next spot in column (if none, ignore click)
//   const y = findSpotForCol(x);
//   if (y === null) {
//     return;
//   }

//   // place piece in board and add to HTML table
//   board[y][x] = currPlayer;
//   placeInTable(y, x);

//   // check for win
//   if (checkForWin()) {
//     return endGame(`Player ${currPlayer} won!`);
//   }

//   // check for tie
//   if (board.every((row) => row.every((cell) => cell))) {
//     return endGame("Tie!");
//   }

//   // switch players
//   currPlayer = currPlayer === 1 ? 2 : 1;
// }

/** checkForWin: check board cell-by-cell for "does a win start here?" */

// function checkForWin() {
//   function _win(cells) {
//     // Check four cells to see if they're all color of current player
//     //  - cells: list of four (y, x) cells
//     //  - returns true if all are legal coordinates & all match currPlayer

//     return cells.every(
//       ([y, x]) =>
//         y >= 0 &&
//         y < height &&
//         x >= 0 &&
//         x < width &&
//         board[y][x] === currPlayer
//     );
//   }

//   for (let y = 0; y < height; y++) {
//     for (let x = 0; x < width; x++) {
//       // get "check list" of 4 cells (starting here) for each of the different
//       // ways to win
//       const horiz = [
//         [y, x],
//         [y, x + 1],
//         [y, x + 2],
//         [y, x + 3],
//       ];
//       const vert = [
//         [y, x],
//         [y + 1, x],
//         [y + 2, x],
//         [y + 3, x],
//       ];
//       const diagDR = [
//         [y, x],
//         [y + 1, x + 1],
//         [y + 2, x + 2],
//         [y + 3, x + 3],
//       ];
//       const diagDL = [
//         [y, x],
//         [y + 1, x - 1],
//         [y + 2, x - 2],
//         [y + 3, x - 3],
//       ];

//       // find winner (only checking each win-possibility as needed)
//       if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
//         return true;
//       }
//     }
//   }
// }

// makeBoard();
// makeHtmlBoard();
