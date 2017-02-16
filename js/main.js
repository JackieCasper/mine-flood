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
var board;


// Function to create tiles
var tileFactory = function (row, column) {

  // create tile element
  var $tile = $('<div class="game-tile">');

  // create tile object
  var tile = {
    // define tile vars
    row: row,
    column: column,
    value: 0,
    activated: false,
    marked: false,

    // tile methods
    // function to get surrounding tiles
    getSurrounding: function () {
      // difine row and column in scope
      var row = this.row;
      var column = this.column;

      // filter board tiles to only include tiles that surround this tile, also not including this tile
      return board.tiles.filter(function (tile) {
        return ((row - 1 >= 0 && tile.row === row - 1) || tile.row === row || (row + 1 < board.rowAmount && tile.row === row + 1)) && ((column - 1 >= 0 && tile.column === column - 1) || tile.column === column || (column + 1 < board.columnAmount && tile.column === column + 1)) && !(tile.row === row && tile.column === column)
      });

    },

    // function to activate tile
    activate: function () {
      // if it is a bomb
      if (this.value === '') {
        // handle loss
        board.handleLoss();
        return false;

        // otherwise, if there are no bombs around it
      } else if (this.value === 0) {
        this.activated = true;
        // get surrounding tiles
        var surroundingTiles = this.getSurrounding();
        // activate each surrounding tile, it its not already activated
        surroundingTiles.forEach(function (adjTile) {
          if (!adjTile.activated) {
            adjTile.activate();
          }
        });
      }

      // set tile to activated
      this.activated = true;

      // re-render tile
      this.render();

      // add to activated tiles
      board.activatedTiles++;

      // if all tiles that aren't bombs are activated
      if (board.activatedTiles === board.totalNonBombs) {
        // handle win
        setTimeout(function () {
          board.handleWin();
        }, 250);
      }
      return true;
    },

    // function to assign a value to the tile
    assignValue: function () {
      // if it is a bomb
      if (this.value === '') {
        //already assigned, return true
        return true;
        // if it isn't a bomb
      } else {
        // set this tile's value to the the amount of surrounding tiles that are bombs
        this.value = this.getSurrounding().filter(function (tile) {
          return tile.value === '';
        }).length;
      }
    },

    // function to render tile
    render: function () {
      // if it is activated 
      if (this.activated) {
        // if there are bombs around it
        if (this.value != 0) {
          // set the text to the value
          $(this).text(this.value);
        }
        // add class to display value's styling
        $(this).addClass(`active-${this.value} active`);
      } else if (this.marked) {
        $(this).text('*');
        $(this).addClass('marked');
      }
    },

    // function to toggle if the tile is marked
    toggleMarked: function () {
      // set marked to not marked
      this.marked = !this.marked;
      // add to bomb guesses
      board.bombGuesses++;
      // render tile
      this.render();
    }


  }



  // set the tile prototype to the tile element
  tile.__proto__ = $($tile);

  // append the tile to the game board
  $(board).append($(tile));
  // add tile to board's tiles
  board.tiles.push[tile];


  // add right click event handler
  $(tile).contextmenu(function () {
    // toggle marked
    tile.toggleMarked();
    return false;
  });

  // add click event handler 
  $(tile).click(function () {
    // if it is the first tile clicked
    if (!board.valuesAssigned) {
      // generate bombs
      board.generateBombs(tile);
      // otherwise
    } else if (!tile.activated && !tile.marked) {
      // activate tiles
      tile.activate();
    }
  })

  // return the created tile
  return tile;
}


// function to create game board
var boardFactory = function (rows, columns, bombs) {

  // get game board element
  var $board = $('#game-board');

  // create board object
  var board = {
    // define board vars
    tiles: [],
    rowAmount: rows,
    columnAmount: columns,
    bombAmount: bombs,
    bombGuesses: 0,
    valuesAssigned: false,
    activatedTiles: 0,
    totalNonBombs: rows * columns - bombs,

    // define board methods
    handleLoss: function () {
      alert('You Lose');
    },

    handleWin: function () {
      alert('You Win')
    },

    // method to get a specific tile
    getTile: function (row, column) {
      return this.tiles.filter(function (tile) {
        return tile.row === row && tile.column === column;
      })[0];
    },

    // method to assign values to each of the tiles
    assignValues: function () {
      this.valuesAssigned = true;
      // foreach tile
      this.tiles.forEach(function (tile) {
        // assign value
        tile.assignValue();
      });

      // define the board in the scope
      var board = this;
      // after a pause, activate the first tile
      setTimeout(function () {
        board.firstTile.activate();
      }, 100);

    },

    // function to generate bombs
    generateBombs: function (firstTile) {
      //

      var randomTiles = this.tiles.filter(function (tile) {
        return !(tile.row === firstTile.row && tile.column === firstTile.column);
      });
      randomTiles.sort(function (a, b) {
        return .5 - Math.random();
      });
      for (var i = 0; i < this.bombAmount; i++) {
        this.getTile(randomTiles[i].row, randomTiles[i].column).value = '';
      }
      this.firstTile = firstTile;
      this.assignValues();
    },

    clear: function () {
      $(this).children().remove();
    },

    size: function () {
      var vpw = $(window).innerWidth();
      var vph = $(window).innerHeight();

      var size = (vpw / this.columnAmount) > (vph / this.rowAmount) ? ((vph / 10) * 8) / this.rowAmount : ((vpw / 10) * 8) / this.columnAmount;

      $(this).width(size * this.columnAmount).height(size * this.rowAmount);
      this.tiles.forEach(function (tile) {
        $(tile).width(size).height(size);
      });

    },

    generateTiles: function () {

      console.log(this);
      for (var row = 0; row < this.rowAmount; row++) {
        for (var col = 0; col < this.columnAmount; col++) {
          var tile = tileFactory(row, col);
          this.tiles.push(tile);
        }
      }
      this.size();
    }



  }
  board.__proto__ = $board;


  return board;
}



function Level() {

}

$(function () {

  board = boardFactory(10, 15, 20);
  board.generateTiles();

  $(window).resize(function () {
    board.size();
  });
  console.log(board);

});