import React from 'react';
import {cardDeck, makeMultiDecks, shuffleDeck} from './card.js';
import {getHint} from './Hint.js';
import './Gameplay.css';


const blankCard =  "./cardImages/200px-Card_back_05.svg.png";
const chips = "./casino-chips.png";


class Gameplay extends React.Component {

  constructor(props) {


    super(props);


    this.state = {

          optionsChosen: false,

          gameDeck: cardDeck,

          playerHands: [],
          dealerHand: '',

          activeHands: 0,
          totalHands: 0,
          bustHands: 0,

          showDealerCards: false, //hide one card for the dealer

          splitAllowed: true, //this is not really an option in blackjack!

          doubleAllowed: false,
          surrenderAllowed: false,
          doubleAfterSplitAllowed: false,

          gameStarted: false, //show cards only after game is started

          dealerStartDelay: 200, //wait before dealer play is shown
          dealerTimeout: '', //control & reset dealer delay

          dealerDealDelay: 800,
          dealerHitTimeout: '',

          winCheckDelay: 800,
          winCheckTimeout: '', //delay before win messages shown

    }

    this.start = this.start.bind(this);
    this.selectSplits = this.selectSplits.bind(this);
    this.selectDoubles = this.selectDoubles.bind(this);
    this.selectSurrenders = this.selectSurrenders.bind(this);
    this.selectDoubleAfterSplit = this.selectDoubleAfterSplit.bind(this);

    this.dealerPlay = this.dealerPlay.bind(this);
    this.dealerHit = this.dealerHit.bind(this);
    this.dealerFinish = this.dealerFinish.bind(this);
    this.checkWinningHands = this.checkWinningHands.bind(this);

  }




/******************************************************************************

                        SETUP FUNCTIONS

/******************************************************************************/

/*  Get a card from the game deck */
//______________________________________________________________________________
  getCard() {

    let deckForGame = this.state.gameDeck;

    /* Make a new deck if the end is reached */
    if(deckForGame.length <= 0) {
      deckForGame = makeMultiDecks(8);
      shuffleDeck(deckForGame);
    }

    /*  Remove the first card from the array */
    let nextCard = deckForGame.shift();

    nextCard.animated = false; //Animate once only

    this.setState({gameDeck: deckForGame});
    return nextCard;

  }


/* Calculate the points of a hand by looping through all cards and
  getting the total points using .reduce() function  */
//______________________________________________________________________________
  getCardPoints(hand) {

    return hand.reduce((total, card) =>
      total + card.points
    , 0);

  }


/*  Check if 2 cards are a natural Blackjack
    i.e. an Ace and a Face/10 card
    - A natural Blackjack will win over another 21 point hand
    NB This function should only be called if the hand has only
    two cards in it */
//______________________________________________________________________________
  checkNaturalBlackjack(card1, card2) {

    //blackjack must be exactly 21 points
    return (card1.points + card2.points) === 21;

  }



/*  Make a hand object for 2 cards in an array and the hand number. */
//______________________________________________________________________________
  makeSingleHand(cards, handNumber) {

    /* Player hands & the dealer hand has different properties,
      i.e. no need for a hint message for the dealer, etc.
      So this checks if it's a player hand (with a number)
      or a dealer hand (no number)
    */
    let forPlayer = (handNumber !== undefined);


    /*  Check how many Aces in the hand */
    let aceTotal = 0;
    if(cards[0].value === "A") {
      aceTotal++;
    }
    if(cards[1].value === "A") {
      aceTotal++;
    }

    /*  Get the points for the first hand
        and change them if there are 2 Aces
    */
    let handPoints = this.getCardPoints([cards[0], cards[1]]);
    if(handPoints > 21) {
        handPoints -= 10;
        aceTotal--;
    }

    /*  Check fo a natural blackjack - Ace & Face card */
    let naturalBlackjack = this.checkNaturalBlackjack(cards[0], cards[1]);


    /*  Create generic hand object (player or dealer) */
    let hand = {
     "cards": [cards[0], cards[1]],
     "softAces": aceTotal,
     "points": handPoints,
     "bust": false,
     "gameOverMessage": "",
     "naturalBlackjack": naturalBlackjack,
    }

    /* Add player-specific properties if needed */
    if(forPlayer) {

      /*  Disable the split button if the two cards have different pts */
      let disabledSplit = (cards[0].points !== cards[1].points);

      hand.number = handNumber;
      hand.hintMessage = "";
      hand.hintShown = false;
      hand.surrendered = false;
      hand.splitDisabled = disabledSplit;
      hand.hitDisabled =  false;
      hand.standDisabled = false;
      hand.doubleDisabled = false;
      hand.hintDisabled = false;
      hand.surrenderDisabled = false;
      hand.won = false;
      hand.push = false;
    }
    /*  Or for the dealer, an extra shownPoints property without
        the other extra ones
        - a points value for the dealer card that is visible, not including the
          hidden card's points
     */
    else {
      hand.shownPoints = cards[1].points;
    }

   return hand;

  }


/*  Deal first hands for the player and dealer */
//______________________________________________________________________________
  makeFirstHands() {

    let firstHands = [];

    /*  Deal cards for Player & Dealer */
    let playerCard1 = this.getCard();
    let dealerCard1 = this.getCard();

     let playerCard2 = this.getCard();
     let dealerCard2 = this.getCard();

     /* Use function to make the start hands for both */
    let playerFirstHand = this.makeSingleHand( [playerCard1, playerCard2], 0);
    let dealerFirstHand = this.makeSingleHand( [dealerCard1, dealerCard2])

    firstHands.dealer = dealerFirstHand;
    firstHands.player = playerFirstHand;

    return firstHands; //Returns an array of JS objects containing the hand info
  }




/******************************************************************************

                          DISPLAY FUNCTIONS

/******************************************************************************/

/*  Show every player hand using the .map() function */
//______________________________________________________________________________
  displayAllPlayerHands() {

    let hands =
    this.state.playerHands.map( (hand, index) => (

        <div key={index} className="playerShowGP">

        <div className="playerCardsGP">
        {hand.cards.map( (card, index) => (
            <img
              key={index}
              className=
              { (index > 1 && !card.animated) ?
                "cardDisplayGP  w3-center w3-animate-right" :
                "cardDisplayGP"
              }
              src={card.imagePath}
              alt={card.shortName}
            />
        ))}
        </div>

          <div className="handStatusGP">
            <span id="playerPointsGP" className="handPointsGP">· {hand.points} ·</span>
            <span id="hint" className="handInfoGP">&nbsp;{hand.hintMessage}</span>
          </div>

          <div id="playerButtonsGP">

            {hand.hitDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.hitDisabled}
                onClick={() => {this.hit(hand.number)}}>
                  Hit
              </button>
            }

            {hand.standDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.standDisabled}
                onClick={() => {this.stand(hand.number)}}>
                  Stand
              </button>
            }

            { this.state.doubleAllowed && hand.doubleDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.doubleDisabled}
                onClick={() => {this.double(hand.number)}}>
                  Double
              </button>
            }

