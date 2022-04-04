'use strict'

// Pieces Types
const PAWN_BLACK = '♟';
const ROOK_BLACK = '♜';
const KNIGHT_BLACK = '♞';
const BISHOP_BLACK = '♝';
const QUEEN_BLACK = '♛';
const KING_BLACK = '♚';
const PAWN_WHITE = '♙';
const ROOK_WHITE = '♖';
const KNIGHT_WHITE = '♘';
const BISHOP_WHITE = '♗';
const QUEEN_WHITE = '♕';
const KING_WHITE = '♔';

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
            var piece = '';
            if (i === 1) piece = PAWN_BLACK;
            if (i === 6) piece = PAWN_WHITE;
            board[i][j] = piece
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
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            // figure class name
            var className = ((i + j) % 2 === 0) ? 'white' : 'black';
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" onclick="cellClicked(this)" ' +
                'class="' + className + '">' + cell + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.game-board');
    elMat.innerHTML = strHtml;
}


function cellClicked(elCell) {
    // console.log('elCell', elCell)

    // if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        movePiece(gSelectedElCell, elCell);
        cleanBoard();
        return
    }
    cleanBoard();

    elCell.classList.add('selected');
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
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE);
            break;

    }
    markCells(possibleCoords);
}

function movePiece(elFromCell, elToCell) {
    // use: getCellCoord to get the coords, move the piece
    // console.log('elFromCell', elFromCell);
    // console.log('elFromCell.id', elFromCell.id);
    // console.log('elToCell', elToCell);
    // console.log('elToCell.id', elToCell.id);

    var fromCoord = getCellCoord(elFromCell.id) // {i:1,j:3}
    console.log('fromCoord', fromCoord)
    var toCoord = getCellCoord(elToCell.id)// {i:3,j:3}
    console.log('toCoord', toCoord);
    // update the MODEl, 
    var piece = gBoard[fromCoord.i][fromCoord.j];
    gBoard[toCoord.i][toCoord.j] = piece;
    gBoard[fromCoord.i][fromCoord.j] = '';

    // update the DOM
    elToCell.innerText = piece;
    elFromCell.innerText = '';


}

function markCells(coords) {
    // console.log('coords', coords)
    // query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i]; // {i:2,j:3};
        var selector = getSelector(coord) // '#cell-2-3';
        var elCell = document.querySelector(selector); // <td></td>
        elCell.classList.add('mark');
    }
}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    var coord = {};
    var parts = strCellId.split('-'); // ['cell','2','7']
    coord.i = +parts[1] // 2
    coord.j = +parts[2]; // 7
    return coord;
}

function cleanBoard() {
    var elTds = document.querySelectorAll('.mark, .selected');
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected');
    }
}

// {i:2,j:3} => '#cell-2-3'
function getSelector(coord) {
    return '#cell-' + coord.i + '-' + coord.j
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    // console.log('pieceCoord', pieceCoord);
    // console.log('isWhite', isWhite);
    var res = [];
    // handle PAWN use isEmptyCell()
    var diff = isWhite ? -1 : 1;
    var nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
    if (isEmptyCell(nextCoord)) res.push(nextCoord);
    else return res

    if (pieceCoord.i === 1 && !isWhite || pieceCoord.i === 6 && isWhite) {
        diff *= 2;
        nextCoord = { i: pieceCoord.i + diff, j: pieceCoord.j };
        // console.log('nextCoord', nextCoord);
        if (isEmptyCell(nextCoord)) res.push(nextCoord);

    }
    return res;
}


function getAllPossibleCoordsRook(pieceCoord) {
    var res = [];

    return res;
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res;
}

function getAllPossibleCoordsKnight(pieceCoord) {
    var res = [];

    return res;
}
