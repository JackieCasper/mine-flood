///////////////////////////////////////
//    __             _    _          //
//    \ \  __ _  ___| | _(_) ___     //
//     \ \/ _` |/ __| |/ / |/ _ \    //
//  /\_/ / (_| | (__|   <| |  __/    //
//  \___/ \__,_|\___|_|\_\_|\___|    //
//                                   //
//    ___                            //
//   / __\__ _ ___ _ __   ___ _ __   //
//  / /  / _` / __| '_ \ / _ \ '__|  //
// / /__| (_| \__ \ |_) |  __/ |     //
// \____/\__,_|___/ .__/ \___|_|     //
//                |_|                //
//                                   //
///////////////////////////////////////


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

/*
THINGS TO DO STILL


RULES / DIRECTIONS

MINESWEEPER
Don't click on a mine
Click tiles to reveil what is under them
if you uncover a number, it indicates how many mines are around that tile
an empty space will uncover its neighbors until it reaches tiles that have mines near them
mark mines by right clicking or using the flag button to keep track of where the bombs are
the first tile you uncover will always be an empty space
you win once all the non-mine tiles are uncovered

COLOR FLOOD

fill the board with a single color in the amount of turns given
starting in the upper left corner, change the color of the tiles to match its neighbors
each turn, the matching tiles are added to the play area until the board is flooded


PAUSE SCREEN
pause sign flashing
timer
play button

WIN SCREEN
win message
time
high score
-handle custom
next level
replay level
level choice

LOSE SCREEN
lose message
replay level
level choice

LANDING PAGE
name input
save name to local storage
load name from local storage on play page
if name is already set, welcome message
ability to change name
blurb about game
Mine Flow is a mash-up of two games: minesweeper and color flow. In minesweeper, use tile values to avoid uncovering mines. Then fill the board with a single color in color flood.

Bonus:
make it so levels can only be played in order

*/
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
          return ((row - 1 >= 0 && tile.row === row - 1) || tile.row === row || (row + 1 < board.rowAmount && tile.row === row + 1)) && ((column - 1 >= 0 && tile.column === column - 1) || tile.column === column || (column + 1 < board.columnAmount && tile.column === column + 1)) && !(tile.row === row && tile.column === column);
        });

      },

      // function to activate tile
      activate: function () {
        if (this.marked) {
          this.toggleMarked();
        }
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
        if (!this.activated) {
          // set marked to not marked
          this.marked = !this.marked;
          // add or remove from bomb guesses
          if (this.marked) {
            board.bombGuesses++;
          } else {
            board.bombGuesses--;
          }
          // toggle marked class
          $(this).toggleClass('marked');
          // change counter text
          $('#counter').text(`Mines: ${board.bombGuesses}/${board.bombAmount}`);
        }
      },

      // function to get adjacent tiles -- for color flood
      getAdjacent: function () {
        var self = this;
        // return an array of tiles filtered to only include the tiles directly next to this tile
        return board.tiles.filter(function (tile) {
          return ((tile.column === self.column - 1 || tile.column === self.column + 1) && tile.row === self.row) || (tile.column === self.column && (tile.row === self.row + 1 || tile.row === self.row - 1));
        });
      },

      // function to handle color flood moves
      flood: function (changeColor) {
        // define vars
        var self = this;
        var groupedArray;

        // set tile's color
        this.color = changeColor;
        $(this).addClass('active-flood').css('background-color', this.color);
        $(this).addClass('active-flood').css('border-color', this.color);


        // check surrounding tiles and look for groups of colors
        // get surrounding tiles
        groupedArray = this.getAdjacent().filter(function (adjTile) {
          return self.color === adjTile.color && !adjTile.activated;
        });

        // while there are still tiles in the array
        while (groupedArray.length > 0) {
          // get the first tile
          var groupTile = groupedArray[0];
          // check adjacent tiles for tiles of the same color
          groupTile.getAdjacent().filter(function (adjTile) {
            return groupTile.color === adjTile.color && !adjTile.activated;
          }).forEach(function (adjTile) {
            // add to group array
            groupedArray.push(adjTile);
            // activate tile
            adjTile.activated = true;
          });

          // add all tiles of the same color to the active color flood tiles
          game.currentLevel.board.floodTiles.push(groupTile);
          // make sure its activated
          groupTile.activated = true;
          // take it out of the group array
          groupedArray.shift();
        }
      },

      // function to init tile for color flood
      turnColorFlood: function (i) {
        // define vars
        var self = this;
        var adjTiles = this.getAdjacent();
        var colors;
        var sameColor;

        // set tile to random color
        this.color = game.colors[Math.floor(Math.random() * game.colors.length)];

        // get colors that aren't this tile's color
        colors = game.colors.filter(function (color) {
          return color !== self.color;
        });

        // check for groups of tiles, to make sure there aren't huge sections of the same color
        while (colors.length > 0) {
          // get adjacent tiles with the same color
          sameColor = adjTiles.filter(function (adjTile) {
            return adjTile.color === self.color;
          });

          // if there are tiles next to this tile of the same color, and a bit of randomness to allow for some groups, but not too many
          if (sameColor.length > 0 && Math.round(Math.random() - .3) <= 0) {
            // change to a new color
            tile.color = colors[Math.floor(Math.random() * colors.length)];
            // take out that color from the color array
            colors = colors.filter(function (color) {
              return color !== self.color;
            });
            // if there are no adjacent tiles of the same color
          } else {
            // clear out color array to end loop
            colors = [];
          }
        }

        // set a timeout to change tiles one by one
        setTimeout(function () {
          // change the background color
          $(self).css('background-color', self.color);
          $(self).css('border-color', self.color);

          // remove classes that have to do with mine sweeper
          $(self).removeClass(`marked active active-${self.value}`).addClass('color-flood');
          // remove text
          $(self).text('');
        }, 5 * i);

        // make sure tile isn't activated
        this.activated = false;

        // make sure tile isn't marked
        this.marked = false;

        // take out click events
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
      // if not currently marking
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
        // if currently marking
      } else {
        // mark tile
        tile.toggleMarked();
      }
    })

    // return the created tile
    return tile;
  } // close tile factory


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
      floodTiles: [],
      flood: false,
      marking: false,
      floodTotalTurns: Math.round((rows * columns) / 3),
      floodTurns: 0,

      // function to toggle if player is currently marking a tile
      toggleMarking: function () {
        this.marking = !this.marking;
        $('#mark-flag').toggleClass('marking');
      },

      // handle game loss
      handleLoss: function () {
        // define vars / create elements
        var $overlay = $('.overlay');
        var $lossContent = $('<div class="win-content">');
        var $lossHead = $('<h3>');
        var $lossControls = $('<div class="win-controls">');
        var $levels = $('<div class="win-control" id="win-levels">');
        var $reload = $('<div class="win-control" id="win-reload">');

        // pause timer
        game.currentLevel.timer.pause;

        // head stuff
        $lossHead.text(`You Lose, ${game.playerName}!`);
        $lossContent.append($lossHead);

        // level click handler
        $levels.one('click', function () {
          game.generateLevelChoice();
        });

        // reload click handler
        $reload.one('click', function () {
          // fade out overlay
          $overlay.fadeOut('fast');
          $overlay.children().remove();

          // clear and render board
          game.currentLevel.board.clear();
          game.currentLevel.renderLevel();
        });

        // add to overlay and fade in
        $lossControls.append($levels, $reload);
        $lossContent.append($lossControls);
        $overlay.addClass('transparent').append($lossContent).fadeIn('fast');

      },

      // function used to skip the playing process
      // used for development
      triggerWin() {
        // if its color flood
        if (this.flood) {
          // define fars
          var tilesToAdd = this.tiles;
          var color = this.floodTiles[0].color;
          var self = this;

          // for each flood tile -- getting all of the tiles that aren't in the flood tiles already
          this.floodTiles.forEach(function (floodTile) {
            // take it out of the tiles
            tilesToAdd.filter(function (tile) {
              return tile.column !== floodTile.column || tile.row !== floodTile.row;
            });
          });

          // for each tile to add
          tilesToAdd.forEach(function (tileToAdd) {
            // change the color
            tileToAdd.color = color;
            $(tileToAdd).css('background-color', color).css('border-color', color);
            // set it to activated
            tileToAdd.activated = true;
            // add to the flood tiles
            self.floodTiles.push(tileToAdd);
          });
          // click on any of the color choices
          $('.color-choice').first().click();
        } else {
          if (this.marking) {
            this.toggleMarking();
          }
          // basically click each tile that isn't a bomb
          this.tiles.forEach(function (tile) {
            if (!tile.activated && tile.value !== '') {
              $(tile).click();
            }
          });
        }
      },

      // function to handle a win
      handleWin: function () {
        // if it is color flood
        if (this.flood) {
          // define vars / create elements
          var $overlay = $('.overlay');
          var $winContent = $('<div class="win-content">');

          var $winHead = $('<h3>');
          var $winScore = $('<p class="win-score">');
          var $highScore = $('<p class="win-high-score">');

          var $winControls = $('<div class="win-controls">');
          var $levels = $('<div class="win-control" id="win-levels">');
          var $reload = $('<div class="win-control" id="win-reload">');
          var $nextLevel = $('<div class="win-control" id="win-next-level">');

          var timer = new Timer();

          // pause the game
          game.currentLevel.timer.pause();

          // header stuff
          $winHead.text(`You Win, ${game.playerName}!`);
          $winContent.append($winHead);

          // score stuff
          $winScore.text(game.currentLevel.timer.getFormatted());
          $winContent.append($winScore);

          // click event for levels
          $levels.one('click', function () {
            game.generateLevelChoice();
          });

          // click event for reload
          $reload.one('click', function () {
            // fade out overlay
            $overlay.fadeOut('fast');
            $overlay.children().remove();
            //restart game
            game.currentLevel.board.clear();
            game.currentLevel.renderLevel();
          })

          // append controls
          $winControls.append($levels, $reload);

          // if its not a custom game or the last level
          if (game.currentLevel.index < game.levels.length && game.currentLevel.index !== 'Custom') {
            // set up next level button
            $nextLevel.html('&#x21e8;');
            //add click handler
            $nextLevel.one('click', function () {
              var nextLevel = game.levels[game.currentLevel.index + 1];
              // reset current level
              game.currentLevel.resetLevel();
              // set current level to next level
              game.currentLevel = nextLevel;
              // render it
              nextLevel.renderLevel();
              // fade out overlay
              $overlay.fadeOut('fast');
              $overlay.children().remove();
            });
            // add to controls
            $winControls.append($nextLevel);
          }

          // account for skipped levels
          if (game.currentLevel.skipped) {
            // create win message
            var $winMessage = $('<p class="win-message">');
            $winMessage.text('You skipped a part! No score recorded');
            $winContent.append($winMessage);
          } else {
            // set high score
            game.currentLevel.highScore = game.currentLevel.timer.time;
            // save high score
            game.save();
          }
          // if its not a custom game
          if (game.currentLevel.index !== 'Custom') {
            // if it is a high score
            if ((game.currentLevel.timer.time < game.currentLevel.highScore || !game.currentLevel.highScore) && !game.currentLevel.skipped) {
              // create win message
              var $winMessage = $('<p class="win-message">');
              $winMessage.text('New Record!');
              $winContent.append($winMessage);
            }

            // set high score stuff
            $highScore.text(timer.getFormatted(game.currentLevel.highScore));
            $winContent.append($highScore);
          }

          // append and fade
          $winContent.append($winControls);
          $overlay.addClass('transparent').append($winContent).fadeIn('fast');


        } else {
          // turn into color flood
          game.currentLevel.turnColorFlood();
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
          // start the timer
          game.currentLevel.timer.start();
        }, 100);

      },

      // function to generate bombs
      generateBombs: function (firstTile) {
        // define vars
        var surrounding = [];
        var randomTiles = this.tiles;

        // set board's first tile
        this.firstTile = firstTile;

        // get first tile's surrounding tiles - to make sure the first click is an empty spot
        surrounding = firstTile.getSurrounding();
        // add the first tile to the surrounding ones
        surrounding.push(firstTile);

        // for each surrounding tile
        surrounding.forEach(function (surroundingTile) {
          // take it out of the random tile array
          randomTiles = randomTiles.filter(function (tile) {
            return !(tile.row === surroundingTile.row && tile.column === surroundingTile.column);
          });
        })

        // sort the tiles randomly
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
        // remove tiles from board
        $(this).children().remove();
        // clear activated tiles, bomb guesses, tiles, values assigned, flood turns, flood
        this.activatedTiles = 0;
        this.bombGuesses = 0;
        this.tiles = [];
        this.valuesAssigned = false;
        this.floodTurns = this.floodTotalTurns;
        this.flood = false;

        // reset timer
        game.currentLevel.timer.reset();

        // hide color choices
        $('.color-choice').hide();


      },

      // function to size / resize the game board
      size: function (firstTime) {
        // get vph and vpw
        var vpw = $(window).innerWidth();
        var vph = $(window).innerHeight();
        var cols = this.columnAmount;

        // if it isn't a change of size
        if (firstTime) {
          // orient the board to best fit screen
          if (vpw / this.columnAmount < vph / this.rowAmount) {
            this.columnAmount = this.rowAmount;
            this.rowAmount = cols;
          }

          // generate tiles
          this.generateTiles();
        }

        // get size of each tile
        var size = (vpw / this.columnAmount) > (vph / this.rowAmount) ? ((vph / 10) * 8) / this.rowAmount : ((vpw / 10) * 8) / this.columnAmount;

        //set size of board
        $(this).width(((size + 2.) * this.columnAmount).height((size + 2.) * this.rowAmount)+ 2);


        // set size of tiles
        this.tiles.forEach(function (tile) {
          $(tile).width(size).height(size);
        });
      },

      // function to generate tiles
      generateTiles: function () {
        // for each tile spot
        for (var row = 0; row < this.rowAmount; row++) {
          for (var col = 0; col < this.columnAmount; col++) {
            // create tile
            var tile = tileFactory(row, col);
            // add it to board's tiles
            this.tiles.push(tile);
          }
        }

        // fade in board
        setTimeout(function () {
          $(board).fadeIn('fast');
        }, 100);

        // set mine counter
        $('#counter').text(`Mines: 0/${this.bombAmount}`);

      },
    }


    // set board's proto to jquery element
    board.__proto__ = $board;


    return board;
  } // close board factory


