"use strict";

// Pieces Types
const PAWN_BLACK = "♟";
const ROOK_BLACK = "♜";
const KNIGHT_BLACK = "♞";
const BISHOP_BLACK = "♝";
const QUEEN_BLACK = "♛";
const KING_BLACK = "♚";
const PAWN_WHITE = "♙";
const ROOK_WHITE = "♖";
const KNIGHT_WHITE = "♘";
const BISHOP_WHITE = "♗";
const QUEEN_WHITE = "♕";
const KING_WHITE = "♔";

// The Chess Board
var gBoard;
var gSelectedElCell = null;

function restartGame() {
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  // build the board 8 * 8
  var board = [];
  for (var i = 0; i < 8; i++) {
    board[i] = [];
    for (var j = 0; j < 8; j++) {
      var piece = "";
      if (i === 1) piece = PAWN_BLACK;
      if (i === 6) piece = PAWN_WHITE;
      board[i][j] = piece;
    }
  }
  board[0][0] = board[0][7] = ROOK_BLACK;
  board[0][1] = board[0][6] = KNIGHT_BLACK;
  board[0][2] = board[0][5] = BISHOP_BLACK;
  board[0][3] = QUEEN_BLACK;
  board[0][4] = KING_BLACK;

  board[7][0] = board[7][7] = ROOK_WHITE;
  board[7][1] = board[7][6] = KNIGHT_WHITE;
  board[7][2] = board[7][5] = BISHOP_WHITE;
  board[7][3] = QUEEN_WHITE;
  board[7][4] = KING_WHITE;

  // console.table(board);
  return board;
}

function renderBoard(board) {
  var strHtml = "";
  for (var i = 0; i < board.length; i++) {
    var row = board[i];
    strHtml += "<tr>";
    for (var j = 0; j < row.length; j++) {
      var cell = row[j];
      // figure class name
      var className = (i + j) % 2 === 0 ? "white" : "black";
      var tdId = "cell-" + i + "-" + j;
      strHtml +=
        '<td id="' +
        tdId +
        '" onclick="cellClicked(this)" ' +
        'class="' +
        className +
        '">' +
        cell +
        "</td>";
      if (i === 1 && j === 0) console.log("strHtml", strHtml);
    }
    strHtml += "</tr>";
  }
  var elMat = document.querySelector(".game-board");
  elMat.innerHTML = strHtml;
}

function cellClicked(elCell) {
  // console.log('elCell', elCell)
  if (elCell.classList.contains("mark")) {
    movePiece(gSelectedElCell, elCell);
    cleanBoard();
    return;
  }
  // TODO: if the target is marked - move the piece!
  cleanBoard();

  elCell.classList.add("selected");
  gSelectedElCell = elCell;

  // console.log('elCell.id: ', elCell.id); // 'cell-1-4'
  var cellCoord = getCellCoord(elCell.id); // {i:1,j:4};
  // console.log('cellCoord', cellCoord);
  var piece = gBoard[cellCoord.i][cellCoord.j];
  // console.log('piece', piece);

  var possibleCoords = [];
  switch (piece) {
    case ROOK_BLACK:
    case ROOK_WHITE:
      possibleCoords = getAllPossibleCoordsRook(cellCoord);
      break;
    case BISHOP_BLACK:
    case BISHOP_WHITE:
      possibleCoords = getAllPossibleCoordsBishop(cellCoord);
      break;
    case KNIGHT_BLACK:
    case KNIGHT_WHITE:
      possibleCoords = getAllPossibleCoordsKnight(cellCoord);
      break;
    case PAWN_BLACK:
    case PAWN_WHITE:
      possibleCoords = getAllPossibleCoordsPawn(
        cellCoord,
        piece === PAWN_WHITE
      );
      break;
  }
  markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
  // TODO: use: getCellCoord to get the coords, move the piece
  // console.log('elFromCell',elFromCell );
  // console.log('elToCell', elToCell);
  var fromCoord = getCellCoord(elFromCell.id);
  var toCoord = getCellCoord(elToCell.id);
  var piece = gBoard[fromCoord.i][fromCoord.j];
  gBoard[toCoord.i][toCoord.j] = piece;
  gBoard[fromCoord.i][fromCoord.j] = "";
  // update the MODEl, update the DOM
  elToCell.innerText = piece;
  elFromCell.innerText = "";
}

function markCells(coords) {
  // console.log('coords', coords)
  // query select them one by one and add mark
  for (var i = 0; i < coords.length; i++) {
    var coord = coords[i]; // {i:2,j:3};
    var selector = getSelector(coord); // `#cell-${coord.i}-${coord.j}`;
    var elCell = document.querySelector(selector); // <td></td>
    elCell.classList.add("mark");
  }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
  var coord = {};
  var parts = strCellId.split("-"); // ['cell','2','7']
  coord.i = +parts[1]; // 2
  coord.j = +parts[2]; // 7
  return coord;
}

function cleanBoard() {
  var elTds = document.querySelectorAll(".mark, .selected");
  for (var i = 0; i < elTds.length; i++) {
    elTds[i].classList.remove("mark", "selected");
  }
}

