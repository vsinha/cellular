var width;
var height;
var canvas;
var ctx;
var gameBoard;
var rows = 50;
var cols = rows;


var COMPASS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

var NUM_ITERS = 5;


function zeros(dimensions) {
  // Create an array of zeros with the specified dimensions
  var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}


function updateCell(i, j, currentBoard, nextBoard) {
  var activeCells = 0;
  var cellstate = false;

  for (var d = 0, direction; direction = COMPASS[d]; d++) {
    // Loop over the compass directions

    if (i + direction[0] >= 0
        && i + direction[0] < currentBoard.length
        && j + direction[1] >= 0
        && j + direction[1] < currentBoard[i].length ) {
      activeCells += currentBoard[ i+direction[0] ][ j+direction[1] ];
      //console.log("%d, %d, (%2d, %2d)", i, j, i+direction[0], j+direction[1]);
    } else {
      //console.log("%d, %d, (%2d, %2d) X", i, j, i+direction[0], j+direction[1]);
    }
  }

  // Rules for live cells
  if (currentBoard[i][j] == 1) {
    if (activeCells < 2) {
      // Die
    } else if (activeCells == 2 || activeCells == 3) {
      // Live
      nextBoard[i][j] = 1;
      cellstate = true;
    } else if (activeCells > 3) {
      // Die
    } else {
      // Die
    }
  }

  // Rules for non-living cells
  if (currentBoard[i][j] == 0) {
    if (activeCells == 3) {
      // Come to life
      nextBoard[i][j] = 1
      cellstate = true;
    }
  }

  //console.log("updating %d, %d, %s", i, j, cellstate ? "live" : "die");
}

function updateBoard() {
  console.log("updating the board");
  // Initialize the next board
  var nextBoard = zeros([rows, cols]);

  // Update each cell using the current board
  for (var i = 0; i < gameBoard.length; i++) {
    for (var j = 0; j < gameBoard[i].length; j++) {
      //console.log("updating %d, %d", i, j);
      updateCell(i, j, gameBoard, nextBoard);
    }
    //console.log("finished row");
  }

  // Replace the current board with the next board
  gameBoard = nextBoard;

  // Display the current board
  //printBoard(gameBoard);
  displayBoard(gameBoard);
}

function displayBoard(board) {
  var squareSize = 10;
  for (var i = 0; i < board.length; i += 1) {
    for (var j = 0; j < board[i].length; j += 1) {
      if (board[i][j] == 1) {
        drawRect(j*squareSize, i*squareSize, squareSize-1, squareSize-1, "#33AA55");
      }
      else {
        drawRect(j*squareSize, i*squareSize, squareSize-1, squareSize-1, "#DDDDDD");
      }
    }
  }
}

function printBoard(board) {
  for (var i = 0; i < board.length; i += 1) {
    console.log(board[i]);
  }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function main() {
  canvas = document.getElementById("gameBoard");
  ctx = canvas.getContext("2d");

  width = canvas.width;
  height = canvas.height;

  gameBoard = zeros([rows, cols]);

  // Draw a glider
  gameBoard[0][1] = 1;
  gameBoard[1][2] = 1;
  gameBoard[2][2] = 1;
  gameBoard[2][0] = 1;
  gameBoard[2][1] = 1;

  // Display the board
  //printBoard(gameBoard);
  displayBoard(gameBoard);

  /*
  var squareSize = 10;
  for (var i = 0; i < width; i += squareSize) {
    for (var j = 0; j < height; j += squareSize) {
      drawRect(i, j, squareSize-1, squareSize-1, "#33AA55");
    }
  }
  */
}
