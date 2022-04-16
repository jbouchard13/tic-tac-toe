// create a module for the gameboard
const GameBoard = (() => {
  let tiles = [];
  for (let i = 0; i < 9; i++) {
    tiles.push({ color: "#06bee1", class: "box", id: i });
  }
  const createBoard = () => {
    const boardContainer = document.querySelector(".board-container");
    console.log(boardContainer.children);
    tiles.forEach((tile) => {
      const tileEl = document.createElement("div");
      tileEl.classList.add(tile.class);
      tileEl.setAttribute("id", tile.id);
      tileEl.dataset.boxNumber = tile.id;
      tileEl.style.backgroundColor = tile.color;
      tileEl.addEventListener("click", (e) => {
        // handle animation on box tiles
        tileEl.classList.add("wiggle-box");

        setTimeout(() => {
          // remove animation once it finished firing
          tileEl.classList.remove("wiggle-box");
        }, 350);
      });
      boardContainer.append(tileEl);
    });
  };
  const clearBoard = () => {
    // reset the color of each tile
    tiles.forEach((tile) => {
      tile.style.backgroundColor = "black";
    });
  };
  const clearBtn = document.querySelector(".clear");
  clearBtn.addEventListener("click", clearBoard);
  return { createBoard };
})();

// create a module for game controls
const Controller = (() => {})();

// create a factory for player objects
const Player = (name) => {
  // display player details
  // name
  // score
  // color
};

GameBoard.createBoard();
