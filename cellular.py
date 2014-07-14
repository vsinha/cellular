#!/usr/bin/env python

import numpy as np
import pprint
import time

_NUM_ITERS = 15


class Cellular(object):
  def __init__(self):
    self.rows = 15
    self.cols = 10
    self.board = np.zeros((self.rows, self.cols), dtype=np.int)
    self.nextBoard = np.zeros((self.rows, self.cols), dtype=np.int)
    self.board[0][1] = 1
    self.board[1][2] = 1
    self.board[2][2] = 1
    self.board[2][0] = 1
    self.board[2][1] = 1
    #self.board[0][0] = 1


  def updateCell(self, i, j):
    activeCells = 0

    # check cells around us

    # north
    if j > 0:
      activeCells += self.board[i, j-1]

    # northeast
    if j > 0 and i < self.rows - 1:
      activeCells += self.board[i+1, j-1]

    # east
    if i < self.rows - 1:
      activeCells += self.board[i+1, j]

    # southeast
    if i < self.rows - 1 and j < self.cols - 1:
      activeCells += self.board[i+1, j+1]

    # south
    if j < self.cols - 1:
      activeCells += self.board[i, j+1]

    # southwest
    if j < self.cols - 1 and i > 0:
      activeCells += self.board[i-1, j+1]

    # west
    if i > 0:
      activeCells += self.board[i-1, j]

    # northwest
    if i > 0 and j > 0:
      activeCells += self.board[i-1, j-1]


    # if 3 are active, live
    #print i, j, activeCells

    # rules for live cells
    if self.board[i][j] == 1:
      if activeCells < 2:
        # die
        pass

      if activeCells == 2 or activeCells == 3:
        self.nextBoard[i][j] = 1

      if activeCells > 3:
        # die
        pass

    # rules for dead cells
    if self.board[i][j] == 0:
      if activeCells == 3:
        self.nextBoard[i][j] = 1

  def initNextBoard(self):
    self.nextBoard = np.zeros((self.rows, self.cols), dtype=np.int)


  def run(self):
    self.displayBoard()

    for _ in xrange(_NUM_ITERS):
      for (i, j), value in np.ndenumerate(self.board):
        self.updateCell(i, j)

      self.board = np.copy(self.nextBoard)
      self.initNextBoard()
      self.displayBoard()
      time.sleep(0.5)

  def displayBoard(self):
    pprint.pprint(self.board)




def main():
  c = Cellular()
  c.run()





if __name__ == "__main__":
  main()
