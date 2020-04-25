/*  Make a hint for the player.

    Uses
      - the player and dealer hand objects
      - the game options (double allowed, double after split allowed, surrender
          allowed)
*/
export function getHint(dblOK, dblAfterSplitOK, surrenderOK,
  dealerHand, playerHand) {

    let dealer = dealerHand.shownPoints;
    let player = playerHand.points;
    let playerHandIsHard = (playerHand.softAces === 0);
    let playerCardsCount = playerHand.cards.length;
    // console.log(playerCardsCount)

    let playerHandIsPairs = (playerCardsCount === 2) &&
      (playerHand.cards[0].value === playerHand.cards[1].value);

    // console.log(playerHandIsPairs)

    let doubleAllowed = dblOK;
    // console.log(doubleAllowed)

    let error = false;


    /* Store more detailed info for quiz as well as gameplay */
    let hint = {
      hintMessage: "",
      hit: false,
      stand: true, //in if checks, stand is the most common, so true by default
      split: false,
      double: false,
      surrender: false,
    };

    /*  Error checking */
    if((dealer<2 && player<2) ||(dealer<2 && player>21) ||
      (dealer >11 && player<2) ||(dealer >11 && player>21))
    {
      hint.hintMessage = "Invalid for both dealer and player";  //should deal when both values are invalid
      hint.stand = false;
      error = true;
    }
    else if(dealer<2 || dealer >11) {
      hint.hintMessage = "Invalid for dealer";  //deals with when dealer has invalid score
      hint.stand = false;
      error = true;
    }
    else if( player<2 || player>21)
    {
      hint.hintMessage = "Invalid for player"; //deals with when player has invalid score
      hint.stand = false;
      error = true;
    }

    //For non-error situations
    if(!error) {
      if(playerHandIsPairs) {
        return getHintPairHand(dealer, player, doubleAllowed);
      }
      else if(playerHandIsHard) {
        return getHintHardHand(dealer, player, playerCardsCount, doubleAllowed);
      }
      else {
        return getHintSoftHand(dealer, player, doubleAllowed);
      }
    }
    
    //Return the error hand - hopefully never happens
    return hint;

}



