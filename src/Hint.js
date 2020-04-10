export function getHint(dblOK, dblAfterSplitOK, surrenderOK,
  dealerHand, playerHand) {

    let dealer = dealerHand.shownPoints;
    let player = playerHand.points;
    let playerHandIsSoft = (playerHand.softAces > 0);

    let hint = "";

    /*  Error checking */
    if((dealer<2 && player<2) ||(dealer<2 && player>21) ||
      (dealer >11 && player<2) ||(dealer >11 && player>21))
    {
      hint = "Invalid for both dealer and player";  //should deal when both values are invalid
    }
    else if(dealer<2 || dealer >11) {
      hint = "Invalid for dealer";  //deals with when dealer has invalid score
    }
    else if( player<2 || player>21)
    {
      hint = "Invalid for player"; //deals with when player has invalid score
    }
    /*  Hints for valid total points */
    else if(dealer==2 && (player>=13 && player<=21))
    {
      hint = "You should stand";
    }
    else if(dealer==3 && (player>=13 && player<=21))
    {
      hint = "You should stand";
    }
    else if(dealer==4 && (player>=12 && player<=21))
    {
      hint = "You should stand";
    }
    else if(dealer==5 && (player>=12 && player<=21))
    {
      hint = "You should stand";
    }
    else if(dealer==6 && (player>=12 && player<=21))
    {
      hint = "You should stand";
    }
    else if(dealer>=7 && (player>=17 && player<=21))  //needs equivalent for jack, queen,king
    {
      hint = "You should stand";
    }
    else
    {
      hint = "You should hit";
    }
    /*final notes
    make a table for soft totals by incorporating the ace ruling properly, this is only for hard totals
    make a table for split conditions
    make alt table for if surrender and/or double and/or double after split is an option
    */

    return hint;

}