// constructor for Level
function Level(index, rows, cols, bombs) {
  // define level vars
  this.rows = rows;
  this.columns = cols;
  this.bombs = bombs;
  // create board
  this.board = boardFactory(rows, cols, bombs);
  this.highScore = 0;
  this.timer = new Timer();
  this.index = index;
  this.playing = false;
  this.skipped = false;


  // function to render the level
  this.renderLevel = function () {
    var self = this;
    var subheadText = 'Level: '
      // hide the level choices
    $('.levels').fadeOut('fast', function () {
      // change the subhead text to the current level
      if (self.index !== 'Custom') {
        subheadText += (self.index + 1);
      } else {
        subheadText += 'Custom';
      }
      $('.sub-head').text(subheadText);
      // hide the board now so it can fade in later
      $(self.board).hide();
      // append the board to the container
      $('.container').append(self.board);
      // set the timer text
      $('#timer').text('0:00').show();
      // size the board for the first time
      self.board.size(true);
      // show the mark flag
      $('#mark-flag').fadeIn('fast');
    });
    // set the board to the current board
    board = this.board;
    // fade the game controls in
    $('.game-controls').fadeIn('fast');
    $('#levels').show();
    $('#pause').show();
    $('#reload').show();
    $('#skip').show();
  }

  this.resetLevel = function () {
    // reset the timer
    this.timer.reset();
    // remove the board
    $(this.board).remove();
    // clear the board
    this.board.clear();
    // clear the current level
    game.currentLevel = 0;
  }

  // function to turn level to color flood
  this.turnColorFlood = function () {
    var self = this;
    var firstTile = self.board.getTile(0, 0);
    var firstColor;

    var $colorChoices = $('.color-choice');
    var colors;
    var changeColor;
    var lastColor;

    // clear out flood tiles
    this.board.floodTiles = [];
    // set flood equal to true
    this.board.flood = true;
    // for each tile on the board
    this.board.tiles.forEach(function (tile, i) {
      // turn it to color flood
      tile.turnColorFlood(i);
    });
    firstColor = firstTile.color;

    // change counter text
    board.floodTurns = board.floodTotalTurns;
    $('#counter').text(`Turns: ${board.floodTurns}/${board.floodTotalTurns}`);
    // hide the mark flag
    $('#mark-flag').hide();

    // add first tile to flood tiles
    self.board.floodTiles.push(firstTile);
    // activate first tile
    firstTile.activated = true;
    // make sure any tiles next to it that are the same color are also set as active
    firstTile.flood(firstColor);


    // filter colors to not include the first color
    colors = game.colors.filter(function (color) {
      return color !== firstColor;
    });

    // for each of the color choices
    $colorChoices.each(function (i, $colorChoice) {
      // unbind click - to handle having played previous gamess
      $($colorChoice).unbind('click');

      // change the background color to one of the colors that isn't the first color
      $($colorChoice).css('background-color', colors[i]);
      $($colorChoice).css('border-color', colors[i]);


      // add click event
      $($colorChoice).click(function () {
        // decrease flood turns
        board.floodTurns--;
        $('#counter').text(`Turns: ${board.floodTurns}/${board.floodTotalTurns}`);


        // get color of clicked
        changeColor = $(this).css('background-color');
        // get last clicked color
        lastColor = board.getTile(0, 0).color;

        // for each of the tiles active in color flood
        board.floodTiles.forEach(function (tile) {
          // handle the flood
          tile.flood(changeColor);
        });

        // change clicked to the last color
        $(this).css('background-color', lastColor);

        // if all the tiles are active
        if (board.floodTiles.length >= self.board.tiles.length) {
          // handle win
          board.handleWin();
          // if out of turns
        } else if (board.floodTurns === 0) {
          board.handleLoss();
        }
      });
      // fade in the color choices
      $($colorChoice).fadeIn('fast');
    });
  }

  // function to open pause screen
  this.openPauseScreen = function () {
    // define vars / create elements
    var $overlay = $('.overlay');
    var $pauseScreen = $('<div class="pause-screen">');
    var $pauseHead = $('<h1>');
    var $pauseSubHead = $('<h2 class="sub-head">');
    var $pausePause = $('<div class="pause-screen-pause">');
    var $resume = $('<div class="resume">');
    var self = this;

    // pause the game
    this.timer.pause();

    // set text
    $pauseHead.text('MINE FLOOD');
    $pauseSubHead.text($('header>.sub-head').text());

    $pausePause.text('||');

    $resume.text('Resume');

    // add click event listener
    $resume.one('click', function () {
      $overlay.fadeOut('fast').children().remove();
      self.timer.start();
    });

    //append and fade
    $pauseScreen.append($pauseHead, $pauseSubHead, $pausePause, $resume);
    $overlay.removeClass('transparent').append($pauseScreen).fadeIn('fast');
  }

} // close level constructor


