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
    color: '',

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
        if (this.value !== 0) {
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
      $('#counter').text(`Mines: ${board.bombGuesses}/${board.bombAmount}`);
    },
    getAdjacent: function () {
      var self = this;
      return board.tiles.filter(function (tile) {
        return ((tile.column === self.column - 1 || tile.column === self.column + 1) && tile.row === self.row) || (tile.column === self.column && (tile.row === self.row + 1 || tile.row === self.row - 1));
      });
    },

    flow: function (changeColor) {
      var self = this;
      this.color = changeColor;
      $(this).css('background-color', this.color);

      var groupedArray = this.getAdjacent().filter(function (adjTile) {
        return self.color === adjTile.color && !adjTile.activated;
      });

      while (groupedArray.length > 0) {
        var groupTile = groupedArray[0];
        groupTile.getAdjacent().filter(function (adjTile) {
          return groupTile.color === adjTile.color && !adjTile.activated;
        }).forEach(function (adjTile) {
          groupedArray.push(adjTile);
          adjTile.activated = true;
        });
        game.currentLevel.board.flowTiles.push(groupTile);
        groupTile.activated = true;
        groupedArray.shift();
      }
    },
    turnColorFlow: function (i) {
      var self = this;
      this.color = game.colors[Math.floor(Math.random() * game.colors.length)];

      var adjTiles = this.getAdjacent();
      var colors = game.colors.filter(function (color) {
        return color !== self.color;
      });

      while (colors.length > 0) {
        var sameColor = adjTiles.filter(function (adjTile) {
          return adjTile.color === self.color;
        });
        if (sameColor.length > 0 && Math.round(Math.random() - .3) <= 0) {
          tile.color = colors[Math.floor(Math.random() * colors.length)];
          colors = colors.filter(function (color) {
            return color !== self.color;
          });
        } else {
          colors = [];
        }
      }

      setTimeout(function () {
        $(self).css('background-color', self.color);
        $(self).removeClass(`marked active active-${self.value}`).addClass('color-flow');
        $(self).text('');
      }, 5 * i);

      this.activated = false;

      this.marked = false;



      $(this).unbind('click contextmenu');
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
    if (!board.marking) {
      // if it is the first tile clicked
      if (!board.valuesAssigned) {
        // generate bombs
        board.generateBombs(tile);
        // otherwise
      } else if (!tile.activated && !tile.marked) {
        // activate tiles
        tile.activate();
      }
    } else {
      tile.toggleMarked();
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
    flowTiles: [],
    flow: false,
    marking: false,

    toggleMarking: function () {
      this.marking = !this.marking;
      $('#mark-flag').toggleClass('marking');
    },

    // define board methods
    handleLoss: function () {
      game.currentLevel.timer.pause;
      alert('You Lose');
      game.generateLevelChoice();
    },

    // used for development
    triggerWin() {
      this.tiles.forEach(function (tile) {
        if (!tile.activated && tile.value !== '') {
          $(tile).click();
        }
      });
    },
    handleWin: function () {
      if (this.flow) {

        game.currentLevel.timer.pause;
        var winString = 'You Win! '
        if (game.currentLevel.timer.time < game.currentLevel.highScore || !game.currentLevel.highScore) {
          winString += 'New Record! ';
          game.currentLevel.highScore = game.currentLevel.timer.time;
          game.save();
        }
        alert(winString + game.currentLevel.timer.getFormatted());
        game.generateLevelChoice();
      } else {
        game.currentLevel.turnColorFlow();
      }

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
      var surrounding = [];
      this.firstTile = firstTile;
      var randomTiles = this.tiles;

      surrounding = firstTile.getSurrounding();
      surrounding.push(firstTile);

      surrounding.forEach(function (surroundingTile) {
        randomTiles = randomTiles.filter(function (tile) {
          return !(tile.row === surroundingTile.row && tile.column === surroundingTile.column);
        });
      })

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
      this.activatedTiles = 0;
      this.bombGuesses = 0;
      this.tiles = [];
      this.valuesAssigned = false;
      game.currentLevel.timer.pause();
      game.currentLevel.timer.reset();
    },

    // function to size / resize the game board
    size: function (firstTime) {
      // get vph and vpw
      var vpw = $(window).innerWidth();
      var vph = $(window).innerHeight();
      var cols = this.columnAmount;
      if (firstTime) {
        if (vpw / this.columnAmount < vph / this.rowAmount) {
          this.columnAmount = this.rowAmount;
          this.rowAmount = cols;

        }
        this.generateTiles();
      }

      // get size of each tile
      var size = (vpw / this.columnAmount) > (vph / this.rowAmount) ? ((vph / 10) * 8) / this.rowAmount : ((vpw / 10) * 8) / this.columnAmount;

      //set size of board
      $(this).width((size + 2) * this.columnAmount).height((size + 2) * this.rowAmount);


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
      setTimeout(function () {
        $(board).slideDown();
      }, 100);
      $('#counter').text(`Mines: 0/${this.bombAmount}`);

    },


  }



  board.__proto__ = $board;


  return board;
}



