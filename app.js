// variable to get the card
let card = document.getElementsByClassName("card");

//variable to put the cards in an array
let cardDeck = [...card]

// deck of all cards in game
const deck = document.getElementById("cardDeck");

//variable to the number of moves, initialised to 0
let moves = 0;

//variable to show the moves counter
let count = document.querySelector(".moves");

//variable to show the time taken
let timer = document.querySelector(".timer");

// variable to set the timer
let interval;

// variable restart to listen for event
let restart = document.querySelector(".restart");

// variable to toggle if this is the first click for the game
let firstClick = true;

// variable to toggle the replay status
let replay = false;

// variable for the star icons to be stored in an array upon query
let starsArray = document.querySelectorAll(".fa-star");

// variable for the matched cards
let matchedCard = document.getElementsByClassName("match");

// variable for the modal
let modal = document.getElementById("modal")

// variable to store the array of opened cards
let openedCards = [];

// variable to store the number of stars the player gets
let rating = starsArray.length;

// start game when the HTML loads
document.body.onload = startGame();

// function to start a new game
function startGame() {
    // shuffle the deck
    cardDeck = shuffle(cardDeck);

    // remove all classes from each card
    for (var i = 0; i < cardDeck.length; i++) {
        Array.prototype.forEach.call(cardDeck, function(item) {
            deck.appendChild(item);
        });
        cardDeck[i].classList.remove("show", "open", "match", "disabled");
    }

    // reset moves to 0
    moves = 0;

    // add event handler when player click on the restart icon
    restart.addEventListener("click", restartGame);

    // reset counters that show number of moves
    count.innerHTML = moves;

    // reset user's rating
    for (var i = 0; i < starsArray.length; i++) {
        starsArray[i].style.color = "#FFD700";
        starsArray[i].style.visibility = "visible";
    }
    // reset timer
    second = 0;
    minute = 0;
    hour = 0;

    // a boolean to start timer only at the first click
    firstClick = true;
    openedCards = []
    timer.innerHTML = "0hr 0mins 0secs";
    clearInterval(interval);
}

// add event handler to each card on the deck
for (var i = 0; i < cardDeck.length; i++) {
    card = cardDeck[i];
    card.addEventListener("click", showCard);
    card.addEventListener("click", openCard);
    card.addEventListener("click", completed);
};

// function to display the cards
function showCard() {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// function to restart the game when player clicks on the restart icon
function restartGame() {
    replay = true;
    startGame();
}

// function to check if the 2 opened cards matched
function openCard() {
    openedCards.push(this);
    let numberClicks = openedCards.length;

    // start timer only when the player started a new game or only when the player restarted the game
    if (numberClicks === 1 && firstClick) {
        if (replay) {
            startTimer();
            firstClick = false;
            replay = false;
        } else {
            startTimer();
            firstClick = false;
            replay = false;
        }
    }
    // Check if the 2 opened cards matched
    if (numberClicks === 2) {
        moveCounter();
        if (openedCards[0].type === openedCards[1].type) {
            matched();
        } else {
            unmatched();
        }
    }
};

// function to disable the cards if they match
function matched() {
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open");
    openedCards[1].classList.remove("show", "open");
    openedCards = [];
}

// function to revert back to the closed state if they dont match
function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function() {
        openedCards[0].classList.remove("show", "open", "unmatched");
        openedCards[1].classList.remove("show", "open", "unmatched");
        enable();
        openedCards = [];
    }, 500);
}

// function to disable the card
function disable() {
    Array.prototype.filter.call(cardDeck, function(item) {
        item.classList.add("disabled");
    });
}

// function to enable back the cards
function enable() {
    Array.prototype.filter.call(cardDeck, function(card) {
        card.classList.remove("disabled");
        for (var i = 0; i < matchedCard.length; i++) {
            matchedCard[i].classList.add("disabled");
        }
    });
}

// function to increment the number of times the player click (counter) to determine the star rating
function moveCounter() {
    moves++;
    count.innerHTML = moves;

    // setting the star ratings based on the number of moves atempted
    if (moves > 12 && moves <= 20) {
        for (n = 0; n < 3; n++) {
            if (n > 1) {
                starsArray[n].style.visibility = "collapse";
                rating = 2;
            }
        }
    } else if (moves > 20) {
        for (n = 0; n < 3; n++) {
            if (n > 0) {
                starsArray[n].style.visibility = "collapse";
                rating = 1;
            }
        }
    }
}

// function to start the timer for the game
function startTimer() {
    interval = setInterval(function() {
        timer.innerHTML = hour + "hr " + minute + "mins " + second + "secs";
        second++;

        if (second == 60) {
            minute++;
            second = 0;
        }
        if (minute == 60) {
            hour++;
            minute = 0;
        }
    }, 1000);
}

// function when the user completes matching all 16 cards
function completed() {
    if (matchedCard.length == 16) {
        clearInterval(interval);

        // display the modal
        modal.style.display = "block";

        // displaying the number of moves, ratings and time taken to complete the game on the modal
        document.getElementById("attemptedMoves").innerHTML = moves;
        document.getElementById("rating").innerHTML = rating;
        document.getElementById("timeTaken").innerHTML = timer.innerHTML;
    };
}

// function for player to start new game upon clicking the button on modal
function newGame() {
    modal.classList.remove("show");
    modal.style.display = "none";
    startGame();
}

// shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
