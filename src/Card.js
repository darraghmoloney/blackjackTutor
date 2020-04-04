
function makeCard(cardSuit, cardValue) {
  let newCard = {
    "suit": cardSuit,
    "value": cardValue,
    "points": generatePoints(cardValue),
    "shortName": generateShortName(cardSuit, cardValue),
    "imagePath": generateImagePath(cardSuit, cardValue),
  };
  return newCard;
}

function generatePoints(cardValue) {
  switch(cardValue) {
    case "A":
      return 11;
    case "K":
    case "Q":
    case "J":
      return 10;
    default:
      return parseInt(cardValue);
  }
}

function generateShortName(cardSuit, cardValue) {
  let shortName = cardValue;
  switch(cardSuit) {
    case "Spades":
      shortName += '♠';
      break;
    case "Hearts":
      shortName += '♥';
      break;
    case "Diamonds":
      shortName += '♦';
      break;
    case "Clubs":
      shortName += '♣';
      break;
    default:
      break;
  }
  return shortName;
}

function generateImagePath(cardSuit, cardValue) {
  let imagePath = `./cardImages/`;
  let tagString = "";

    switch(cardValue) {
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
        imagePath+= cardValue;
    }

    imagePath += "_of_";

    switch(cardSuit) {
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
      default:
        break;
    }

    imagePath += tagString + ".png";

    return imagePath;
}


function makeSingleDeck() {

  let deck = [];

  const suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
  const faceCards = ["K", "J", "Q"];

  for(const suit of suits) {

    let ace = makeCard(suit, "A");
    deck.push( ace );

    for(let i = 2; i < 11; i++) {
      let numberCard = makeCard(suit, i);
      deck.push( numberCard );
    }

    for(const faceCard of faceCards) {
      let nextFaceCard = makeCard(suit, faceCard);
      deck.push(nextFaceCard);
    }

  }


  return deck;
}

//EXPORT function also used in Game.js
/*  Make a deck combined of many decks to be used in the game */
export function makeMultiDecks(number) {
  let bigDeck = makeSingleDeck();
  for(let i=0; i<number-1; i++) {
    let nextDeck = makeSingleDeck();

    for(const card of nextDeck) {
      bigDeck.push(card);
    }

  }

  return bigDeck;
}

//EXPORT function also used in Game.js
/*  General card deck Shuffle function */
export function shuffleDeck(deck) {

  /*  Loop through the deck & find a swap place within the unswapped zone
      for each card
      There might be a better algorithm for this...
  */
  for(let i=0; i<deck.length; i++) {

    let randomSwapPlace = i + parseInt(Math.random() * (deck.length - i));

    /*  Standard swap with temp variable technique */
    let temp = deck[i];
    deck[i] = deck[randomSwapPlace];
    deck[randomSwapPlace] = temp;

  }
}


let gameDeck = makeMultiDecks(8);
shuffleDeck(gameDeck);

//EXPORT variable used in Game.js
/*  The FIRST card deck is exported to Game.js after being shuffled.

    If the game card deck runs out of cards, the Game.js file will use the
    exported makeMultiDecks() shuffleDeck() functions to make a new deck later.
 */
export const cardDeck = gameDeck;