function Level(index, rows, cols, bombs) {
  this.rows = rows;
  this.columns = cols;
  this.bombs = bombs;
  this.board = boardFactory(rows, cols, bombs);
  this.highScore = 0;
  this.timer = new Timer();
  this.index = index;
  this.playing = false;


  this.renderLevel = function () {
    var self = this;
    $('.levels').slideUp('slow', function () {
      $('.sub-head').text('Level: ' + (self.index + 1));
      $(self.board).hide();
      $('.container').append(self.board);
      $('#timer').text('0:00').show();
      self.board.size(true);
    });
    board = this.board;
    $('.game-controls').slideDown('fast');
  }

  this.turnColorFlow = function () {

    this.board.flow = true;
    // turn all tiles colors
    var self = this;
    this.board.flowTiles = [];

    this.board.tiles.forEach(function (tile, i) {
      tile.turnColorFlow(i);
    });


    var firstTile = self.board.getTile(0, 0);
    var firstColor = firstTile.color;
    self.board.flowTiles.push(firstTile);
    firstTile.activated = true;
    firstTile.flow(firstColor);



    var colorChoices = $('.color-choice');

    colors = game.colors.filter(function (color) {
      return color !== firstColor;
    });


    colorChoices.each(function (i, colorChoice) {
      $(colorChoice).unbind('click');

      $(colorChoice).css('background-color', colors[i]);
      $(colorChoice).click(function () {

        var changeColor = $(this).css('background-color');
        var lastColor = board.getTile(0, 0).color;

        board.flowTiles.forEach(function (tile) {
          tile.flow(changeColor);

        });
        $(this).css('background-color', lastColor);
        if (board.flowTiles.length === self.board.tiles.length) {
          board.handleWin();
        }

      });
      $(colorChoice).fadeIn('fast');
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
    window.clearInterval(this.interval);
  };
  this.reset = function () {
    this.pause();
    this.time = 0;
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
    new Level(0, 9, 9, 15),
    new Level(1, 10, 15, 25),
    new Level(2, 11, 15, 35),
    new Level(3, 12, 15, 40),
    new Level(4, 15, 17, 45),
    new Level(5, 18, 20, 55)
  ],
  colors: ['rgb(241, 103, 72)', 'rgb(140, 198, 63)', 'rgb(0, 169, 157)', 'rgb(249, 161, 56)', 'rgb(49, 212, 224)', 'rgb(251, 209, 59)'],
  playerName: '',

  currentLevel: 0,

  generateLevelChoice: function () {
    var $levels = $('.levels');
    var $levelHolder;
    var $levelContainer;
    var $level;
    var $score;
    var self = this;
    var colorIndex = 0;
    var $customLevelControls = $('.custom-level-container');
    $('.game-controls').hide();



    $('.color-choice').hide();

    $levels.children().remove();
    if (this.currentLevel) {
      this.currentLevel.timer.reset();
      $(this.currentLevel.board).remove();
      this.currentLevel.board.clear();
      this.currentLevel = 0;
      $('#timer').hide();
    }

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

      $levelContainer.css('background-color', self.colors[colorIndex]);

      if (colorIndex === self.colors.length - 1) {
        colorIndex = 0;
      } else {
        colorIndex++;
      }


      if (level.highScore > 0) {
        var seconds = Math.floor(level.highScore);
        var minutes = Math.floor(seconds / 60);

        $score = $('<p class="score">');

        seconds = seconds % 60;
        if (seconds.toString().length === 1) {
          seconds = '0' + seconds;
        }
        $score.text(minutes + ':' + seconds);
        $levelContainer.append($score);
      }

      $levelHolder.append($levelContainer);

      $levels.append($levelHolder);



    });
    $levels.append($customLevelControls);
    $levels.slideDown('fast');

  },
  clearHighScores: function () {
    this.levels.forEach(function (level) {
      level.highScore = 0;
    });
    this.save();
  },

  save: function () {
    var saveLevels = this.levels.map(function (level) {
      return {
        index: level.index,
        highScore: level.highScore
      };
    });
    localStorage.setItem('levels', JSON.stringify(saveLevels));
  },

  loadSave: function () {
    var savedLevels = JSON.parse(localStorage.getItem('levels'));
    if (savedLevels) {
      var self = this;
      savedLevels.forEach(function (level) {
        self.levels[level.index].highScore = level.highScore;
      });
    }

  },

  size: function () {
    if (this.currentLevel) {
      this.currentLevel.board.size();
    }
  }


}

$(function () {

  game.loadSave();
  game.generateLevelChoice();

  $(window).resize(function () {
    game.size();
  });
  $('#levels').click(function () {
    game.generateLevelChoice();
  });
  $('#pause').click(function () {
    game.currentLevel.timer.pause();
  });
  $('#reload').click(function () {
    game.currentLevel.board.clear();
    game.currentLevel.renderLevel();
  });
  $('#settings').click(function () {
    game.currentLevel.turnColorFlow();
  });
  $('#mark-flag').click(function () {
    board.toggleMarking();
  })

});