            {this.state.splitAllowed && hand.splitDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.splitDisabled}
                onClick={() => {this.split(hand.number)}}>
                  Split
              </button>
            }

            {this.state.surrenderAllowed && hand.surrenderDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.surrenderDisabled}
                onClick={() => {this.surrender(hand.number)}}>
                  Surrender
              </button>
            }

            {hand.hintDisabled === false &&
              <button
                className="gameplayBtnGP"
                disabled={hand.hintDisabled}
                onClick={() => {this.toggleHint(hand.number)}}>
                  Hint
              </button>
            }

            {hand.hitDisabled && hand.standDisabled && (!this.state.doubleAllowed ||
              hand.doubleDisabled) && (!this.state.splitAllowed || hand.splitDisabled) &&
                (!this.state.surrenderAllowed || hand.surrenderDisabled) &&
                  hand.hintDisabled && (hand.gameOverMessage === "") &&
                <div id="playerButtonsHidden">&nbsp;</div>
            }

          </div>

          {/*<div id="hint" className="handInfoGP">{hand.hintMessage}</div>*/}
          {/*<div id="handGameOverMsg"> &nbsp; {hand.gameOverMessage}</div>*/}
          {hand.won === true &&
              <div id="winMessageGP">
                <span role="img" aria-label="checkmark">✔️</span> {hand.gameOverMessage}
              </div>
          }
          {hand.push === true &&
              <div id="winMessageGP">
                <span role="img" aria-label="exclamation mark">❕</span> {hand.gameOverMessage}
              </div>
          }
          {!hand.won && !hand.push && hand.gameOverMessage !== "" &&
              <div id="winMessageGP">
                <span role="img" aria-label="red X">❌</span> {hand.gameOverMessage}
              </div>
          }

          <br />
        </div>
      ));

      /*  Remove card animation CSS from cards after they've been displayed
          once, so that the Options menu doesn't cause the animation to repeat.

          This loops through every player card and sets their "animated"
          property to true. Only new cards have this property - it is
          undefined for the first dealt cards.
      */
      let playerHands = this.state.playerHands;
      playerHands.forEach((pHand, i) => {
        pHand.cards.forEach((card, i) => {
            if(card.animated === false) {
              card.animated = true;
            }
        });

      });


      return <div id="allPlayerHandsGP">{hands}</div>;
  }


