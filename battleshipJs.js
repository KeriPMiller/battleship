var view ={
  // this method takes a string message and displays it in the
  // message display area
  displayMessage: function(msg) {
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  ships: [{ locations: [0, 0, 0], hits:["", "", ""]},
          { locations: [0, 0, 0], hits:["", "", ""]},
          { locations: [0, 0, 0], hits:["", "", ""]}],

  generateShipLocations: function() {
    var locations;
    for( var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
    }
  },

  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      // Generate a starting location for a horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shiplength));
    } else {
      // Generate a starting location for a vertical ship
      row = Math.floor(Math.random() * (this.boardSize - this.shiplength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shiplength; i++) {
      if (direction === 1) {
        // add ship location for horizontal ship
            newShipLocations.push(row + "" + (col + i));
        } else {
        // add ship location for vertical ship
            newShipLocations.push((row + i) + "" + col);
        }
    }
    return newShipLocations;
  },

  collision: function(locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for (var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
  },

  fire: function(guess){
    for (var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0){
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
          if (this.isSunk(ship)) {
            view.displayMessage("KA-PEW! You sank my Battleship!");
            this.shipsSunk++;
          }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0;  i < this.shipLength; i++){
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  }
};

var controller = {
  guesses: 0,

  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
                                          this.guesses + " guesses");
      }
    }
    function parseGuess(guess) {
      var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

      if (guess === null || guess.length !== 2) {
        alert("Please enter a letter and a number on the board.");
      } else {
        firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
          alert("That guess is not on the board.");
        } else if (row < 0 || row >= model.boardSize ||
                          column < 0 || column >= model.boardSize) {
            alert("That's off the board!");
        } else {
          return row + column;
        }
        return null;
      }
    }
  }
};

function init() {
  // handelers
  var firebutton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;

  model.generateShipLocations();
}

function handleFireButton() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  // resets the form
  guessInput.value = "";
}

function handleKeyPress(e) {
  // handeler to use enter key to trigger
  var firebutton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    // return false so the function stops after clicking firebutton
    return false;
  }
}

window.onload = init;
