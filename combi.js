// Images from http://byronknoll.blogspot.com/2011/03/vector-playing-cards.html
// https://commons.wikimedia.org/wiki/Category:Playing_cards_set_by_Byron_Knoll

class Card {

  constructor(suit, value) {

    this.suit = suit; //"Spades", "Hearts"...
    this.value = value; //"A", "2", "3"... "J", "Q", "K" as string

    this.points = this.generatePoints(); // Set the points based on face value
    this.shortName = this.generateShortName(); // Get e.g. "5H" for 5 of Hearts
    this.icon = this.generateIcon(); // Get a unicode icon for console

    this.imagePath = this.generateImagePath(); //get image path
  }

  get isAce() {

    return this.value==="A";

  }

  get isHard() {

    return this.isAce && this.points === 11;

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

  //Unicode icon for console.
  //Real game will use real images - but this console icon is good for
  //debugging.
  generateIcon() {

    const cardSuit = this.suit;
    const val = this.value;

    const cardIcons = {
      "Spades" :
        {
          "A": "🂡",
          "2": "🂢",
          "3": "🂣",
          "4": "🂤",
          "5": "🂥",
          "6": "🂦",
          "7": "🂧",
          "8": "🂨",
          "9": "🂩",
          "10": "🂪",
          "J": "🂫",
          "Q": "🂭",
          "K": "🂮"
        },

      "Hearts":
        {
          "A": "🂱",
          "2": "🂲",
          "3": "🂳",
          "4": "🂴",
          "5": "🂵",
          "6": "🂶",
          "7": "🂷",
          "8": "🂸",
          "9": "🂹",
          "10": "🂺",
          "J": "🂻",
          "Q": "🂽",
          "K": "🂾"
        },

      "Diamonds":
        {
          "A": "🃁",
          "2": "🃂",
          "3": "🃃",
          "4": "🃄",
          "5": "🃅",
          "6": "🃆",
          "7": "🃇",
          "8": "🃈",
          "9": "🃉",
          "10": "🃊",
          "J": "🃋",
          "Q": "🃍",
          "K": "🃎"
        },

      "Clubs":
        {
          "A": "🃑",
          "2": "🃒",
          "3": "🃓",
          "4": "🃔",
          "5": "🃕",
          "6": "🃖",
          "7": "🃗",
          "8": "🃘",
          "9": "🃙",
          "10": "🃚",
          "J": "🃛",
          "Q": "🃝",
          "K": "🃞"
        }
    };

    //Get the suit's own sub-array, and then the correct icon inside it
    return cardIcons[cardSuit][val];

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

  //Allow soft hand if there is an Ace - so the change is done
  //with the Ace card (maybe technically incorrect but easier)
  //Logic of changing this to be implemented in the game itself
  setSoft() {

    if( this.isHard === true ) {

      console.log("This Ace set to soft");
      this.points = 1;

    }
    else {

      if( this.isAce === true ) {
        console.log("This Ace is already soft");
      }
      else {
        console.log("This Card is not an ace - can't set soft");
      }


    }

  }

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

let currentPoints = 0;
let numHardAces = 0;
let gameDeck = new Deck(8);
gameDeck.shuffle();

let dealersHand = [];
let dealerHardAces = 0;
let dealerPoints = 0;

function getDealerCards() {
  let dealerCard1 = gameDeck.getNextCard();
  dealersHand.push( dealerCard1 );
  if(dealerCard1.isAce) {
    dealerHardAces++;
  }

  let dealerCard2 = gameDeck.getNextCard();
  dealersHand.push( dealerCard2 );
  if(dealerCard2.isAce) {
    dealerHardAces++;
  }
}

function showDealerCards() {
  /* Show the card back to reveal one card later */

  let cardBack = `<img src="./cardImages/200px-Card_back_05.svg.png"
    alt="card back" />`;

    /*Show the SECOND card for easier reveal logic */
  let card2 = dealersHand[1];
  dealerPoints = card2.points;

  let visibleCard = `<img src="${card2.imagePath}"
    alt=""/>`

  let dealerHTML = cardBack + visibleCard;

  document.getElementById("dealerPoints").innerHTML =
    `Dealer: ${dealerPoints}`;


  document.getElementById("dealerCards").innerHTML =
    cardBack + visibleCard;

}

getDealerCards();
showDealerCards();

function revealFirstCard() {
  let hiddenCard = dealersHand[1];

  let card1 = dealersHand[0];
  let card2 = dealersHand[1];



  dealerPoints = card1.points + card2.points;

  document.getElementById("dealerCards").innerHTML =
    `<img src="${card1.imagePath}" alt="${card1.shortName}" />
      <img src="${card2.imagePath}" alt="${card2.shortName}" />

    `;

    document.getElementById("dealerPoints").innerHTML =
      `Dealer: ${dealerPoints}`;

}

function dealerHit() {
  let nextCard = gameDeck.getNextCard();

  if(nextCard.isAce) {
    dealerHardAces++;
  }
  /* Try to convert ace points to 1 if we go over 21,
    for as many hard aces as there are left in the deck.
  */
  while(dealerHardAces > 0 && dealerPoints + nextCard.points > 21) {
    dealerPoints -= 10;
    dealerHardAces--;
  }
  dealerPoints += nextCard.points;

  let dealerHTML = document.getElementById("dealerCards").innerHTML;

  dealerHTML += `<img src="${nextCard.imagePath}" alt="${nextCard.shortName}" />
  `;

  document.getElementById("dealerCards").innerHTML = dealerHTML;

  document.getElementById("dealerPoints").innerHTML =
    `Dealer: ${dealerPoints}`;

}

function getCardShowImage() {

  let next = gameDeck.getNextCard();
  next.showCardImage();
  /*  Alternative logic to checking the card itself
      - we just track the total number of aces shown first
  */
  if(next.isAce) {
    numHardAces++;
  }
  /*  If the next card's points will make the score go over
      21, we try to change any ace points to 1 until we can't
      anymore.
  */
  while(numHardAces > 0 && currentPoints + next.points > 21) {
    currentPoints -= 10;
    numHardAces--;
  }
  currentPoints += next.points;

  document.getElementById("points").innerHTML = `You: ${currentPoints}`;
}

function resetShowImage() {
  currentPoints = 0;
  numHardAces = 0;
  document.getElementById("card").innerHTML = "";
  document.getElementById("points").innerHTML = `You: ${currentPoints}`;

  dealersHand = [];
  dealerHardAces = 0;
  dealerPoints = 0;
  document.getElementById("dealerPoints").innerHTML = `Dealer: ${dealerPoints}`;
  getDealerCards();
  showDealerCards();
}

///deck class test
/*
console.log("\nSINGLE DECK TEST==============================\n")

let myDeck = new Deck(1);
myDeck.display();
myDeck.shuffle();
console.log("\nShuffled----------------------------------\n");
myDeck.display();

console.log("\n");
*/

// Creating an eight-deck pack, like in a Blackjack game
/*
console.log("\nEIGHT DECKS TEST==============================\n")

let gameDeck = new Deck(8);
// gameDeck.display();
gameDeck.shuffle();
console.log("\nShuffled----------------------------------\n");
gameDeck.display();


console.log("\nGETTING NEXT CARD TEST=========================\n");

for(let i = 0; i < ((52 * 8)+1); i++) {
  let nextCard = gameDeck.getNextCard();
  console.log("card " + (i+1) + " (" + nextCard.value + " of " + nextCard.suit +
    "), points: "+ nextCard.points + ": ");
  if(nextCard.isAce === true) {
    console.log("(it's an ace)");
  }
  if(nextCard.isHard === true) {
    console.log("it's hard");
  }
  nextCard.display();
}


console.log("\nCARD - ACE TESTS++++++++++++++++++++++++++++++++++++");

let aceNew = new Card("Spades", "A");
aceNew.display();
console.log("this is an ace? " + aceNew.isAce);
console.log("hard: " + aceNew.isHard + ", pts: " + aceNew.points);
aceNew.setSoft();
console.log("hard: " + aceNew.isHard + ", pts: " + aceNew.points);

console.log("\n");

let cardNew = new Card("Diamonds", "10");
cardNew.display();
console.log("this is an ace? " + cardNew.isAce);
console.log("hard: " + cardNew.isHard + ", pts: " + cardNew.points);
cardNew.setSoft();
console.log("hard: " + cardNew.isHard + ", pts: " + cardNew.points);
*/