/*  Show the first dealer hand in the game, with one card hidden */
//______________________________________________________________________________
  displayHiddenDealerHand() {
    let shownCard = this.state.dealerHand.cards[1];
    return (
      <div id="dealerHandGP" className="dealerShowGP">

        <div id="dealerPointsGP" className="handPointsGP">· {this.state.dealerHand.shownPoints} ·</div>
        <div id="dealerCardsGP">
          <img className="cardDisplayGP" src={blankCard} alt="back of card" />
          <img className="cardDisplayGP" src={shownCard.imagePath} alt={shownCard.shortName} />
        </div>
      </div>
    );
  }


/*  Show both of the first 2 cards of the dealer, if the player is finished
    and not bust for every hand */
//______________________________________________________________________________
  displayWholeDealerHand() {

    /*  Use map to make Array of cards with JSX to display each one.
        Note the first two cards are not given animation, to give a
        "dealing card" effect when new cards enter the hand.
    */
    let cards =
    this.state.dealerHand.cards.map( (card, index) => (

      <img
        key={index}
        className=
        { (index > 1) ?
          "cardDisplayGP  w3-center w3-animate-right" :
          "cardDisplayGP"
        }
        src={card.imagePath}
        alt={card.shortName}
      />
    )
    );

    let displayHTML =
      <div id="dealerHandGP" className="dealerShowGP w3-container">

        <div id="dealerPointsGP" className="handPointsGP">· {this.state.dealerHand.points} ·</div>
        <div id="dealerCardsGP">{cards}</div>
      </div>

    return displayHTML;
  }




/******************************************************************************

                          GAMEPLAY FUNCTIONS

/******************************************************************************/

/*  Hit - Get a new card for the player hand, add it, and update the points, etc */
//______________________________________________________________________________
  hit(handIndex) {

    /*  Get the current hand & the combined player hands */
    let fullHand = this.state.playerHands;
    let hand = fullHand[handIndex];

    /*  A bust hand cannot get a new card, so we stop the function here by returning
      if this hand is bust
   */
    if(hand.bust === true) {
      return;
    }

    /*  Get the next card from the game deck */
    let newCard = this.getCard();

    hand.naturalBlackjack = false; //Cannot be a natural blackjack with 2+ cards
    hand.points += newCard.points;

    /* Check for Ace for points changing reasons */
    if(newCard.value === 'A') {
      hand.softAces ++;
    }

    console.log(`Hit for Hand ${handIndex}. Added ${newCard.shortName}, Pts: ${hand.points} `);

    /* Reduce pts of Aces if necessary */
    while(hand.points > 21 && hand.softAces > 0) {
      hand.points -= 10;
      hand.softAces --;
      console.log(`Hardened Ace for Hand ${handIndex}, Pts: ${hand.points}`);
    }

    /* Add the actual card object */
    hand.cards.push(newCard);

    hand.splitDisabled = true; //Cannot split with more than 2 cards in hand
    hand.hintMessage = ""; //new hint will be needed for new situation, so reset
    hand.hintShown = false;

    /* Handle a bust hand */
    if(hand.points > 21) {
      hand.bust = true;
      hand.gameOverMessage = "Bust!";
      console.log(`Hand ${handIndex} is bust`);
      hand.hitDisabled = true;  //Disable buttons
      hand.standDisabled = true;
      hand.doubleDisabled = true;
      hand.hintDisabled = true;
      hand.surrenderDisabled = true;
      // hand.hintMessage = "";


      let active = this.state.activeHands - 1; //Track when dealer should play
      this.setState({activeHands: active});

      let bust = this.state.bustHands;
      bust++;
      this.setState({bustHands: bust});

      /* If there are no more hands being played, and some of them
        are not bust, check the dealer cards after a small time delay
      */
      if((active === 0) && (bust < this.state.totalHands)) {
        let timeout = setTimeout( this.dealerPlay, this.state.dealerStartDelay);
        this.setState({dealerTimeout: timeout});
      }

    }

    fullHand[handIndex] = hand; //Adding this hand back to group of player hands

    this.setState({playerHands: fullHand});

  }


