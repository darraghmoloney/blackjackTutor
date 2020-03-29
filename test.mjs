import Deck from "./deck.mjs";
import Card from "./card.mjs";

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
