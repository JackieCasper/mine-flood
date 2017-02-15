# Project-One -- Minesweeper
First project for WDI - Create a game

## Rules

The objective in Minesweeper is to find and mark all the mines hidden under the grey squares, in the shortest time possible. This is done by clicking on the squares to open them. Each square will have one of the following:
- A mine, and if you click on it you'll lose the game.
- A number, which tells you how many of its adjacent squares have mines in them.
- Nothing. In this case you know that none of the adjacent squares have mines, and they will be automatically opened as well.

\- Rules taken from: https://cardgames.io/minesweeper/
I will develop my own wording for the project

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