/*  Double - get one more card, and stand (if not bust) */
//______________________________________________________________________________
  double(handIndex) {

    /* Get the correct hand by searching all the player hands for it */
    let hands = this.state.playerHands;
    let hand = hands[handIndex];

    hand.doubleDisabled = true; //Can only double once
    hand.splitDisabled = true; //Cannot split with 3 cards
    hand.hintDisabled = true; //Hint no longer needed as final card played
    hand.surrenderDisabled = true;
    hand.naturalBlackjack = false; //No natural blackjack with more than 2 cards
    hands[handIndex] = hand;
    this.setState({playerHands: hands});

    this.hit(handIndex);
    this.stand(handIndex);
  }


/*  Split - if both of the first cards have the same points, make
    a new hand from the second card of the original hand.
    Then deal new cards and add them to both hands.

    NB - Only a 2 card hand may be split  */
//______________________________________________________________________________
  split(handIndex) {

    let hands = this.state.playerHands;
    let handToChange = hands[handIndex];


    console.log(`Hand ${handIndex} split [${handToChange.cards[0].shortName}],`
      + ` [${handToChange.cards[1].shortName}]`);

    /*  Disallow change if hand has more than 2 cards */
    if(handToChange.cards.length > 2) {
      return;
    }

    /*  Remove the SECOND card from the original hand
    */
    let cardToMove = handToChange.cards.pop();

    /*  Get a new card for the original hand */
    let firstReplacementCard = this.getCard();

    /*  Re-make the first hand, with the new card replacement */
    handToChange = this.makeSingleHand( [handToChange.cards[0], firstReplacementCard],
      handIndex);

      console.log(`Hand ${handIndex} set to [${handToChange.cards[0].shortName},`
        + ` ${handToChange.cards[1].shortName}], Pts: ${handToChange.points}`);

    /*  Disable double after split if necessary */
    handToChange.doubleDisabled = !this.state.doubleAfterSplitAllowed;

    /*  Generate new hand for split card */
    let newHandOtherCard = this.getCard();
    let newHandNumber = (this.state.totalHands);
    let newHand = this.makeSingleHand( [cardToMove, newHandOtherCard], newHandNumber);

    /*  Change allowing doubles for the new hand, depending on game options */
    newHand.doubleDisabled = !this.state.doubleAfterSplitAllowed;


    /* Add new hand & updated original hand to total Hands object */
    hands.push(newHand);
    hands[handIndex] = handToChange;


    console.log(`Added Hand ${newHandNumber}, [${newHand.cards[0].shortName}, `
      + `${newHand.cards[1].shortName}] `
      + `Pts: ${newHand.points}`);
    console.log(`New hand naturalBlackjack: ${newHand.naturalBlackjack} `);

    let newTotalHands = (this.state.totalHands) + 1;
    let newActiveHands = (this.state.activeHands) + 1;

    this.setState({playerHands: hands});
    this.setState({totalHands: newTotalHands});
    this.setState({activeHands: newActiveHands});

  }


/*  Stand - stop playing for a specific hand.
    If all hands are not active, and some are not bust, the dealer should
    start playing, too. */
//______________________________________________________________________________
  stand(handIndex) {

    /* Get current hand from hands list */
    let hands = this.state.playerHands;
    let hand = hands[handIndex];

    /* No stand allowed if the hand is bust
      (button should be disabled anyway)
    */
    if(hand.bust === true) {
      return;
    }

    hand.hitDisabled = true;
    hand.splitDisabled = true;
    hand.standDisabled = true;
    hand.doubleDisabled = true;
    hand.hintDisabled = true;
    hand.surrenderDisabled = true;
    hand.hintMessage = "";

    let active = this.state.activeHands;
    active--;

    hands[handIndex] = hand;

    this.setState({playerHands: hands});
    this.setState({activeHands: active});

    let bust = this.state.bustHands;

    console.log(`Player stands on Hand ${handIndex}, Pts: ${hand.points}`);

    /*  Dealer should play if no hands are active after a small delay */
    if((active === 0) && (bust < this.state.totalHands)) {
      let timeout = setTimeout( this.dealerPlay, this.state.dealerStartDelay);
      this.setState({dealerTimeout: timeout});
    }

  }


