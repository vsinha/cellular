var canvas;
var ctx;

// Width & Height in pixels of the html canvas
var width;
var height;

var gameBoard;
var squareSize = 10;

// Rows & cols in game board
var rows;
var cols;

// For the timer
var timer;
var delay = 100;


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
  displayBoard(gameBoard);
}

function displayBoard(board) {
  // Display the current board

  //printBoard(gameBoard);

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

function toggleCellState(i, j) {
  if (gameBoard[i][j] == 0) {
    gameBoard[i][j] = 1;
  } else {
    gameBoard[i][j] = 0;
  }

  displayBoard(gameBoard);
}

function setCellStateAtCoordinate(x, y, state) {
  gameBoard[Math.floor(y / squareSize)][Math.floor(x / squareSize)] = state;
  displayBoard(gameBoard);
}

function getCellStateAtCoordinate(x, y) {
  var state = gameBoard[Math.floor(y / squareSize)][Math.floor(x / squareSize)];
  return state;
}

function onCanvasClick(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;

    var i = y / squareSize;
    var j = x / squareSize;

    console.log("click in square %f, %f", i, j);
    toggleCellState(Math.floor(i), Math.floor(j));
}

function stopIterate() {
  clearInterval(timer);
}

function beginIterate() {
  timer = setInterval(updateBoard, delay);
}

function main() {
  canvas = document.getElementById("gameBoard");

  canvas.addEventListener('click', onCanvasClick, false);

  canvas.addEventListener("mousedown", function(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;

    var state = getCellStateAtCoordinate(x, y);

    function mouseMoveHandler(ev) {
        var x = ev.clientX - canvas.offsetLeft;
        var y = ev.clientY - canvas.offsetTop;

        console.log("%f, %f: %d", x, y, state);

        if (state == 0) {
          setCellStateAtCoordinate(x, y, 1);
        } else if (state == 1) {
          setCellStateAtCoordinate(x, y, 0);
        }
    }

    canvas.addEventListener("mousemove", mouseMoveHandler);

    canvas.addEventListener("mouseup", function(ev) {
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    }, false);
  }, false);

  ctx = canvas.getContext("2d");


  width = canvas.width;
  height = canvas.height;

  cols = width/squareSize;
  rows = height/squareSize;

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