function getSelector(coord) {
  return "#cell-" + coord.i + "-" + coord.j;
}

function isEmptyCell(coord) {
  return gBoard[coord.i][coord.j] === "";
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
  // console.log('pieceCoord', pieceCoord);
  // console.log('isWhite', isWhite);
  var res = [];
  // handle PAWN use isEmptyCell()
  var diff = isWhite ? -1 : 1;
  var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
  if (isEmptyCell(nextCoord)) res.push(nextCoord);
  else return res;

  if ((pieceCoord.i === 1 && !isWhite) || (pieceCoord.i === 6 && isWhite)) {
    diff *= 2;
    nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    // console.log('nextCoord', nextCoord);
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
  }
  return res;
}

function getAllPossibleCoordsRook(pieceCoord) {
  var res = [];
  var currCoordI = pieceCoord.i;
  var currCoordJ = pieceCoord.j;

  for (var i = currCoordI + 1; i < gBoard.length; i++) {
    var nextCoord = { i: i, j: currCoordJ };
    console.log("gBoard[i][currCoordJ]", gBoard[i][currCoordJ]);
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else i = gBoard.length;
  }
  for (var i = currCoordI - 1; i >= 0; i--) {
    var nextCoord = { i: i, j: currCoordJ };
    console.log("gBoard[i][currCoordJ]", gBoard[i][currCoordJ]);
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else i = 0;
  }
  for (var j = currCoordJ + 1; j < gBoard[0].length; j++) {
    var nextCoord = { i: currCoordI, j: j };
    console.log("gBoard[i][currCoordJ]", gBoard[currCoordI][j]);
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else j = gBoard[0].length;
  }
  for (var j = currCoordJ - 1; j >= 0; j--) {
    var nextCoord = { i: currCoordI, j: j };
    console.log("j", j);
    console.log("gBoard[i][currCoordJ]", gBoard[currCoordI][j]);
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else j = 0;
  }

  return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
  var res = [];
  var i = pieceCoord.i - 1;
  //debugger
  //i = 2;
  for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
    var coord = { i: i--, j: idx };
    console.log("coord", coord);
    if (!isEmptyCell(coord)) break;
    res.push(coord);
  }
  i = pieceCoord.i - 1;
  for (var idx = pieceCoord.j - 1; i >= 0 && idx < 8; idx--) {
    var coord = { i: i--, j: idx };
    console.log("coord", coord);
    if (!isEmptyCell(coord)) break;
    res.push(coord);
  }
  i = pieceCoord.i + 1;
  for (var idx = pieceCoord.j - 1; i >= 0 && idx < 8; idx--) {
    var coord = { i: i++, j: idx };
    console.log("coord", coord);
    if (!isEmptyCell(coord)) break;
    res.push(coord);
  }

  i = pieceCoord.i + 1;
  for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
    var coord = { i: i++, j: idx };
    console.log("coord", coord);
    if (!isEmptyCell(coord)) break;
    res.push(coord);
  }

  return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
  var res = [];
  var currCoordI = pieceCoord.i;
  var currCoordJ = pieceCoord.j;
  //debugger;
  //2 step backwards 1 left
  if (currCoordI - 2 >= 0 && currCoordJ - 1 >= 0) {
    var nextCord = { i: currCoordI - 2, j: currCoordJ - 1 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
  //2 steps backwards 1 right
  if (currCoordI - 2 >= 0 && currCoordJ + 1 < gBoard[0].length) {
    nextCord = { i: currCoordI - 2, j: currCoordJ + 1 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
    //2 steps forward 1 left
  if (currCoordI + 2 < gBoard.length && currCoordJ - 1 >= 0) {
    nextCord = { i: currCoordI + 2, j: currCoordJ - 1 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
  //2 steps forward 1 right
  if (currCoordI + 2 <= gBoard.length && currCoordJ + 1 < gBoard[0].length) {
    nextCord = { i: currCoordI + 2, j: currCoordJ + 1 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
  //2 steps right 1 backwards
  if (currCoordI - 1 >= 0 && currCoordJ + 2 < gBoard[0].length) {
    nextCord = { i: currCoordI - 1, j: currCoordJ + 2 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
//2 steps right 1 forwars
  if (currCoordI + 1 < gBoard.length && currCoordJ + 2 >= 0) {
    nextCord = { i: currCoordI + 1, j: currCoordJ + 2 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
  //2 steps left 1 backwords
  if (currCoordI - 1 >= 0 && currCoordJ - 2 >= 0) {
    nextCord = { i: currCoordI - 1, j: currCoordJ - 2 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }
  //2 steps left 1 forwards
  if (currCoordI + 1 < gBoard.length && currCoordJ - 2 >= 0) {
    nextCord = { i: currCoordI + 1, j: currCoordJ - 2 };
    if (isEmptyCell(nextCord)) res.push(nextCord);
  }

  return res;
}


// function getAllPossibleCoordsQueen(){

// }