/*  Surrender - give up on a hand */
//______________________________________________________________________________
  surrender(handIndex) {

    /*  Loop through all hands to find the hand that surrender was clicked on */
    let hands = this.state.playerHands;
    let hand = hands[handIndex];

    /*  Disable all the buttons */
    hand.hitDisabled = true;
    hand.doubleDisabled = true;
    hand.splitDisabled = true;
    hand.standDisabled = true;
    hand.hintDisabled = true;
    hand.surrenderDisabled = true;
    hand.hintMessage = "";

    /*  Record surrender so the hand isn't counted in the game over win checks */
    hand.surrendered = true;

    hand.gameOverMessage = "Surrendered."

    /*  Decrement the active hands number */
    let active = this.state.activeHands;
    active--;

    /*  Change the local hands variable, & set the playerHands state to it */
    hands[handIndex] = hand;
    this.setState({playerHands: hands});
    this.setState({activeHands: active});

    console.log(`Surrendered on Hand ${handIndex}, Pts: ${hand.points}`);
  }




/******************************************************************************

                          GAME END FUNCTIONS

/******************************************************************************/

/*  Play the game as the dealer after the player finished and has
       some hands which didn't go bust  */
//______________________________________________________________________________
  dealerPlay() {

    /*  Check if active player hands are all natural blackjacks -
        if that's the case and the dealer doesn't have a possible natural
        blackjack, there is no need for the dealer to play.
    */
    let playerHands = this.state.playerHands;
    let activeCount = 0;
    let naturalBlackjackCount = 0;

    playerHands.forEach((pHand, i) => {
        if(pHand.bust === false && pHand.surrendered === false) {
          activeCount++;
        }
        if(pHand.naturalBlackjack === true) {
          naturalBlackjackCount++;
        }
    });

    console.log(`Player has ${naturalBlackjackCount} natural blackjacks ` +
      `in ${activeCount} hands`);

    let hand = this.state.dealerHand;
    let dealerPts = hand.points;
    let softAces = hand.softAces;

    /*  If all the active player hands are natural blackjacks,
        and a dealer natural blackjack is not possible
        (visible card does not have a value of 10 or 11), just
        finish the game with all the active player hands winning
    */
    if( activeCount === naturalBlackjackCount && hand.shownPoints < 10) {
      console.log(`Dealer win impossible`);
      this.checkWinningHands();
    }
    else {

      this.setState({showDealerCards: true});


      console.log(`Dealer hand: [${hand.cards[0].shortName}, ${hand.cards[1].shortName}], `
        + `Pts: ${dealerPts}`
      );
      console.log(`Dealer has ${softAces} soft Aces`);
      console.log(`Dealer naturalBlackjack: ${hand.naturalBlackjack}`);

      /*  If all active player hands have natural blackjacks,
          and on revealing the whole dealer hand the dealer doesn't,
          there is no need for the dealer to hit
      */
      if(activeCount === naturalBlackjackCount && hand.naturalBlackjack === false) {
        console.log(`Dealer win impossible`);
        this.checkWinningHands();
        return;
      }


      /*  Use the dealer hit function if dealer should play
          after a slight timeout delay
      */
      if((dealerPts < 17) || (dealerPts === 17 && softAces > 0)) {

        let hitTimeout = setTimeout(this.dealerHit, this.state.dealerDealDelay);
        this.setState({dealerHitTimeout: hitTimeout});

      }
      /*  Otherwise, just check the winner without the dealer getting any
          new cards
      */
      else {

        let timeout = setTimeout(this.checkWinningHands, this.state.winCheckDelay);
        this.setState({winCheckTimeout: timeout});

      }

    }

  }


/*  Hit for the dealer. Using a function for setTimeout delays
    so the dealer game updates after a short pause, so cards come out one by one
 */
