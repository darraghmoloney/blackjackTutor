/*  Make a hint for the player.

    Uses
      - the player and dealer hand objects
      - the game options (double allowed, double after split allowed, surrender
          allowed)
          -- NB these options are not yet fully implemented
*/
export function getHint(dblOK, dblAfterSplitOK, surrenderOK,
  dealerHand, playerHand) {

    let dealer = dealerHand.shownPoints;
    let player = playerHand.points;
    let playerHandIsSoft = (playerHand.softAces > 0);

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
    }
    else if(dealer<2 || dealer >11) {
      hint.hintMessage = "Invalid for dealer";  //deals with when dealer has invalid score
      hint.stand = false;
    }
    else if( player<2 || player>21)
    {
      hint.hintMessage = "Invalid for player"; //deals with when player has invalid score
      hint.stand = false;
    }
    /*  Hints for valid total points */
    else if(dealer===2 && (player>=13 && player<=21))
    {
      hint.hintMessage = "You should stand";
    }
    else if(dealer===3 && (player>=13 && player<=21))
    {
      hint.hintMessage = "You should stand";
    }
    else if(dealer===4 && (player>=12 && player<=21))
    {
      hint.hintMessage = "You should stand";
    }
    else if(dealer===5 && (player>=12 && player<=21))
    {
      hint.hintMessage = "You should stand";
    }
    else if(dealer===6 && (player>=12 && player<=21))
    {
      hint.hintMessage = "You should stand";
    }
    else if(dealer>=7 && (player>=17 && player<=21))  //needs equivalent for jack, queen,king
    {
      hint.hintMessage = "You should stand";
    }
    else
    {
      hint.hintMessage = "You should hit";
      hint.stand = false;
      hint.hit = true;
    }


    /*final notes
    make a table for soft totals by incorporating the ace ruling properly, this is only for hard totals
    make a table for split conditions
    make alt table for if surrender and/or double and/or double after split is an option
    */

    return hint;

}
