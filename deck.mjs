import Card from "./card.mjs";

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

export default Deck;