//______________________________________________________________________________
  dealerHit() {

    let hand = this.state.dealerHand;
    let dealerPts = hand.points;
    let softAces = hand.softAces;

    let nextCard = this.getCard();
    hand.cards.push(nextCard);

    if(nextCard.value === "A") {
      softAces++;
      hand.softAces = softAces;
      console.log(`Soft Ace added for dealer`);
    }

    dealerPts += nextCard.points;
    console.log(`Dealer dealt ${nextCard.shortName}, Hand pts: ${dealerPts}`);

    while(dealerPts > 21 && softAces > 0) {
      dealerPts -= 10;
      softAces--;
      hand.softAces = softAces;
      console.log(`Dealer Ace hardened, pts ${dealerPts}, ${softAces} soft aces left`);
    }

    hand.points = dealerPts;
    this.setState({dealerHand: hand});

    /*  Get a new card by recursively calling this function */
    if((dealerPts < 17) || (dealerPts === 17 && softAces > 0)) {

      let hitTimeout = setTimeout(this.dealerHit, this.state.dealerDealDelay);
      this.setState({dealerHitTimeout: hitTimeout});

    }
    /*  Stop & check winners if dealer went bust */
    else if (dealerPts > 21) {

      hand.bust = true;
      hand.gameOverMessage = "Dealer Bust!";
      console.log(`Dealer is bust with ${dealerPts} pts`);
      this.setState({dealerHand: hand});

      let checkDelay = this.state.winCheckDelay;
      let dealerWait = setTimeout(this.dealerFinish, checkDelay);
      this.setState({winCheckTimeout: dealerWait});

    }
    /*  Stop & check winners if dealer no longer playing (hard 17 hand) */
    else {

      console.log(`Dealer finished playing with ${dealerPts} pts`);

      let checkDelay = this.state.winCheckDelay;
      let dealerWait = setTimeout(this.dealerFinish, checkDelay);
      this.setState({winCheckTimeout: dealerWait});

    }

  }


/*  Tidy up after the dealer stops playing - clear timeouts & then check winners
 */
//______________________________________________________________________________
  dealerFinish() {

    let standTimeout = this.state.winCheckDelay;
    clearTimeout(standTimeout);
    this.setState({winCheckDelay: standTimeout});

    let hitTimeout = this.state.dealerHitTimeout;
    clearTimeout(hitTimeout);
    this.setState({dealerHitTimeout: hitTimeout});

    this.checkWinningHands();

  }


/*  Check which hands won, if some hands are not already bust */
//______________________________________________________________________________
  checkWinningHands() {

    let timeout = clearTimeout(this.state.winCheckTimeout);
    this.setState({winCheckTimeout: timeout});

    /*  Get the dealer hand */
    let dHand = this.state.dealerHand;

    /*  Get the player hands array */
    let hands = this.state.playerHands;

    let dealerPts = dHand.points;

    /*  Loop through all the player hands, and check each of them for
        a win compared to the dealer's points
    */
    hands.forEach((hand, i) => {
      /*  Only check hands that aren't bust */
      if(hand.bust === false && hand.surrendered === false) {

        /*  Check case 1: player pts are better */
        if(hand.points > dealerPts) {
          if(hand.naturalBlackjack) {
            hand.gameOverMessage = "Hand Won! Blackjack!";
            console.log( `Player hand ${hand.number} wins with Natural Blackjack` );
          } else {
            hand.gameOverMessage = "Hand Won!";
            console.log( `Player hand ${hand.number} wins on points` );
          }
          hand.won = true;
        }

        /*  Check case 2: same pts */
        else if(hand.points === dealerPts ) {

          /*  2a: player has a Natural Blackjack */
          if(hand.naturalBlackjack === true) {
            /*  2a-1 dealer doesn't also have a Natural Blackjack,
                so player wins
             */
            if(dHand.naturalBlackjack === false) {
              hand.gameOverMessage = "Hand Won! Blackjack!";
              hand.won = true;
              console.log( `Player hand ${hand.number} wins with Natural Blackjack` );
            }
            /*  2a-2 dealer also has a Natural Blackjack, so no winner */
            else {
            hand.gameOverMessage = "Push. Blackjacks.";
            hand.push = true;
            console.log( `Player hand ${hand.number} push on Natural Blackjack` );
            }

          }
          /*  2b: player doesn't have a Natural Blackjack */
          else {
            /*  2b-1 dealer has a Natural Blackjack, so dealer wins */
            if(dHand.naturalBlackjack === true) {
              hand.gameOverMessage = "Hand Lost. Dealer Blackjack.";
              console.log( `Player hand ${hand.number} loses with dealer Natural Blackjack` );
            }
            /*  2b-2 nobody has a Natural Blackjack, no winner */
            else {
              hand.gameOverMessage = "Push.";
              hand.push = true;
              console.log( `Player hand ${hand.number} push with dealer` );
            }
          }
      }
      /*  Check case 3: player pts are worse */
      else {
        /*  If the dealer is not bust, the player hand loses */
        if(dHand.bust === false) {
          if(dHand.naturalBlackjack === true) {
            hand.gameOverMessage = "Hand Lost. Dealer Blackjack.";
            console.log( `Player hand ${hand.number} loses on points to dealer Natural Blackjack` );
          }
          else {
            hand.gameOverMessage = "Hand Lost.";
            console.log( `Player hand ${hand.number} loses on points` );
          }
        }
        /*  If the dealer is bust, the player hand wins
            (player hand was already checked for not being bust)
        */
        else {
          hand.gameOverMessage = "Hand Won! Dealer Bust!";
          hand.won = true;
          console.log( `Player hand ${hand.number} wins as dealer is bust` );
        }
      }
    }});

    this.setState({playerHands: hands});

  }




