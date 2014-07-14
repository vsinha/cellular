var width;
var height;
var canvas;
var ctx;


function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function main() {
  canvas = document.getElementById("gameBoard");
  ctx = canvas.getContext("2d");

  width = canvas.width;
  height = canvas.height;


  var squareSize = 10;
  for (var i = 0; i < width; i += squareSize) {
    for (var j = 0; j < height; j += squareSize) {
      drawRect(i, j, squareSize-1, squareSize-1, "#33AA55");
    }
  }


}