function getHintHardHand(dealer, player, playerCardsCount, doubleAllowed) {

  console.log(`Hint for Hard hand`)

  let hint = {
    hintMessage: "",
    hit: false,
    stand: true, //in if checks, stand is the most common, so true by default
    split: false,
    double: false,
    surrender: false,
  };

  if(dealer===2)
  {
    if (player>=13 && player<=21) {
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 9 && player < 12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer===3)
  {
    if(player>=13 && player<=21) {
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 8 && player < 12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer===4)
  {
    if(player>=12 && player<=21) {
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 8 && player < 12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer===5)
  {
    if(player>=12 && player<=21){
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 8 && player <12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer===6)
  {
    if(player>=12 && player<=21) {
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 8 && player <12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer>=7 && dealer <= 9)   //needs equivalent for jack, queen,king
  {
    if(player>=17 && player<=21) {
      hint.hintMessage = "You should stand";
    }
    else if(doubleAllowed && player > 9 && player < 12) {
      hint.hintMessage = "You should double";
      hint.stand = false;
      hint.double = true;
    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else if(dealer===10) {
      if( (player >= 17) || (player===16 && playerCardsCount < 3) ) {
        hint.hintMessage = "You should stand";
      }
      else if(doubleAllowed && player===11) {
        hint.hintMessage = "You should double";
        hint.stand = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should hit";
        hint.stand = false;
        hint.hit = true;
      }
  }

  //Dealer shows an Ace
  else if(dealer===11) {
    if(player>=17) {
      hint.hintMessage = "You should stand";

    }
    else {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }
  }


  else
  {
    hint.hintMessage = "You should hit";
    hint.stand = false;
    hint.hit = true;
  }

  return hint;
}

/*  Hints for a hand with an Ace still worth 11 pts */
function getHintSoftHand(dealer, player, doubleAllowed) {

  console.log(`Hint for Soft hand`)

  let hint = {
    hintMessage: "You should hit",
    hit: true,
    stand: false,
    split: false,
    double: false,
    surrender: false,
  };

  if(dealer===2) {
    if(player>17) {
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }
  }

  if(dealer===3) {
    if(doubleAllowed && player===17) {
      hint.hintMessage = "You should double"
      hint.hit = false;
      hint.double = true;
    }
    else if(player===18) {
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.hit = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should stand"
        hint.hit = false;
        hint.stand = true;
      }
    }
    else if(player>18) {
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }
  }

  if(dealer===4) {
    if(doubleAllowed && player >14 && player <18) {
      hint.hintMessage = "You should double"
      hint.hit = false;
      hint.double = true;
    }
    else if(player===18) {
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.hit = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should stand"
        hint.hit = false;
        hint.stand = true;
      }
    }
    else if(player>18) {
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }

  }

  if(dealer===5 || dealer===6) {
    if(doubleAllowed && player<18) {
      hint.hintMessage = "You should double"
      hint.hit = false;
      hint.double = true;
    }
    else if(player===18) {
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.hit = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should stand"
        hint.hit = false;
        hint.stand = true;
      }
    }
    else if(player > 18){
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }
  }

  if(dealer===7 || dealer===8) {
    if(player>17) {
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }
  }

  if(dealer>=9) {
    if(player>18) {
      hint.hintMessage = "You should stand"
      hint.hit = false;
      hint.stand = true;
    }
  }

  return hint;

}
//
function getHintPairHand(dealer, player, doubleAllowed) {
  console.log(`Hint for Pairs hand`)

  let hint = {
    hintMessage: "You should split",
    hit: false,
    stand: false,
    split: true,
    double: false,
    surrender: false,
  };

  if(dealer<=4) {
    if(player===8) { //Pair of 4s
      hint.hintMessage = "You should hit"
      hint.split = false;
      hint.hit = true;
    }
    else if(player===10) { //Pair of 5s
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.split = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should hit"
        hint.split = false;
        hint.hit = true;
      }
    }
    else if(player===20) {
      hint.hintMessage = "You should stand"
      hint.split = false;
      hint.stand = true;
    }
  }

  if(dealer===5 || dealer===6) {
    if(player===10) {
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.split = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should hit"
        hint.split = false;
        hint.hit = true;
      }
    }
    else if(player===20) {
      hint.hintMessage = "You should stand"
      hint.split = false;
      hint.stand = true;
    }
  }

  if(dealer===7) {
    if(player===8 || player===12) {
      hint.hintMessage = "You should hit"
      hint.split = false;
      hint.hit = true;
    }
    else if(player===10) {
      if(doubleAllowed) {
        hint.hintMessage = "You should double"
        hint.split = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should hit"
        hint.split = false;
        hint.hit = true;
      }
    }
    else if(player===18 || player===20){
      hint.hintMessage = "You should stand"
      hint.split = false;
      hint.stand = true;
    }
  }

  if(dealer===8 || dealer===9) {
    if(player<16 && player !== 12) { //2 Aces are 12
      if(doubleAllowed && player===10) {
        hint.hintMessage = "You should double"
        hint.split = false;
        hint.double = true;
      }
      else {
        hint.hintMessage = "You should hit"
        hint.split = false;
        hint.hit = true;
      }
    }
    else if(player===20) {
      hint.hintMessage = "You should stand"
      hint.split = false;
      hint.stand = true;
    }
  }

  if(dealer>=10) {
    if(player<16 && player !== 12) {
      hint.hintMessage = "You should hit"
      hint.split = false;
      hint.hit = true;
    }
    else if(player===18 || player===20) {
      hint.hintMessage = "You should stand"
      hint.split = false;
      hint.stand = true;
    }
  }

  return hint;

}
