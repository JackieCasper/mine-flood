# Project-One -- Mine Flood
First project for WDI - Create a game

## Rules

### Mine
Click tiles to reveal what is under them, but don't click on a mine! If a number is uncovered, it indicates how many mines are around that tile. Empty spaces mean there are no mines near by, and will uncover its neighboring tiles until it reaches those that have mines near them. Mark tiles by right clicking or using the flag button to keep track of where the mines are. Win by uncovering all tiles other than the mines!

### Flood
Fill the board with a single color in the given amount of turns. Starting in the upper left corner, change the color of the tiles to match its neighbors by clicking on the matching color box under the board. Each turn, the matching tiles are added to the play area until the board is flooded.

## Obsticles

- Generating the board. I want to be able to have the generator flexible for board size as well as amount of bombs. Also ideally be able to ensure the first clicked space is not a bomb.

- Making it mobile friendly. Especially figuring out a way to guess bombs without a right click option.

- Finding a good balance for the level progression so that there is a noticible difficulty difference for each level, but not too much.

## Technology

- HTML: Markup for page structure.
- CSS: Styling. Using flexbox and media queries for responsive design.
- JavaScript: Working with arrays, objects, data.
- JQuery: DOM minipulation

## Wireframes

**Landing Page:**
![](https://git.generalassemb.ly/raw/JackieCasper/Project-One/master/img/wireframes/landing.jpg)

**Level Choice:**
![](https://git.generalassemb.ly/raw/JackieCasper/Project-One/master/img/wireframes/level-choice.jpg)

**Level:**
![](https://git.generalassemb.ly/raw/JackieCasper/Project-One/master/img/wireframes/level.jpg)



