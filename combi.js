// Images from http://byronknoll.blogspot.com/2011/03/vector-playing-cards.html
// https://commons.wikimedia.org/wiki/Category:Playing_cards_set_by_Byron_Knoll

class Card {

  constructor(suit, value) {

    this.suit = suit; //"Spades", "Hearts"...
    this.value = value; //"A", "2", "3"... "J", "Q", "K" as string

    this.points = this.generatePoints(); // Set the points based on face value
    this.shortName = this.generateShortName(); // Get e.g. "5H" for 5 of Hearts

    this.imagePath = this.generateImagePath(); //get image file location
  }

  get isAce() {

    return this.value==="A";

  }

  /*  Check for non-Ace face card for Blackjack game */
  get isFaceCard() {
    return ( this.value==="K" || this.value ==="Q" || this.value === "J" ) ;
  }

  // Gives us the Blackjack points for that card
  generatePoints() {

    const val = this.value;

    // Check the card number (value) &
    // get the points
    switch(val) {

      case "A":   // Ace is technically 10, with other card gaining 1,
                  // but easier to just change the Ace's value.
                  // Ace can become 1 if the score goes over 21 to help
                  // the player - this "soft" logic should go in the
                  // game logic.
        return 11;
      case "K": // Face cards are all set to 10
      case "Q":
      case "J":
        return 10;
      default:
        return parseInt(val); // Number cards just get the points of their number

    }

  }

  generateShortName() {

    const cardSuit = this.suit;
    const val = this.value;

    // This builds the unicode suit symbol
    // as the number ( a little picture of a
    // heart, club etc)
    let shortName = "266";

    switch(cardSuit) {

      case "Spades":
        shortName += "0";
        break;
      case "Hearts":
        shortName += "5";
        break;
      case "Diamonds":
        shortName += "6";
        break;
      case "Clubs":
        shortName += "3";
        break;

    }

    // This takes the unicode number and converts it to a
    // printable string.
    // This is kindly STOLEN from stackoverflow
    let suitChar = String.fromCharCode(parseInt(shortName, 16));

    return val + suitChar; //val is 2, J etc. and suit char is Heart shape etc.

  }

  generateImagePath() {
    let imagePath = `./cardImages/`;

    let tagString = "";

    switch(this.value) {
      case "J":
        imagePath+= "jack";
        tagString = "2";
        break;
      case "Q":
        imagePath+= "queen";
        tagString = "2";
        break;
      case "K":
        imagePath+= "king";
        tagString = "2";
        break;
      case "A":
        imagePath+= "ace";

        break;
      default:
        imagePath+= this.value;
    }

    imagePath += "_of_";

    switch(this.suit) {
      case "Spades":
        imagePath += "spades";
        break;
      case "Hearts":
        imagePath += "hearts";
        break;
      case "Diamonds":
        imagePath += "diamonds";
        break;
      case "Clubs":
        imagePath += "clubs";
        break;
    }

    imagePath += tagString + ".png";

    return imagePath;
  }

  /*  Console display only */
  display() {

    console.log(`${this.shortName}`);

  }

  showCardImage() {

    let cardImage = this.imagePath;
    let cardDiv = document.getElementById("card");
    let currentCardHTML = cardDiv.innerHTML;

    cardDiv.innerHTML += `<img src=${this.imagePath} alt=${this.shortName} />`

  }

}

////////////////////////////////////////////////////////////////////////////////

class Deck {

  constructor(numDecks) {

      this.deck = this.makeMultiDeck(numDecks);
      this.currentCard = 0;
      this.decksCount = numDecks;

  }

  // Make a single deck
  makeDeck() {

    // Using these arrays to loop through the suits
    // and face cards
    const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
    const faceCards = ["J", "Q", "K"];


    let newDeck = []; // New array to hold all the cards

    // Loop through each suit and make
    // that set of cards.
    // Then add the next suit's set, etc.
    // This is a "for each" loop
    for(const suit of suits) {

      let ace = new Card(suit, "A");  //Special - add the ace at the start
      newDeck.push( ace );

      for(let i = 2; i < 11; i++) {   // Loop to make & add number cards

        let numCard = new Card(suit, i);
        newDeck.push( numCard );

      }

      for(const faceCard of faceCards) {  // "for each" loop to make face cards

        let nextFaceCard = new Card(suit, faceCard);
        newDeck.push( nextFaceCard );

      }

    }

    return newDeck;

  }

  // Make any number of decks, combined. Eight is standard for Blackjack.
  // Easier to shuffle, etc later.
  makeMultiDeck(numOfDecks) {

    let multiDeck = [];

    for(let currentDeck = 0; currentDeck < numOfDecks; currentDeck++) {

      let deckToAdd = this.makeDeck();

      for(const card of deckToAdd) {
        multiDeck.push( card );
      }

    }

    return multiDeck;

  }