/******************************************************************************

                          BUTTONS AND OPTIONS HANDLERS

/******************************************************************************/

/*  Reset & restart the game */
//_____________________________________________________________________________
  newGame() {

    /*  Just in case, reset all the timeouts */
    let timeout = clearTimeout(this.state.dealerTimeout);
    this.setState({dealerTimeout: timeout});

    let hitTimeout = clearTimeout(this.state.dealerHitTimeout);
    this.setState({dealerHitTimeout: hitTimeout});

    let winTimeout = clearTimeout(this.state.winCheckTimeout);
    this.setState({winCheckTimeout: winTimeout});



    let firstHands = this.makeFirstHands(); //Deal new hands

    if(this.state.gameStarted === false) {
      this.setState({gameStarted: true});
    }

    /*  Player hand stored as an array so more hands can be added later */
    this.setState ({playerHands: [firstHands.player]});
    this.setState ({dealerHand: firstHands.dealer});
    this.setState ({activeHands: 1});
    this.setState ({totalHands: 1});
    this.setState ({showDealerCards: false});
    this.setState ({bustHands: 0});

    console.log(`----------`);

    console.log(`Dealer dealt: [? ` +
      `, ${firstHands.dealer.cards[1].shortName}] Pts shown: ${firstHands.dealer.shownPoints}`);

    console.log(`Player dealt: [${firstHands.player.cards[0].shortName}` +
      `, ${firstHands.player.cards[1].shortName}] Pts: ${firstHands.player.points}`);

    console.log(`Player has ${firstHands.player.softAces} soft aces`);


    console.log(`Player naturalBlackjack: ${firstHands.player.naturalBlackjack}`);

    }


/*  Choose whether Doubles are allowed in the game */
//______________________________________________________________________________
    selectDoubles() {
      let currentDoubleAllowed = this.state.doubleAllowed;

      /*  Reverse the current choice because this function runs when
          the checkbox is changed, so it will be the opposite of
          the previous choice
      */
      currentDoubleAllowed = !currentDoubleAllowed;

      this.resetAllHints();
      this.setState({doubleAllowed: currentDoubleAllowed});
    }


/*  Choose whether Surrenders are allowed in the game */
//______________________________________________________________________________
    selectSurrenders() {
      let currentSurrenderAllowed = this.state.surrenderAllowed;

      /*  Boolean opposite - True -> False & vice versa */
      currentSurrenderAllowed = !currentSurrenderAllowed;

      this.resetAllHints();
      this.setState({surrenderAllowed: currentSurrenderAllowed});
    }


/*  Choose whether Splits are allowed in the game */
//______________________________________________________________________________
    selectSplits() {
      let currentSplitAllowed = this.state.splitAllowed;

      /*  Boolean opposite - True -> False & vice versa */
      currentSplitAllowed = !currentSplitAllowed;

      this.resetAllHints();
      this.setState({splitAllowed: currentSplitAllowed});
    }


/*  Choose whether Double after Split is allowed in the game */
//______________________________________________________________________________
    selectDoubleAfterSplit() {
      let currentDblAfterSplitAllowed = this.state.doubleAfterSplitAllowed;

      currentDblAfterSplitAllowed = !currentDblAfterSplitAllowed;

      this.resetAllHints();
      this.setState({doubleAfterSplitAllowed: currentDblAfterSplitAllowed});
    }


/*  Render the game after gameplay options were set (Surrender allowed etc) */
//______________________________________________________________________________
    start() {
      console.log(`*** Showing the game`);
      // console.log(`Split allowed: ${this.state.splitAllowed}`);
      console.log(`*** Double allowed: ${this.state.doubleAllowed}`);
      console.log(`*** Double after Split allowed: ${this.state.doubleAfterSplitAllowed}`);
      console.log(`*** Surrender allowed: ${this.state.surrenderAllowed}`);

      // let choice = true;
      this.setState({optionsChosen: true});

      if(this.state.gameStarted === false) {
        this.newGame();
      }
    }


