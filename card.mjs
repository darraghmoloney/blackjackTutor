class Card {

  constructor(suit, value) {

    this.suit = suit; //"Spades", "Hearts"...
    this.value = value; //"A", "2", "3"... "J", "Q", "K" as string

    this.points = this.generatePoints(); // Set the points based on face value
    this.shortName = this.generateShortName(); // Get e.g. "5H" for 5 of Hearts
    this.icon = this.generateIcon(); // Get a unicode icon for console

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

    console.log(`${this.icon}`);

  }

}

export default Card;