  /*  Console display only */
  display() {

    let output = "";

    for(let i = 0; i < this.deck.length; i++) {

      if(i !==0) {

        if(i % 13 === 0) {  //New line for every 13 cards
          output += "\n";
        }

        if(i % 52 === 0) {  // Extra new line for every 52 cards
          output += "\n";
        }

      }

      // Add the current card icon
      output += this.deck[i].icon + " ";

    }

    console.log(output);

  }

  shuffle() {

    for(let i = 0; i < this.deck.length; i++) {

      // Get a random number between remaining cards & the total deck length,
      // and swap the current card with that one
      // This is a better random method because each card is only swapped once
      let randomSwapPlace = i + parseInt(Math.random() * (this.deck.length - i));

      // Swap the places
      let temp = this.deck[i];
      this.deck[i] = this.deck[randomSwapPlace];
      this.deck[randomSwapPlace] = temp;

    }

  }

  getNextCard() {

    // If we reached the end, get a new deck order first
    if( this.currentCard >= (52 * this.decksCount)  ) {

      console.log("Reached last card. Shuffling new deck.");
      this.shuffle();
      this.currentCard = 0;

    }

    // Get the next card & move the current card location
    // marker forward
    let nextCard = this.deck[this.currentCard];
    this.currentCard++;

    return nextCard;

  }

}




///////////////////////////////////////////////////////////////////////////////
/////////Webpage demo code-----------------------------------------------------

/*  Set up gamedeck with as many decks as needed
    -NOTE: this only needs to be done once, as it will automatically
    re-shuffle after it reaches the last card
*/
let gameDeck = new Deck(8);
gameDeck.shuffle();

let cardDisplayDelay = 700; //for animation, don't show card immediately

let playerPoints = 0;
let numFullPointsAces = 0;  //how many Aces we have, that are worth 11 points
let playerHands = [];  //will hold an array of player hands
let numPlayerHands = 0;

let dealersHand = [];
let dealerFullPointsAces = 0;
let dealerPoints = 0;
let hiddenCardShown = false;  //hide the dealer's first card



let gameOver = false;
let playerWon = false;  //if the player beat the dealer
let push = false; //if there was a draw (tie)

function dealCards() {
  /*  Store player cards in nested array to allow
      multiple hands in "split" scenarios
  */
  playerFirstHand = [];

  /*  Deal cards in alternating order - dealer card, then player card */
  let dealerCard1 = gameDeck.getNextCard();
  let playerCard1 = gameDeck.getNextCard();
  if(playerCard1.isAce) { //need to track aces to change points if over 21
    numFullPointsAces++;
  }

  let dealerCard2 = gameDeck.getNextCard();
  let playerCard2 = gameDeck.getNextCard();
  if(playerCard2.isAce) {
      numFullPointsAces++;
    }

  /* Add cards to dealer deck and player single hand deck */
  dealersHand.push( dealerCard1 );
  dealersHand.push( dealerCard2 );

  playerFirstHand.push( playerCard1 );
  playerFirstHand.push( playerCard2 );

/*  Add player's first hand to array as another array  i.e.
  [
    [card1, card2]
  ];
*/
  playerHands.push( playerFirstHand );
}

/*  Show the players dealt cards at the start */
function showFirstPlayerCards() {
  let card1 = playerHands[0][0];
  let card2 = playerHands[0][1];

  playerPoints = card1.points + card2.points;

  /*  If both first cards are aces, set one hard*/
  if(card1.isAce && card2.isAce) {
    playerPoints -= 10;
    numFullPointsAces--;
  }

  /*  Add the HTML for each card image
      -imagePath is stored as part of the card and is the image file location
      -alt is the text to show if the picture doesn't load, etc
  */
  card1image = `<img src=${card1.imagePath} alt=${card1.shortName} />`;
  card2image = `<img src=${card2.imagePath} alt=${card2.shortName} />`;

  /*  Render the cards & points on the webpage */
  document.getElementById("card").innerHTML = card1image + card2image;
  document.getElementById("points").innerHTML = `Player: ${playerPoints}`;

}

/*  Show the dealers cards at the start */
function showFirstDealerCards() {

  /* This is the hidden card image - just a back of a card picture */
  let cardBack = `<img src="./cardImages/200px-Card_back_05.svg.png"
    alt="card back" />`;

  /*  Show the SECOND card for easier reveal logic */
  let card2 = dealersHand[1];
  dealerPoints = card2.points;

  /*  HTML to show the card we can see's image*/
  let visibleCard = `<img src="${card2.imagePath}"
    alt=""/>`

  let dealerHTML = cardBack + visibleCard;

  /*  Render cards & points on the page */
  document.getElementById("dealerCards").innerHTML =
    cardBack + visibleCard;
  document.getElementById("dealerPoints").innerHTML =
    `Dealer: ${dealerPoints}`;
}

