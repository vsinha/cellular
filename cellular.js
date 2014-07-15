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

// Constants
var COMPASS = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
var NUM_ITERS = 5;


// Creates an array of zeros with the specified dimensions
function zeros(dimensions) {
  var array = [];

    for (var i = 0; i < dimensions[0]; ++i) {
        array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
    }
    return array;
}


// Draws our little rectangles
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}


// Display the specified board in the html canvas, colors based on cell's value
function displayBoard(board) {
  for (var i = 0; i < board.length; i += 1) {
    for (var j = 0; j < board[i].length; j += 1) {
      if (board[i][j] == 1) {
        drawRect(j*squareSize, i*squareSize, squareSize-1, squareSize-1, "#33AA55");
      } else {
        drawRect(j*squareSize, i*squareSize, squareSize-1, squareSize-1, "#DDDDDD");
      }
    }
  }
}


// Prints board to console.log (might be useless, originally for debugging)
function printBoard(board) {
  for (var i = 0; i < board.length; i += 1) {
    console.log(board[i]);
  }
}


// Checks around cell location, executes game rules
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


// Creates a new board, performs updateCell on every cell,
// and finally displays the new board
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


// These two functions handle the start and stop buttons in the UI
function stopIterate() {
  clearInterval(timer);
}
function beginIterate() {
  timer = setInterval(updateBoard, delay);
}


// Convert from mouse click coordinate space to gameBoard row/column space
function coordinates2RowAndCol(x, y) {
  i = Math.floor(y / squareSize);
  j = Math.floor(x / squareSize);

  //console.log("click in square %f, %f", i, j);
  return {i: i, j: j};
}


function toggleCellStateAtCoordinate(x, y) {
  var result = coordinates2RowAndCol(x, y);
  var i = result.i;
  var j = result.j;

  if (gameBoard[i][j] == 0) {
    gameBoard[i][j] = 1;
  } else {
    gameBoard[i][j] = 0;
  }

  displayBoard(gameBoard);
}


function setCellStateAtCoordinate(x, y, state) {
  var result = coordinates2RowAndCol(x, y);
  var i = result.i;
  var j = result.j;

  gameBoard[i][j] = state;
  displayBoard(gameBoard);
}


function getCellStateAtCoordinate(x, y) {
  var result = coordinates2RowAndCol(x, y);
  var i = result.i;
  var j = result.j;

  var state = gameBoard[i][j];
  return state;
}


function getMousePositionfromEvent(ev) {
  var x = ev.clientX - canvas.offsetLeft;
  var y = ev.clientY - canvas.offsetTop;
  return {x: x, y: y};
}


function addHandlers() {
    // Handle single click events
  canvas.addEventListener('click', function(ev) {
    var mousePos = getMousePositionfromEvent(ev);
    toggleCellStateAtCoordinate(mousePos.x, mousePos.y);
  });

  // Handle click & drag events
  canvas.addEventListener("mousedown", function(ev) {
    var mouseDownPos = getMousePositionfromEvent(ev);
    var cellState = getCellStateAtCoordinate(mouseDownPos.x, mouseDownPos.y);

    // Create the handler in here so we have access to cellState
    function mouseMoveHandler(ev) {
      var mousePos = getMousePositionfromEvent(ev);

      // Continue to 'paint' the same cell type
      if (cellState == 0) {
        setCellStateAtCoordinate(mousePos.x, mousePos.y, 1);
      } else if (cellState == 1) {
        setCellStateAtCoordinate(mousePos.x, mousePos.y, 0);
      }
    }

    // Add the handler we just created
    canvas.addEventListener("mousemove", mouseMoveHandler);

    // Finally, add the mouseup handler so we remove the mousemove handler
    canvas.addEventListener("mouseup", function(ev) {
      console.log("adding this listener again");
      canvas.removeEventListener("mousemove", mouseMoveHandler);
    }, false);
  }, false);
};


function main() {
  canvas = document.getElementById("gameBoard");

  ctx = canvas.getContext("2d");

  width  = canvas.width;
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

  addHandlers();

  displayBoard(gameBoard);
}
