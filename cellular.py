#!/usr/bin/env python

import numpy as np
import pprint
import time

# number of steps to run the game for
_NUM_ITERS = 15

COMPASS = set([(0,  -1),
              (1,  -1),
              (1,   0),
              (1,   1),
              (0,   1),
              (-1,  1),
              (-1,  0),
              (-1, -1)])

class Cellular(object):
  def __init__(self):
    self.rows = 10
    self.cols = 10
    
    # create 2 boards, one is the current one, and one will store the updated cells
    # to be displayed in the next iteration
    self.board = np.zeros((self.rows, self.cols), dtype=np.int)
    self.nextBoard = np.zeros((self.rows, self.cols), dtype=np.int)
    self.board[0][1] = 1
    self.board[1][2] = 1
    self.board[2][2] = 1
    self.board[2][0] = 1
    self.board[2][1] = 1

  # called on each cell to check its neighbors and update nextBoard
  # with a value depending on whether we live or die at (i,j)
  def updateCell(self, i, j):
    activeCells = 0

    try:
      for coord in COMPASS:
        activeCells += self.board[i+coord[0], j+coord[1]]
    except IndexError:
      # If we're here, we've tried to check beyond the edges of the game
      # just skip it for conveneince.
      # this makes the edges of the board act like walls
      pass

    # rules for live cells
    if self.board[i][j] == 1:
                  
      # die due to starvation
      if activeCells < 2:
        pass

      # 2 or 4 neighbors, stay alive
      if activeCells == 2 or activeCells == 3:
        self.nextBoard[i][j] = 1
      
      # die due to overcrowding
      if activeCells > 3:
        pass

    # rules for dead cells
    if self.board[i][j] == 0:
      # come to life if we have exactly 3 neighbors
      if activeCells == 3:
        self.nextBoard[i][j] = 1

  # reinitialize the nextboard
  def initNextBoard(self):
    self.nextBoard = np.zeros((self.rows, self.cols), dtype=np.int)


  def run(self):
    self.displayBoard()

    for _ in xrange(_NUM_ITERS):
      # iterate over each cell in the current board,
      # grabbing its value and updating it
      for (i, j), value in np.ndenumerate(self.board):
        self.updateCell(i, j)

      # since we've put the updated values in nextBoard,
      # copy that over to be our new current board
      self.board = np.copy(self.nextBoard)
      
      # reinitialize the board for next time
      self.initNextBoard()
      
      # print the board
      self.displayBoard()
      
      time.sleep(0.5)

  # just-short-of-ugly-as-heck print function
  def displayBoard(self):
    pprint.pprint(self.board)


def main():
  c = Cellular()
  c.run()
  

if __name__ == "__main__":
  main()
