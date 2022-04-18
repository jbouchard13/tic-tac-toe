// create a module for the gameboard
const GameBoard = (() => {
  // set default board color to a variable
  const defaultColor = "#06bee1";
  // set variable for start button, setup, current turn, and board containers
  const boardContainerEl = document.querySelector(".board-container");
  const startBtnEl = document.querySelector(".start");
  const setUpEl = document.querySelector(".setup-container");
  const currentTurnEl = document.querySelector(".current-turn");
  const winnerEl = document.querySelector(".winner");
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

  const hideElement = (element) => {
    element.style.display = "none";
  };

  const showElement = (element, displayType) => {
    element.style.display = displayType;
  };
  // hide the board on page load
  hideElement(boardContainerEl);
  hideElement(currentTurnEl);
  // create new players
  startBtnEl.addEventListener("click", () => {
    // create new players from the input form
    const playerOne = Player(
      document.querySelector("#playerOne").value,
      document.querySelector("#playerOneColor").value
    );

    const playerTwo = Player(
      document.querySelector("#playerTwo").value,
      document.querySelector("#playerTwoColor").value
    );

    // push those players to the Controller to handle gameplay
    Controller.playersArr.push(playerOne, playerTwo);

    // close the set up window and display the gameboard
    hideElement(setUpEl);
    showElement(boardContainerEl, "grid");
    showElement(currentTurnEl, "block");

    // set the turn to the first player
    Controller.setTurn(Controller.playersArr[0].details.name);
    updateTurn(Controller.playersArr[0].details.name);
  });

  // handles removing animations from tiles, takes element, animation, and time in ms
  const removeTileAnimation = (element, animation, time) => {
    setTimeout(() => {
      element.classList.remove(animation);
    }, time);
  };

  // update tile color to the current player's chosen color
  const updateTileColor = (element, color) => {
    element.style.backgroundColor = color;
    element.dataset.played = "yes";
  };

  // update displayed turn
  const updateTurn = (name) => {
    currentTurnEl.textContent = `${name}'s turn`;
  };

  // display winner
  const displayWinner = (name) => {
    winnerEl.textContent = `${name} has won!`;
    hideElement(currentTurnEl);
  };

  // check for draw
  const checkDraw = (tiles, playerOne, playerTwo) => {
    if (
      tiles === 9 &&
      playerOne.details.win === false &&
      playerTwo.details.win === false
    ) {
      return true;
    } else {
      return false;
    }
  };

  // display draw
  const displayDraw = () => {
    Controller.draw = true;
    currentTurnEl.textContent = "The game ended in a draw!";
  };
  // reset game

  // create the tiles and append them to the page
  const createBoard = () => {
    const boardContainer = document.querySelector(".board-container");
    tiles.forEach((tile) => {
      const tileEl = document.createElement("div");
      // add box styling, unique id, color, and data-id to handle gameplay
      tileEl.classList.add(tile.class);
      tileEl.style.backgroundColor = defaultColor;
      tileEl.setAttribute("id", tile.id);
      tileEl.dataset.played = "no";

      // add click even that will fire off the animation to the tiles
      tileEl.addEventListener("click", (e) => {
        const playerOne = Controller.playersArr[0];
        const playerTwo = Controller.playersArr[1];

        // check if a player has won, or if there's a draw if so, don't let any tiles change
        if (
          playerOne.details.win === true ||
          playerTwo.details.win === true ||
          Controller.draw === true
        ) {
          return;
        }
        // handle animation on box tiles
        tileEl.classList.add("wiggle-box");

        // remove animation once it finished firing
        removeTileAnimation(tileEl, "wiggle-box", 350);

        // update the tile color with the correct color for player
        // check if the tile has been played yet
        if (tileEl.dataset.played === "yes") {
          return;
        }

        // if player one's turn, push the tile to their array
        else if (Controller.currentTurn === playerOne.details.name) {
          // set the tile to that player's color, and change turn to the other player
          updateTileColor(tileEl, playerOne.details.color);
          // check if a draw has occurred
          Controller.turns++;
          if (checkDraw(Controller.turns, playerOne, playerTwo) === true) {
            displayDraw();
            return;
          }
          Controller.setTurn(playerTwo.details.name);
          // update the displayed turn
          updateTurn(playerTwo.details.name);
          // return the tile ID to the controller so it can be added to the player's tile array
          playerOne.addTile(parseInt(tileEl.id));

          // check the player's tiles against the win conditions
          if (Controller.checkWin(playerOne.details.tiles) === true) {
            // update the player's win status
            playerOne.updateWin();
            // display winner
            displayWinner(playerOne.details.name);
            // end game
          }
        }

        // if player two turn, push the tile to their array
        else if (Controller.currentTurn === playerTwo.details.name) {
          // set the tile to that player's color, and change turn to the other player
          updateTileColor(tileEl, playerTwo.details.color);
          // check if a draw has occurred
          Controller.turns++;
          if (checkDraw(Controller.turns, playerOne, playerTwo) === true) {
            displayDraw();
            return;
          }
          Controller.setTurn(playerOne.details.name);

          // update the displayed turn
          updateTurn(playerOne.details.name);
          // return the tile ID to the controller so it can be added to the player's tile array
          playerTwo.addTile(parseInt(tileEl.id));

          // check the player's tiles against the win conditions
          if (Controller.checkWin(playerTwo.details.tiles) === true) {
            // update the player's win status
            playerTwo.updateWin();
            // display winner
            displayWinner(playerTwo.details.name);
            // end game
          }
        }
      });

      boardContainer.append(tileEl);
    });
  };

  // update the board when clicked
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
  // create an array to contain players
  const playersArr = [];
  // create variables to contain the amount of turns taken to handle draw scenarios
  let turns = 0;
  let draw = false;

  // array of combinations to win
  const winConditions = [
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

  let currentTurn = "";
  // control which player is choosing
  const setTurn = (playerName) => {
    Controller.currentTurn = playerName;
  };

  // handles checking each individual win condition and returns a boolean
  const checkOneCondition = (playerTiles, oneWinCondition) => {
    return oneWinCondition.every((number) => playerTiles.includes(number));
  };

  // cycles through each win condition to determine if a player has won
  // runs at the end of each turn
  const checkWin = (playerTiles) => {
    // default the result to no win
    let result = false;

    // check each win condition
    winConditions.forEach((win) => {
      let check = checkOneCondition(playerTiles, win);
      if (check === true) {
        result = true;
        return;
      }
    });
    return result;
  };

  return { checkWin, setTurn, currentTurn, playersArr, turns, draw };
})();

// create a factory for player objects
const Player = (name, color) => {
  // object to hold player details and which tiles they chose
  const details = {
    name: name,
    color: color,
    tiles: [],
    win: false,
  };

  const updateWin = () => {
    details.win = true;
  };

  // add a tile to the player's tile array
  const addTile = (tile) => {
    details.tiles.push(tile);
  };

  return { details, addTile, updateWin };
};

GameBoard.createBoard();