// timer constructor - a lot of it used from Tims' lesson
function Timer() {
  // define vars
  this.time = 0;
  this.running = false;
  this.interval;

  // function to start the timer
  this.start = function () {
    // if its not running
    if (!this.running) {
      var self = this;
      // set it to running
      this.running = true;
      // set interval
      this.interval = setInterval(function () {
        // increment the timer
        self.increment();
        // render the timer
        self.render();
      }, 100)
    }
  };

  // function to render the timer
  this.render = function () {
    // set timer text to formatted time
    $('#timer').text(this.getFormatted());
  }

  // function to pause the timer
  this.pause = function () {
    // make it not running
    this.running = false;
    // clear the interval
    window.clearInterval(this.interval);
  };

  // function to reset the timer
  this.reset = function () {
    // pause the timer
    this.pause();
    // set the time to 0
    this.time = 0;
  }

  // function to increment timer
  this.increment = function () {
    // if it is running
    if (this.running) {
      // add timer
      this.time += .1;
    }
  }

  // function to get the formatted timer
  this.getFormatted = function (time) {
    if (!time) {
      time = this.time;
    }
    // get seconds
    var seconds = Math.floor(time);
    // change to minutes
    var minutes = Math.floor(seconds / 60);
    // get remaining seconds
    seconds = seconds % 60;

    // format to include 0 if in single digets
    if (seconds.toString().length === 1) {
      seconds = '0' + seconds;
    }

    // return with :
    return minutes + ':' + seconds;
  }
} // close timer constructor

