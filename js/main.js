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
  var board = game.currentLevel.board;
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
      }
    },

    // function to toggle if the tile is marked
    toggleMarked: function () {
      // set marked to not marked
      this.marked = !this.marked;
      // add or remove from bomb guesses
      if (this.marked) {
        board.bombGuesses++;
      } else {
        board.bombGuesses--;
      }
      $(this).toggleClass('marked');

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
  var $board = $('<div id="game-board" class="game-board">');

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
        game.currentLevel.timer.start();
      }, 100);

    },

    // function to generate bombs
    generateBombs: function (firstTile) {
      this.firstTile = firstTile;

      // create new array of tiles excluding the first tile
      var randomTiles = this.tiles.filter(function (tile) {
        return !(tile.row === firstTile.row && tile.column === firstTile.column);
      });
      // sort tiles randomly
      randomTiles.sort(function (a, b) {
        return .5 - Math.random();
      });
      // assign bombs
      for (var i = 0; i < this.bombAmount; i++) {
        this.getTile(randomTiles[i].row, randomTiles[i].column).value = '';
      }
      // assign values
      this.assignValues();
    },


    // function to clear the game board
    clear: function () {
      $(this).children().remove();
    },

    // function to size / resize the game board
    size: function () {
      // get vph and vpw
      var vpw = $(window).innerWidth();
      var vph = $(window).innerHeight();

      // get size of each tile
      var size = (vpw / this.columnAmount) > (vph / this.rowAmount) ? ((vph / 10) * 8) / this.rowAmount : ((vpw / 10) * 8) / this.columnAmount;

      //set size of board
      $(this).width(size * this.columnAmount).height(size * this.rowAmount);

      // set size of tiles
      this.tiles.forEach(function (tile) {
        $(tile).width(size).height(size);
      });

    },

    // function to generate tiles
    generateTiles: function () {
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



function Level(rows, cols, bombs) {
  this.rows = rows;
  this.columns = cols;
  this.bombs = bombs;
  this.board = boardFactory(rows, cols, bombs);
  this.highScore = 0;
  this.timer = new Timer();


  this.renderLevel = function () {
    var self = this;
    $('.levels').slideUp('slow', function () {
      console.log(self.board);
      $('.sub-head').text()
      $('.container').append(self.board);
      self.board.generateTiles();
    });
  }
}

function Timer() {
  this.time = 0;
  this.running = false;
  this.interval;

  this.start = function () {
    if (!this.running) {
      var self = this;
      this.running = true;

      this.interval = setInterval(function () {
        self.increment();
        self.render();
      }, 100)
    }
  };
  this.render = function () {
    $('#timer').text(this.getFormatted());
  }

  this.pause = function () {
    this.running = false;
    window.clearInterval(this.intervalID);
  };
  this.reset = function () {

  }
  this.increment = function () {
    if (this.running) {
      this.time += .1;
    }
  }
  this.getFormatted = function () {
    var seconds = Math.floor(this.time);
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (seconds.toString().length === 1) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  }
}

var game = {
  levels: [
    new Level(10, 15, 20),
    new Level(12, 15, 30),
    new Level(15, 17, 35),
    new Level(18, 20, 40)

  ],
  playerName: '',

  currentLevel: 0,

  generateLevelChoice: function () {
    var $levels = $('.levels');
    var $levelHolder;
    var $levelContainer;
    var $level;
    var $score;
    var self = this;
    this.levels.forEach(function (level, i) {

      $('.sub-head').text(self.playerName);
      $levelHolder = $('<div class="level-holder">');
      $levelContainer = $('<div class="level-container">');

      $level = $('<h4 class="level">');
      $level.text(i + 1);
      $levelContainer.append($level);
      $levelContainer.click(function () {
        self.currentLevel = level;
        level.renderLevel();
      });

      if (level.highScore > 0) {
        $score = $('<p class="score">');
        $score.text(level.highScore);
        $levelContainer.append($score);
      }

      $levelHolder.append($levelContainer);

      $levels.append($levelHolder);
    })
  },
  save: function () {

  },
  loadSave: function () {

  },

  size: function () {
    if (this.currentLevel) {
      this.currentLevel.board.size();
    }
  }
}

$(function () {
  //  board = boardFactory(10, 15, 20);
  //  board.generateTiles();
  //$('.container').append($(board));

  game.generateLevelChoice();

  $(window).resize(function () {
    game.size();
  });
  console.log(board);

});