/*  For changing Options during the game
    - sets optionsChosen to false which makes the options choice
    checkboxes be shown again and the game itself hidden  */
//______________________________________________________________________________
    optionsChange() {

      this.setState({optionsChosen: false});

    }


/*  Show or hide a hint for a hand.  */
//______________________________________________________________________________
    toggleHint(handIndex) {

      /*  Find the current hand */
      let hands = this.state.playerHands;
      let hand = hands[handIndex];

      /*  Reverse whether the hint is shown - i.e. change true to false and
          vice versa
      */
      let hintVisible = hand.hintShown;
      hintVisible = !hintVisible;

      /*  Store this hand's hint display choice */
      hand.hintShown = hintVisible;

      /*  Show the hint or hide it by just making a blank string */
      if(hintVisible === true) {

        let doublePossible = !hand.doubleDisabled && this.state.doubleAllowed;
        let dblAfterSplitPossible = !hand.doubleDisabled && this.state.doubleAfterSplitAllowed;

       /* Get a hint message for the hand */
       let playerHint = getHint(this.state.dealerHand,
                                hand,
                                doublePossible,
                                dblAfterSplitPossible,
                                this.state.surrenderAllowed,);

        hand.hintMessage = playerHint.hintMessage;

        console.log(`Hint for Hand ${handIndex}: "${hand.hintMessage}"`);

      }
      else {
        hand.hintMessage = "";

        console.log(`Hiding hint for Hand ${handIndex}`);
      }
      hands[handIndex] = hand;
      this.setState({playerHands: hands});
    }


/*  Reset hint messages if game options changed  */
//______________________________________________________________________________
  resetAllHints() {

    let hands = this.state.playerHands;

    hands.forEach((hand, i) => {
      hand.hintShown = false;
      hand.hintMessage = "";
    });

    this.setState({playerHands: hands});

  }




/******************************************************************************

                              RENDER

/******************************************************************************/

//______________________________________________________________________________
  render() {

    const newGameClick = () => {this.newGame()};
    const optionsClick = () => {this.optionsChange()};

    return(
      <div id="gameContainerGP">



        <div id="gameInterfaceGP">

        {this.state.optionsChosen === false &&
          <div id="settingsGP">

            <h2>Game Options</h2>

            <>
            <input type="checkbox" id="doubleChoiceGP"
              checked={this.state.doubleAllowed}
              onChange={this.selectDoubles}
            />
              <label onClick={this.selectDoubles}>Doubles</label>&nbsp;&nbsp;
            </>

            {this.state.doubleAllowed === true&&
              <>
              <br />
              <input type="checkbox" id="doubleSplitChoiceGP"
                checked={this.state.doubleAfterSplitAllowed}
                onChange={this.selectDoubleAfterSplit}
              />
                <label onClick={this.selectDoubleAfterSplit}>Double After Split</label>&nbsp;
              </>
            }

            <div>
            <input type="checkbox" id="surrenderChoiceGP"
              checked={this.state.surrenderAllowed}
              onChange={this.selectSurrenders}
            />
              <label onClick={this.selectSurrenders}>Surrenders</label>
            </div>


            <br />

            <button id="gameChoiceBtnGP" className="gameplayBtnGP" onClick={this.start}>Play</button>
          </div>
        }

        {this.state.optionsChosen === true &&
          <div id="gameGP">

            <div id="gameOptionsGP">
              <button className="gameplayBtnGP" onClick={newGameClick}>New Game</button>
              {this.state.activeHands > 0 &&
                <button className="gameplayBtnGP" onClick={optionsClick}>Options</button>
              }
            </div>

            {this.state.gameStarted === true &&
              <>
              <div id="dealerGameGP">
                {this.state.showDealerCards === true &&
                  this.displayWholeDealerHand()
                }
                {this.state.showDealerCards === false &&
                  this.displayHiddenDealerHand()
                }
              </div>

              <div id="playerGameGP">
                {this.displayAllPlayerHands()}
              </div>

              <div id="pokerChipsGP">
                
              </div>


              <div id="handStatsGP">

              </div>
              </>
            }
          </div>
        }

        </div>
      </div>
    );
  }


}

export default Gameplay;