/*  Stand - when the player stands, disable other buttons
    & show the dealer's cards and total points
*/
function stand() {
  let hiddenCard = dealersHand[0];

  let card1 = dealersHand[0];
  let card2 = dealersHand[1];

  /*  Update the dealer's points to add the previously hidden card */
  dealerPoints = card1.points + card2.points;

  /*  Reload dealer card HTML to show both cards and remove the card back
      and update points
      - this would be nice to animate, later
  */
  document.getElementById("dealerCards").innerHTML =
    `<img src="${card1.imagePath}" alt="${card1.shortName}" />
      <img src="${card2.imagePath}" alt="${card2.shortName}" />
    `;

    document.getElementById("dealerPoints").innerHTML =
      `Dealer: ${dealerPoints}`;

    /*  Disable the buttons as the player has no more gameplay options
        left for this round
    */
    document.getElementById("standButton").disabled = true;
    document.getElementById("doubleButton").disabled = true;
    document.getElementById("hitButton").disabled = true;

    /*  If the hidden card was shown, we don't need to run this function
        again
    */
    hiddenCardShown = true;
}

/*  Get a new card for the player. */
function playerHit() {
  let nextCard = gameDeck.getNextCard();

  if(nextCard.isAce) {  //  track this to reduce points by changing the
                        //  ace points, if needed
    numFullPointsAces++;
  }

  /*  If the score will go OVER 21, try to reduce it by changing the point
      value given by any aces in the deck, as far as possible
  */
  while(numFullPointsAces > 0 && playerPoints + nextCard.points > 21) {
    playerPoints -= 10;  //ace is set to default to 11 points
    numFullPointsAces--;
  }
  playerPoints += nextCard.points;



  /*  Render new card & player points */
  let playerHTML = document.getElementById("card").innerHTML;

  playerHTML += `<img src="${nextCard.imagePath}" alt=${nextCard.shortName} />`;

  document.getElementById("card").innerHTML = playerHTML;
  document.getElementById("points").innerHTML = `Player: ${playerPoints}`;

  /*  If the player is BUST, finish the game */
  if(playerPoints > 21) {
    checkWhoWon();
  }

}
/*  TESTING function - in real gameplay, this will be implemented
    as fully automatic logic. Here we click to give a new card to the dealer.
*/
function dealerHit() {

  /*  If the player didn't press stand, we will do it automatically here.
      This is just for Testing.
  */
  if(hiddenCardShown === false) {
    stand();
    /*  This adds a nice delay to the display when a new card is added */
    setTimeout( function() {dealerHit()}, cardDisplayDelay);
  }
  else {

    /* Get a new card for the dealer */
    let nextCard = gameDeck.getNextCard();

    dealersHand.push( nextCard );

    if(nextCard.isAce) {  // Track number of aces to adjust scores correctly
      dealerFullPointsAces++;
    }
    /* Try to convert ace points to 1 if we go over 21,
      for as many full points aces as there are left in the deck.
    */
    while(dealerFullPointsAces > 0 && dealerPoints + nextCard.points > 21) {
      dealerPoints -= 10;
      dealerFullPointsAces--;
    }
    /*  After trying to get the score below 21, if necessary,
        we can set the dealer's points.
    */
    dealerPoints += nextCard.points;

    /*  Save the current HTML which includes the cards already shown. */
    let dealerHTML = document.getElementById("dealerCards").innerHTML;

    /*  Add the new card image to it. */
    dealerHTML += `<img src="${nextCard.imagePath}" alt="${nextCard.shortName}" />
    `;

    /*  Render the card image and points */
    document.getElementById("dealerCards").innerHTML = dealerHTML;

    document.getElementById("dealerPoints").innerHTML =
      `Dealer: ${dealerPoints}`;


  }
  /*  If the dealer is BUST, finish the game */
  if(dealerPoints > 21) {
    checkWhoWon();
  }
}

function newGame() {
  /*  Reset player & dealer "state" variables*/
  playerPoints = 0;
  numFullPointsAces = 0;
  playerHands = [];
  numPlayerHands = 0;

  dealersHand = [];
  dealerFullPointsAces = 0;
  dealerPoints = 0;
  hiddenCardShown = false;

  gameOver = false;
  playerWon = false;
  push = false; //reset the game "tied" condition

  /*  Clear the HTML displays*/
  document.getElementById("card").innerHTML = "";
  document.getElementById("points").innerHTML = `You: ${playerPoints}`;

  document.getElementById("dealerPoints").innerHTML = `Dealer: ${dealerPoints}`;

  document.getElementById("status").innerHTML = "";

  /*  Re-activate gameplay buttons in case they were disabled */
  document.getElementById("hitButton").disabled = false;
  document.getElementById("standButton").disabled = false;
  document.getElementById("doubleButton").disabled = false;

  playRound();
}