// define game object
var game = {

  // level options
  levels: [
    new Level(0, 9, 9, 10),
    new Level(1, 10, 11, 17),
    new Level(2, 12, 13, 24),
    new Level(3, 14, 15, 33),
    new Level(4, 16, 16, 40),
    new Level(5, 17, 18, 52),
    new Level(6, 19, 20, 65),
    new Level(7, 21, 21, 76),
    new Level(8, 22, 23, 87),
    new Level(9, 24, 24, 99)
  ],

  // colors
  colors: ['rgb(241, 103, 72)', 'rgb(140, 198, 63)', 'rgb(0, 169, 157)', 'rgb(249, 161, 56)', 'rgb(49, 212, 224)', 'rgb(251, 209, 59)'],

  // player name
  playerName: '',

  currentLevel: 0,

  // function to check the custom game inputs and format them correctly / make sure it is valid
  checkCustomInput: function ($input) {
    // get the value of the input
    var val = Math.round(parseFloat($input.val()));
    // get the minimum of the input
    var min = parseInt($input.attr('min'));
    var max = parseInt($input.attr('max'));

    var maxMines = Math.floor($('#custom-columns').val() * $('#custom-rows').val()) - 9;

    // if the value is less than 0
    if (val < 0) {
      // make it positive
      val = val * -1;
    }

    // if the value is less than the min
    if (val < min) {
      // make it the min
      val = min;
    }

    if (val > max) {
      val = max;
    }


    if ($input.attr('id') === 'custom-mines' && val > maxMines) {
      val = maxMines;
    }

    // set the value
    $input.val(val);
  },

  // function to create a custom level
  createCustomLevel: function (rows, cols, mines) {
    // set the current level to a new level
    this.currentLevel = new Level('Custom', rows, cols, mines);
    // render the level
    this.currentLevel.renderLevel();

  },

  // function to generate level choices
  // also cleans up previous games
  generateLevelChoice: function () {
    // define vars
    var $levels = $('.levels');
    var $levelHolder;
    var $levelContainer;
    var $level;
    var $score;
    var self = this;
    var colorIndex = 0;

    // define custom level vars
    var $customLevelControls = $('.custom-level-container');
    var $customRows = $('#custom-rows');
    var $customColumns = $('#custom-columns');
    var $customMines = $('#custom-mines');
    var $customSubmit = $('#custom-level-submit');

    var customInputs = [$customRows, $customColumns, $customMines];

    // hide the game controls, un-needed menu buttons, overlay and color choices
    $('.game-controls').hide();
    $('.color-choice').hide();
    $('#levels').hide();
    $('#skip').hide();
    $('#pause').hide();
    $('#reload').hide();
    $('.overlay').fadeOut('fast').children().remove();


    // remove all the children
    $levels.children().remove();

    // if there is a current level
    if (this.currentLevel) {
      this.currentLevel.resetLevel();
    }

    // set the sub-head to the player's name
    $('.sub-head').text(self.playerName);

    //levels will be random color from the color array
    // not yellow, text doesn't show up well
    var levelColor = self.colors[Math.floor(Math.random() * (self.colors.length - 1))];

    // for each level
    this.levels.forEach(function (level, i) {
      // create level holder
      $levelHolder = $('<div class="level-holder">');
      // create level container
      $levelContainer = $('<div class="level-container">');

      // create level index
      $level = $('<h4 class="level">');
      $level.text(i + 1);
      $levelContainer.append($level);


      // if there is a high score
      if (level.highScore > 0 || level.index === 0 || self.levels[level.index - 1].highScore) {
        // add event listener for when level is clicked
        $levelContainer.click(function () {
          // set the current level
          self.currentLevel = level;
          // render the current level
          level.renderLevel();
        });


        if (level.highScore > 0) {
          // create score element
          $score = $('<p class="score">');
          var timer = new Timer();
          // set element's text to formatted time
          $score.text(timer.getFormatted(level.highScore));
          // add it to the level container
          $levelContainer.append($score);
        }


      } else {
        $levelContainer.addClass('not-played');
      }


      // set the background color
      $levelContainer.css('background-color', levelColor);

      // add container to holder
      $levelHolder.append($levelContainer);

      // and holder to levels
      $levels.append($levelHolder);
    });

    // add custom level options to the levels
    $levels.append($customLevelControls);

    // for each custom input
    customInputs.forEach(function ($input) {
      // unbind change to account for previous bindings
      $input.unbind('change');
      // on change
      $input.change(function () {

        // check the input
        self.checkCustomInput($input);
      });
    });

    // unbind the click to account for previous bindings
    $customSubmit.unbind('click');
    // on click
    $customSubmit.click(function () {

      // for each input
      customInputs.forEach(function ($input) {
        // check the input value
        self.checkCustomInput($input);
      });


      // create custom level
      self.createCustomLevel($customRows.val(), $customColumns.val(), $customMines.val());
    });

    // fade the levels in
    $levels.fadeIn('fast');

  },

  // function to clear high scores - used for development
  clearHighScores: function () {
    // for each level
    this.levels.forEach(function (level) {
      // set the score to zero
      level.highScore = 0;
    });
    // save the scores
    this.save();
  },

  // function to save the high scores
  save: function () {
    // create an array for each level
    var saveLevels = this.levels.map(function (level) {
      // containing an object with the level index and high score
      return {
        index: level.index,
        highScore: level.highScore
      };
    });

    // set the local storage
    localStorage.setItem('levels', JSON.stringify(saveLevels));
  },

  // function to load the save
  loadSave: function () {
    // get and parse the local storage
    var savedLevels = JSON.parse(localStorage.getItem('levels'));
    var savedPlayer = localStorage.getItem('playerName');
    // if there was anything saved
    if (savedLevels) {
      var self = this;
      // for each saved level
      savedLevels.forEach(function (level) {
        // set the level's high score
        self.levels[level.index].highScore = level.highScore;
      });
    }
    if (savedPlayer) {
      game.playerName = savedPlayer;
    } else {
      window.location.href = 'index.html';
    }
  },

  // function to size the game
  size: function () {
    // if there is a current level
    if (this.currentLevel) {
      // size the board
      this.currentLevel.board.size();
    }
  },

  //function to open help menu
  openHelp: function () {
    // dfine vars / make elements
    var $overlay = $('.overlay');
    var $helpContent = $('<div class="help-content">');
    var $helpH1 = $('<h1>');
    var $helpMine = $('<h2>');
    var $mineImg = $('<img src="img/minesweephelp2.png" class="help-image">');
    var $mineText = $('<p class="help-text">');
    var $helpFlood = $('<h2>');
    var $floodImg = $('<img src="img/colorfloodhelp.gif" class="help-image">');
    var $floodText = $('<p class="help-text">');
    var $helpClose = $('<div class="close-help" id="close-help">');
    var self = this;

    // if there is a level going, pause it
    if (this.currentLevel) {
      this.currentLevel.timer.pause();
    }

    // set text content of stuff
    $helpH1.text('MINE FLOOD');

    $helpMine.text('Mine');
    $mineText.text('Click tiles to reveal what is under them, but don\'t click on a mine! If a number is uncovered, ' +
      'it indicates how many mines are around that tile. Empty spaces mean there are no mines near by, and will uncover its ' +
      'neighboring tiles until it reaches those that have mines near them. Mark tiles by right clicking or using the flag button to ' +
      'keep track of where the mines are. Win by uncovering all tiles other than the mines!');

    $helpFlood.text('Flood');
    $floodText.text('Fill the board with a single color in the given amount of turns. Starting in the upper left corner, change the color ' +
      'of the tiles to match its neighbors by clicking on the matching color box under the board. Each turn, the matching tiles are ' +
      'added to the play area until the board is flooded.');

    // set event listener for close button
    $helpClose.click(function () {
      $overlay.fadeOut('fast').children().remove();
      if (self.currentLevel) {
        self.currentLevel.timer.start();
      }
    })

    // append to help content
    $helpContent.append($helpH1, $helpMine, $mineImg, $mineText, $helpFlood, $floodImg, $floodText, $helpClose);
    // append and fade overlay
    $overlay.removeClass('transparent').append($helpContent).fadeIn('fast');
  }
}

// stuff to do when the document loads
$(function () {

  game.loadSave();
  game.generateLevelChoice();

  $(window).resize(function () {
    game.size();
  });

  // set event listener for levels nav button
  $('#levels').click(function () {
    game.generateLevelChoice();
  });

  // set event listener for pause nav button
  $('#pause').click(function () {
    game.currentLevel.openPauseScreen();
  });

  // set event listener for reload nav button
  $('#reload').click(function () {
    game.currentLevel.board.clear();
    game.currentLevel.renderLevel();
  });

  // set event listener for skip nav button
  $('#skip').click(function () {
    game.currentLevel.skipped = true;
    game.currentLevel.board.triggerWin();
  })

  //  $('#settings').click(function () {
  //    game.currentLevel.turnColorFlood();
  //  });
  $('#mark-flag').click(function () {
    board.toggleMarking();
  });

  $('#help').click(function () {
    game.openHelp();
  })

});
