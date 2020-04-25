import {hardStrategyTable, softStrategyTable, pairsStrategyTable} from './strategyTables.js';

/*  Make a hint for the player.

    Uses
      - the player and dealer hand objects
      - the game options (double allowed, surrender allowed)

      (NB - the option doubleAfterSplitAllowed is not necessary here because
      it is part of the overall double allowed setting and handled
      by the hand object in the gameplay)
    )
*/
//______________________________________________________________________________
export function getHint(dblOK, surrenderOK,
  dealerHand, playerHand) {

    let dealer = dealerHand.shownPoints;
    let player = playerHand.points;


    let playerHandIsHard = (playerHand.softAces === 0);

    let playerCardsCount = playerHand.cards.length;

    let playerHandIsPairs = (playerCardsCount === 2) &&
      (
        (playerHand.cards[0].points===playerHand.cards[1].points)
          ||
          //Pair of Aces will be set to different pts, as one will be hard
        (playerHand.cards[0].value==='A' && playerHand.cards[1].value==='A')
      );

    let pairOfAces = false;
    if(playerHandIsPairs && playerHand.cards[0].value === 'A') {
      pairOfAces = true;
    }

    let doubleAllowed = dblOK;

    /*  Error checking */
    if((dealer<2 && player<2) ||(dealer<2 && player>21) ||
      (dealer >11 && player<2) ||(dealer >11 && player>21))
    {
      console.error("Invalid points for both dealer and player in hint check");  //should deal when both values are invalid
      return;
    }
    else if(dealer<2 || dealer >11) {
      console.error("Invalid points for dealer in hint check");  //deals with when dealer has invalid score
      return;
    }
    else if( player<2 || player>21)
    {
      console.error("Invalid points for player in hint check"); //deals with when player has invalid score
      return;
    }

    /*  For non-error situations */

    /*  Must check for pairs FIRST,
      - otherwise Ace logic would be wrong:
        A,A pts are 12, but so are 6,6
        and there are different strategies
        for both hands
    */
    if(playerHandIsPairs) {
      return getHintPairHand(dealer, player, doubleAllowed, pairOfAces);
    }
    else if(playerHandIsHard) {
      return getHintHardHand(dealer, player, doubleAllowed, playerCardsCount);
    }
    else {
      return getHintSoftHand(dealer, player, doubleAllowed);
    }

}


/*  Default hint */
//______________________________________________________________________________
function getHintHardHand(dealer, player, doubleAllowed, playerCardsCount ) {

  console.log(`Hint for Hard hand`);

  let extraInfo = {
    "doubleAllowed": doubleAllowed,
    "numberOfCards": playerCardsCount,
  };

  let short;

  if(player <= 8) {
    short = hardStrategyTable['5to8'][dealer];
  }
  else if(player >= 9 && player <= 12) {
    short = hardStrategyTable[player][dealer];
  }
  else if(player >= 13 && player <= 15) {
    short = hardStrategyTable['13to15'][dealer];
  }
  else if(player === 16) {
    short = hardStrategyTable['16'][dealer];
  }
  else {
    short = hardStrategyTable['17+'][dealer];
  }

  return makeFullHint(short,extraInfo);

}

/*  Hints for a hand with an Ace still worth 11 pts */
//______________________________________________________________________________
function getHintSoftHand(dealer, player, playerCardsCount, doubleAllowed) {

  console.log(`Hint for Soft hand`)

  let extraInfo = {
    "doubleAllowed": doubleAllowed,
  };

  let short;


  if(player <= 14) {
    short = softStrategyTable['13to14'][dealer];

  }
  else if(player >= 15 && player <= 16) {
    short = softStrategyTable['15to16'][dealer];
  }
  else if(player >= 17 && player <= 18) {
    short = softStrategyTable[player][dealer];
  }
  else {
    short = softStrategyTable['19+'][dealer];
  }

  return makeFullHint(short, extraInfo);

}


//______________________________________________________________________________
function getHintPairHand(dealer, player, doubleAllowed, pairOfAces) {
  console.log(`Hint for Pairs hand`)

  let extraInfo = {
    "doubleAllowed": doubleAllowed,
    "pairOfAces": pairOfAces,
  };

  // console.log("acepair" + pairOfAces)

  let short;

  // '4or6', '8', '10', '12', '14', '16', '18', '20', 'AA'
  if(player <= 6) {
    short = pairsStrategyTable['4or6'][dealer];
  }
  else if(pairOfAces) {
    short = pairsStrategyTable['AA'][dealer];
    // console.log(short)
  }
  else {
    short = pairsStrategyTable[player][dealer];
    // console.log(short)
  }
  return makeFullHint(short, extraInfo);

}

/*  Helper function */
//______________________________________________________________________________
function makeFullHint(shortenedHint, extraInfo) {
  let hint = {
      hintMessage: "",
      hit: false,
      stand: false,
      split: false,
      double: false,
      surrender: false,
    };

    let doubleAllowed = extraInfo.doubleAllowed;
    let numberOfCards = extraInfo.numberOfCards;
    let pairOfAces = extraInfo.pairOfAces;

    if(shortenedHint === 'h') {
      hint.hintMessage = "You should hit";
      hint.hit = true;
    }
    else if(shortenedHint === 'd') {
      if(doubleAllowed) {
        hint.hintMessage = "You should double";
        hint.double = true;
      } else {
        hint.hintMessage = "You should hit";
        hint.hit = true;
      }
    }
    else if(shortenedHint === 's') {
      hint.hintMessage = "You should stand";
      hint.stand = true;
    }
    else if(shortenedHint === 'h2s3') {
      if(numberOfCards <= 2) { //Will skip if undefined value
        hint.hintMessage = "You should hit";
        hint.hit = true;
      } else {
        hint.hintMessage = "You should stand";
        hint.stand = true;
      }
    }
    else if(shortenedHint === 'ds') {
      if(doubleAllowed) {
        hint.hintMessage = "You should double";
        hint.double = true;
      } else {
        hint.hintMessage = "You should stand";
        hint.stand = true;
      }
    }
    else if(shortenedHint === 'p') {
      hint.hintMessage = "You should split";
      hint.split = true;
    }


    return hint;
}