function double() {
  let nextCard = gameDeck.getNextCard();

  /*  Hit exactly one card */
  playerHit();

  /*  Reveal the dealer's cards after a wait period (for drama)
      -this is handled in stand() but maybe better to put somewhere else
   */
   if(gameOver === false) {
      setTimeout( function() {stand()}, cardDisplayDelay);
   }

  /*  Disable all player gameplay buttons as none are valid because a double
      means exactly one extra hit for the player.
  */
  document.getElementById("hitButton").disabled = true;
  document.getElementById("standButton").disabled = true;
  document.getElementById("doubleButton").disabled = true;

}


/*  Check for a win after the player stands, and the dealer also stands
    - and also during regular gameplay for the player and dealer if their
    total goes over 21.
*/
function checkWhoWon() {

  let winMessage = "";

  //condition 1: player is bust
  if(playerPoints > 21) {
    playerWon = false;
    winMessage = "Player bust! ";
  }
  //condition 2: player NOT bust, but dealer bust
  // (player win because player points must be under 21 if the first
  //  "if" check passed)
  else if(dealerPoints > 21) {
    playerWon = true;
    winMessage = "Dealer bust! ";
  }
  //condition 3: neither bust, player beats dealer
  else if(playerPoints > dealerPoints) {
    playerWon = true;
    if(playerPoints === 21) {
      winMessage = "Blackjack! ";
    }
  }
  //condition 4: no bust but dealer beats player
  else if(playerPoints < dealerPoints) {
    playerWon = false;
    if(playerPoints === 21) {
      winMessage = "Blackjack. ";
    }
  }
  //condition 5: scores are equal - further check required
  else {
    let pHand = playerHands[0];
    //condition 5a: player has a perfect Blackjack (ace and face)
      if(checkPerfectBlackjack(pHand) === true ) {
          //5a-I: dealer doesn't have a blackjack (player win)
          if(checkPerfectBlackjack(dealersHand) === false) {
            playerWon = true;
            winMessage = "Blackjack! ";
          }
          //5a-II: dealer also has a blackjack ("push" i.e. draw)
          else {
            playerWon = false;
            push = true;
            winMessage = "Blackjacks for everyone! ";
          }
      }
      else if(checkPerfectBlackjack(dealersHand) === true) {
      //condition 5b: dealer has a perfect Blackjack
      //  (& player doesn't - checked above already)
        playerWon = false;
        winMessage = "Blackjack. ";
      }
      //condition 5c: no blackjacks for anyone, but the same points
      else {
        playerWon = false;
        push = true;
        winMessage = "Push. ";
      }
  }
  gameOver = true;

  if(playerWon === true) {
    winMessage += "Player wins!";
  }
  else if(push === true) {
    winMessage += "No winner.";
  }
  else {
    winMessage += "Dealer wins.";
  }
  document.getElementById("status").innerHTML = winMessage;

  document.getElementById("hitButton").disabled = true;
  document.getElementById("standButton").disabled = true;
  document.getElementById("doubleButton").disabled = true;


}

/*  Check for a perfect blackjack - 2 cards, one ace and one face card
    Returns a boolean.
    NB - A perfect blackjack doesn't automatically finish the game
    - the dealer might have one too.
*/
function checkPerfectBlackjack(hand) {
  //More than two cards don't count as a natural blackjack
  if(hand.length > 2) {
    return false;
  }

  //If the first of the two cards is an ace
  if(hand[0].isAce) {
    //the second card's points are 10, but it's NOT the Number 10 card
    if(hand[1].points === 10 && hand[1].isFaceCard) {
      return true;
    }
    else {
      return false;
    }
  }
  //Same logic for card 2
  else if(hand[1].isAce) {
    if(hand[0].points === 10 && hand[0].isFaceCard) {
      return true;
    }
    else {
      return false;
    }
  }
  //No aces - impossible
  else {
    return false;
  }
}


/*  Basically, function to finish the round */
function dealerStand() {
  if(hiddenCardShown === false) {
    stand();
  }
  checkWhoWon();
}

function playRound() {
  dealCards();
  showFirstDealerCards();
  showFirstPlayerCards();
}

/////////MAIN------------------------------------------------------------------

newGame();

// let king = new Card("Hearts", "K");
// let queen = new Card("Hearts", "Q");
// let jack = new Card("Hearts", "J");
// let ace = new Card("Hearts", "A");
// let ten = new Card("Hearts", "10");

// console.log(king.isFaceCard);
// console.log(queen.isFaceCard);
// console.log(jack.isFaceCard);
// console.log(ace.isFaceCard);
// console.log(ten.isFaceCard);
//
// cardHand = [jack, ace];
// console.log(checkPerfectBlackjack(cardHand));
