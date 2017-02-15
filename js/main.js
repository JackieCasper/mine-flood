//Pseudo Code
//I want more practice with objects so I'm going to create the following objects

//Board 
//  Tiles
//  Clear()
//  Render()
//  GenerateBombs()
//  AssignValues()
//  GetTile(row, column)
//  numRows
//  numColumns
//  handleLoss()
//  handleWin()

//Tile
//  Activate()
//  getSurrounding()
//  AssignValue()
//  value
//  row
//  column
//  activated

//Timer
//  time
//  Start()
//  Pause()
//  Reset()
//  Render()

//Level
//  board
//  timer
//  highScore
//  levelIndex

//Custom Level
//  board
//  timer

//Game
//  Player
//  Levels


var boardFactory = function (rows, columns, bombs) {
  var board = {
    tiles: [],
    rowAmount: rows,
    columnAmount: columns,
    bombAmount: bombs,
    bombGuesses: 0,
    handleLoss: function () {

    },

    handleWin: function () {

    },

    getTile: function (row, column) {
      return tiles.filter(function (tile) {
        return tile.row === row && tile.column === column;
      })[0];
    },

    assignValues: function () {
      this.tiles.forEach(function (tile) {
        tile.assignValue();
      });
    },

    generateBombs: function (firstTile) {
      var randomTiles = tiles.filter(function (tile) {
        return !(tile.row === firstTile.row && tile.column === firstTile.column);
      });
      randomTiles.sort(function (a, b) {
        return .5 - Math.random();
      });
      for (var i = 0; i < this.bombAmount; i++) {
        this.getTile(randomTiles[i].row, randomTiles[i].column).value = '';
      }
    },

    clear: function () {
      $(this).children().remove();
    },

    generateTiles: function () {
      for (var row = 0; row < this.rowAmount; row++) {
        for (var col = 0; col < this.columnAmount; col++) {
          var tile = tileFactory(row, col);
          this.tiles.push(tile);
        }
      }
    },


  }

  var $board = $('#game-board');
  board.prototype = $board;

  return board;
}


var tileFactory = function (row, column) {
  var tile = {

    row: row,
    column: column,
    value: 0,
    activated: false,

    getSurrounding: function () {
      var row = this.row;
      var column = this.column;

      return board.tiles.filter(function (tile) {
        return (row - 1 >= 0 && tile.row === row - 1) || tile.row === row || (row + 1 < board.rowAmount && tile.row === row + 1);
      }).filter(function (tile) {
        return (column - 1 >= 0 && tile.column === column - 1) || tile.column === column || (column + 1 < board.columnAmount && tile.column === column + 1);
      }).filter(function (tile) {
        return !(tile.row === row && tile.column === column);
      });
    },

    activate: function () {
      if (this.value === '') {
        board.handleLoss();
        return false;
      } else if (this.value === 0) {
        var surroundingTiles = this.getSurrounding();
        surrounding.forEach(function (adjTile) {
          adjTile.activate();
        });
      }

      this.activated = true;
      return true;
    },

    assignValue: function () {
      if (this.value === '') {
        return true;
      } else {
        this.value = this.getSurrounding().filter(function (tile) {
          return tile.value === '';
        }).length;
      }
    },

    render: function () {
      if (this.activated) {
        if (this.value != 0) {
          $(this).text(this.value);
        }
        $(this).addClass(`active-${this.value}`);
      }
    }


  }

  var $tile = $('<div class="game-tile">');
  tile.prototype = $tile;

  $(board).append($(tile));
  board.tiles.push[tile];

  return tile;
}