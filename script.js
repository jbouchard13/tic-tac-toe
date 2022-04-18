// create a module for the gameboard
const GameBoard = (() => {
  // GameBoard will handle creating, and updating the display
  // will need to take info from the player and controller
  let tiles = [];
  for (let i = 1; i <= 9; i++) {
    tiles.push({
      color: "#06bee1",
      class: "box",
      id: i,
    });
  }
  // handles removing animations from tiles, takes element, animation, and time in ms
  const removeTileAnimation = (element, animation, time) => {
    setTimeout(() => {
      element.classList.remove(animation);
    }, time);
  };

  // create the tiles and append them to the page
  const createBoard = () => {
    const boardContainer = document.querySelector(".board-container");
    tiles.forEach((tile) => {
      const tileEl = document.createElement("div");

      // add box styling, unique id, color, and data-id to handle gameplay
      tileEl.classList.add(tile.class);
      tileEl.setAttribute("id", tile.id);
      tileEl.dataset.boxNumber = tile.id;
      tileEl.dataset.color = tile.color.name;

      // add click even that will fire off the animation to the tiles
      tileEl.addEventListener("click", (e) => {
        // handle animation on box tiles
        tileEl.classList.add("wiggle-box");

        // remove animation once it finished firing
        removeTileAnimation(tileEl, "wiggle-box", 350);
      });

      boardContainer.append(tileEl);
    });
  };
  // clear the board
  const clearBoard = () => {
    // reset the color of each tile
    tiles.forEach((tile) => {
      tile.style.backgroundColor = "black";
    });
  };
  return { createBoard };
})();

// create a module for game controls
const Controller = (() => {
  const winConditions = [
    // array of combinations to win
    // rows
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    // columns
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    // diagonal
    [1, 5, 9],
    [3, 5, 7],
  ];

  let turn = "";

  // handles checking each individual win condition and returns a boolean
  const checkOneCondition = (playerTiles, oneWinCondition) => {
    return oneWinCondition.every((number) => playerTiles.includes(number));
  };

  // cycles through each win condition to determine if a player has won
  // runs at the end of each turn
  const checkWin = (playerTiles) => {
    // default the result to no win
    let result = "no win";

    // check each win condition
    winConditions.forEach((win) => {
      let check = checkOneCondition(playerTiles, win);
      if (check === true) {
        result = "win";
        return;
      }
    });
    return result;
  };

  return { checkWin };
})();

// create a factory for player objects
const Player = (name, color) => {
  // object to hold player details and which tiles they chose
  const details = {
    name: name,
    color: color,
    tiles: [],
  };

  // add a tile to the player's tile array
  const addTile = (tile) => {
    details.tiles.push(tile);
  };

  return { details, addTile };
};

GameBoard.createBoard();

const newPlayer = Player("asdf", "red");

newPlayer.addTile();
console.log(newPlayer.details.tiles);
console.log(Controller.checkWin([3, 5, 7]));
