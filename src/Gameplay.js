import React from 'react';
import {cardDeck, makeMultiDecks, shuffleDeck} from './card.js';
import {getHint} from './Hint.js';
import './Gameplay.css';


const blankCard =  "./cardImages/200px-Card_back_05.svg.png";



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

    }

    this.start = this.start.bind(this);
    this.selectSplits = this.selectSplits.bind(this);
    this.selectDoubles = this.selectDoubles.bind(this);
    this.selectSurrenders = this.selectSurrenders.bind(this);
    this.selectDoubleAfterSplit = this.selectDoubleAfterSplit.bind(this);

  }




/******************************************************************************

                        SETUP FUNCTIONS

/******************************************************************************/

//______________________________________________________________________________
/*  Get a card from the game deck */
  getCard() {

    let deckForGame = this.state.gameDeck;

    /* Make a new deck if the end is reached */
    if(deckForGame.length <= 0) {
      deckForGame = makeMultiDecks(8);
      shuffleDeck(deckForGame);
    }

    /*  Remove the first card from the array */
    let nextCard = deckForGame.shift();

    this.setState({gameDeck: deckForGame});
    return nextCard;

  }


//______________________________________________________________________________
/* Calculate the points of a hand by looping through all cards and
  getting the total points. Should probably use .reduce() function
  */
  getCardPoints(hand) {
    let total = 0;
    for(let card of hand) {
      total += card.points;
    }
    return total;
  }


//______________________________________________________________________________
/*  Check if 2 cards are a perfect Blackjack
    i.e. an Ace and a Face card
    - A perfect Blackjack will win over another 21 point hand
    NB This function should only be called if the hand has only
    two cards in it
*/
  checkNaturalBlackjack(card1, card2) {
    if( (card1.points + card2.points) !== 21 ) {
      return false; //blackjack must be exactly 21 points
    }
    if( (card1.value === "A") && (card2.value !== 10) ) {
      return true;  //if one card is ace, the other card must be worth 10 to
                    //be 21 pts. so if the other card is not a number 10 card,
                    //it must be a K, Q, or J.
    }
    else if( (card1.value !== 10) && (card2.value === "A") ) {
      return true;
    }
    else {
      return false;
    }
  }


//______________________________________________________________________________
/*  Make a generic hand object for with 2 given cards in an array,
    the hand number and a boolean to toggle a dealer/player hand.

    A dealer card doesn't need a handNumber because it's not used since there
    is always only one dealer hand. When calling this function -1 will be used as
    a placeholder for this.
 */
  makeSingleHand(cards, handNumber) {

    /* A dealer hand is given the number -1, so any positive hand number
      means a player's hand. This is important to check because the hands
      have slightly different Object properties
    */
    let forPlayer = (handNumber >= 0);

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

    /*  Disable the split button if the two cards have different pts */
    let disabledSplit = (cards[0].points !== cards[1].points);

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


//______________________________________________________________________________
/*  Deal first hands for the player and dealer */
  makeFirstHands() {

    let firstHands = [];

    /*  Deal cards for Player & Dealer */
    let playerCard1 = this.getCard();
    let dealerCard1 = this.getCard();

     let playerCard2 = this.getCard();
     let dealerCard2 = this.getCard();

     /* Use function to make the start hands for both */
    let playerFirstHand = this.makeSingleHand( [playerCard1, playerCard2], 0);
    let dealerFirstHand = this.makeSingleHand( [dealerCard1, dealerCard2], -1)

    firstHands.dealer = dealerFirstHand;
    firstHands.player = playerFirstHand;

    return firstHands; //Returns an array of JS objects containing the hand info
  }




/******************************************************************************

                          DISPLAY FUNCTIONS

/******************************************************************************/

//______________________________________________________________________________
/*  Show every player hand using the .map() function */
  displayAllPlayerHands() {

    let hands =
    this.state.playerHands.map( (hand, index) => (
        <div id="allPlayerHands" key={index} className="playerShow w3-container">


        {hand.cards.map( (card, index) => (
            <img
              key={index}
              className="cardDisplay  w3-center w3-animate-right"
              src={card.imagePath}
              alt={card.shortName}
            />
        ))}

          <div className="handStatus">
            <span id="playerPoints">Player Points: {hand.points}</span>
            <span id="handStatus"> &nbsp; {hand.gameOverMessage}</span>
          </div>

          <div id="playerButtons">

            {hand.hitDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.hitDisabled}
                onClick={() => {this.hit(hand.number)}}>
                  Hit
              </button>
            }

            {hand.standDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.standDisabled}
                onClick={() => {this.stand(hand.number)}}>
                  Stand
              </button>
            }

            { this.state.doubleAllowed && hand.doubleDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.doubleDisabled}
                onClick={() => {this.double(hand.number)}}>
                  Double
              </button>
            }

            {this.state.splitAllowed && hand.splitDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.splitDisabled}
                onClick={() => {this.split(hand.number)}}>
                  Split
              </button>
            }

            {this.state.surrenderAllowed && hand.surrenderDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.surrenderDisabled}
                onClick={() => {this.surrender(hand.number)}}>
                  Surrender
              </button>
            }

            {hand.hintDisabled === false &&
              <button
                className="gameplayBtn"
                disabled={hand.hintDisabled}
                onClick={() => {this.toggleHint(hand.number)}}>
                  Hint
              </button>
            }

          </div>

          <div id="hint" className="handStatus">{hand.hintMessage}</div>

          <br />
        </div>
      ));

      return hands;
  }


//______________________________________________________________________________
/*  Show the first dealer hand in the game, with one card hidden */
  displayHiddenDealerHand() {
    let shownCard = this.state.dealerHand.cards[1];
    return (
      <div id="dealerCards" className="dealerShow">
      <div id="dealerPoints">Dealer Points: {this.state.dealerHand.shownPoints}</div>
        <img className="cardDisplay" src={blankCard} alt="back of card" />
        <img className="cardDisplay" src={shownCard.imagePath} alt={shownCard.shortName} />
      </div>
    );
  }


//______________________________________________________________________________
/*  Show both of the first 2 cards of the dealer, if the player is finished
    and not bust for every hand
 */
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
          "cardDisplay  w3-center w3-animate-right" :
          "cardDisplay"
        }
        src={card.imagePath}
        alt={card.shortName}
      />
    )
    );

    let displayHTML =
      <div id="dealerHand" className="dealerShow w3-container">
        <div id="dealerPoints">
          Dealer Points: {this.state.dealerHand.points}&nbsp;
          {this.state.dealerHand.gameOverMessage}
        </div>
        {cards}
      </div>

    return displayHTML;
  }




/******************************************************************************

                          GAMEPLAY FUNCTIONS

/******************************************************************************/

//______________________________________________________________________________
/*  Hit - Get a new card for the player hand, add it, and update the points, etc */
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

    hand.naturalBlackjack = false; //Cannot be a perfect blackjack with 2+ cards
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
        are not bust, check the dealer cards
      */
      if((active === 0) && (bust < this.state.totalHands)) {

        this.dealerPlay();
      }

    }

    fullHand[handIndex] = hand; //Adding this hand back to group of player hands

    this.setState({playerHands: fullHand});

  }


//______________________________________________________________________________
/*  Double - get one more card, and stand (if not bust) */
  double(handIndex) {

    /* Get the correct hand by searching all the player hands for it */
    let hands = this.state.playerHands;
    let hand = hands[handIndex];

    hand.doubleDisabled = true; //Can only double once
    hand.splitDisabled = true; //Cannot split with 3 cards
    hand.hintDisabled = true; //Hint no longer needed as final card played
    hand.surrenderDisabled = true;
    hand.naturalBlackjack = false; //No perfect blackjack with more than 2 cards
    hands[handIndex] = hand;
    this.setState({playerHands: hands});

    this.hit(handIndex);
    this.stand(handIndex);
  }


//______________________________________________________________________________
/*  Split - if both of the first cards have the same points, make
    a new hand from the second card of the original hand.
    Then deal new cards and add them to both hands.

    NB - Only a 2 card hand may be split
*/
  split(changeIndex) {

    let hands = this.state.playerHands;
    let handToChange = hands[changeIndex];


    console.log(`Hand ${changeIndex} split [${handToChange.cards[0].shortName},`
      + ` ${handToChange.cards[1].shortName}]`);

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
      changeIndex);

      console.log(`Hand ${changeIndex} set to [${handToChange.cards[0].shortName},`
        + ` ${handToChange.cards[1].shortName}]`);

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
    hands[changeIndex] = handToChange;


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


//______________________________________________________________________________
/*  Stand - stop playing for a specific hand.
    If all hands are not active, and some are not bust, the dealer should
    start playing, too.
*/
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

    /*  Dealer should play if no hands are active */
    if((active === 0) && (bust < this.state.totalHands)) {
      this.dealerPlay();
    }

  }


//______________________________________________________________________________
/*  Surrender - give up on a hand */
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

//______________________________________________________________________________
/*  Play the game as the dealer after the player finished and has
       some hands which didn't go bust
*/
  dealerPlay() {

    this.setState({showDealerCards: true});

    let hand = this.state.dealerHand;
    let dealerPts = hand.points;
    let softAces = hand.softAces;

    console.log(`Dealer hand: [${hand.cards[0].shortName}, ${hand.cards[1].shortName}], `
      + `Pts: ${dealerPts}`
    );
    console.log(`Dealer has ${softAces} soft Aces`);
    console.log(`Dealer naturalBlackjack: ${hand.naturalBlackjack}`);

      while((dealerPts < 17) || (dealerPts === 17 && softAces > 0)) {

        /*  Get a new card and add it to the dealer's hand */
        let nextCard = this.getCard();
        hand.cards.push(nextCard);

        if(nextCard.value === "A") {
          softAces++;
          hand.softAces = softAces;
          console.log(`Soft Ace added for dealer`);
        }
        dealerPts += nextCard.points;
        console.log(`Dealer dealt ${nextCard.shortName}, Hand pts: ${dealerPts}`);
        while(dealerPts >= 17 && softAces > 0) {
          dealerPts -= 10;
          softAces--;
          hand.softAces = softAces;
          console.log(`Dealer Ace hardened, pts ${dealerPts}`);
        }

        hand.points = dealerPts;
        this.setState({dealerHand: hand});
      }

      /*  Check if dealer went bust */
      if(dealerPts > 21) {
        hand.bust = true;
        hand.gameOverMessage = "Bust!";
        console.log(`Dealer is bust with ${dealerPts} pts`);
        this.setState({dealerHand: hand});
      }

      /*  Dealer play is now finished - Find the winners */
      this.checkWinningHands();

  }


//______________________________________________________________________________
/*  Check which hands won, if some hands are not already bust */
  checkWinningHands() {

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
      if(hand.bust !== true && hand.surrendered !== true) {

        /*  Check case 1: player pts are better */
        if(hand.points > dealerPts) {
          hand.gameOverMessage = "Hand Won!";
          console.log( `Player hand ${hand.number} wins on points` );
        }

        /*  Check case 2: same pts */
        else if(hand.points === dealerPts ) {

          /*  2a: player has a Perfect Blackjack */
          if(hand.naturalBlackjack === true) {
            /*  2a-1 dealer doesn't also have a Perfect Blackjack,
                so player wins
             */
            if(dHand.naturalBlackjack === false) {
              hand.gameOverMessage = "Hand Won! Perfect Blackjack!";
              console.log( `Player hand ${hand.number} wins with Perfect Blackjack` );
            }
            /*  2a-2 dealer also has a Perfect Blackjack, so no winner */
            else {
            hand.gameOverMessage = "Push. Perfect Blackjacks.";
            console.log( `Player hand ${hand.number} push on Perfect Blackjack` );
            }

          }
          /*  2b: player doesn't have a Perfect Blackjack */
          else {
            /*  2b-1 dealer has a Perfect Blackjack, so dealer wins */
            if(dHand.naturalBlackjack === true) {
              hand.gameOverMessage = "Hand Lost. Dealer wins with Perfect Blackjack";
              console.log( `Player hand ${hand.number} lost with dealer Perfect Blackjack` );
            }
            /*  2b-2 nobody has a Perfect Blackjack, no winner */
            else {
              hand.gameOverMessage = "Push.";
              console.log( `Player hand ${hand.number} push with dealer` );
            }
          }
      }
      /*  Check case 3: player pts are worse */
      else {
        /*  If the dealer is not bust, the player hand loses */
        if(dHand.bust === false) {
          hand.gameOverMessage = "Hand Lost.";
          console.log( `Player hand ${hand.number} loses on points` );
        }
        /*  If the dealer is bust, the player hand wins
            (player hand was already checked for not being bust)
        */
        else {
          hand.gameOverMessage = "Hand Won! Dealer Bust!";
        }
      }
    }});

    this.setState({playerHands: hands});

  }




/******************************************************************************

                          BUTTONS AND OPTIONS HANDLERS

/******************************************************************************/

//______________________________________________________________________________
/*  Reset & restart the game */
  newGame() {

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

    console.log(`Dealer dealt: [ ? ` +
      `, ${firstHands.dealer.cards[1].shortName}] Pts shown: ${firstHands.dealer.shownPoints}`);

    console.log(`Dealer has ${firstHands.dealer.softAces} soft aces`);

    console.log(`Player dealt: [${firstHands.player.cards[0].shortName}` +
      `, ${firstHands.player.cards[1].shortName}] Pts: ${firstHands.player.points}`);

    console.log(`Player has ${firstHands.player.softAces} soft aces`);


    console.log(`Player naturalBlackjack: ${firstHands.player.naturalBlackjack}`);

    }


//______________________________________________________________________________
/*  Choose whether Doubles are allowed in the game */
    selectDoubles() {
      let currentDoubleAllowed = this.state.doubleAllowed;

      /*  Reverse the current choice because this function runs when
          the checkbox is changed, so it will be the opposite of
          the previous choice
      */
      currentDoubleAllowed = !currentDoubleAllowed;
      this.setState({doubleAllowed: currentDoubleAllowed});
    }


//______________________________________________________________________________
/*  Choose whether Surrenders are allowed in the game */
    selectSurrenders() {
      let currentSurrenderAllowed = this.state.surrenderAllowed;

      /*  Boolean opposite - True -> False & vice versa */
      currentSurrenderAllowed = !currentSurrenderAllowed;
      this.setState({surrenderAllowed: currentSurrenderAllowed});
    }


//______________________________________________________________________________
/*  Choose whether Splits are allowed in the game */
    selectSplits() {
      let currentSplitAllowed = this.state.splitAllowed;

      /*  Boolean opposite - True -> False & vice versa */
      currentSplitAllowed = !currentSplitAllowed;
      this.setState({splitAllowed: currentSplitAllowed});
    }


//______________________________________________________________________________
/*  Choose whether Double after Split is allowed in the game */
    selectDoubleAfterSplit() {
      let currentDblAfterSplitAllowed = this.state.doubleAfterSplitAllowed;

      currentDblAfterSplitAllowed = !currentDblAfterSplitAllowed;
      this.setState({doubleAfterSplitAllowed: currentDblAfterSplitAllowed});
    }


//______________________________________________________________________________
/*  Render the game after gameplay options were set (Surrender allowed etc) */
    start() {
      console.log(`Showing the game`);
      // console.log(`Split allowed: ${this.state.splitAllowed}`);
      console.log(`Double allowed: ${this.state.doubleAllowed}`);
      console.log(`Double after Split allowed: ${this.state.doubleAfterSplitAllowed}`);
      console.log(`Surrender allowed: ${this.state.surrenderAllowed}`);

      // let choice = true;
      this.setState({optionsChosen: true});

      if(this.state.gameStarted === false) {
        this.newGame();
      }
    }


//______________________________________________________________________________
/*  For changing Options during the game
    - sets optionsChosen to false which makes the options choice
    checkboxes be shown again and the game itself hidden
*/
    optionsChange() {
      this.setState({optionsChosen: false});
    }


//______________________________________________________________________________
/*  Show or hide a hint for a hand.  */
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

       /* Get a hint message for the hand */
       let playerHint = getHint(this.state.doubleAllowed, this.state.doubleAfterSplitAllowed,
        this.state.surrenderAllowed, this.state.dealerHand, hand);

        hand.hintMessage = playerHint.hintMessage;

      }
      else {
        hand.hintMessage = "";
      }
      hands[handIndex] = hand;
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
      <div id="gameContainer">



        <div id="gameInterface">

        {this.state.optionsChosen === false &&
          <div id="settings">

            <h2>Game Options</h2>

            <input type="checkbox" id="doubleChoice"
              checked={this.state.doubleAllowed}
              onChange={this.selectDoubles}
            />
              <label>Double Allowed</label>&nbsp;&nbsp;


            <input type="checkbox" id="surrenderChoice"
              checked={this.state.surrenderAllowed}
              onChange={this.selectSurrenders}
            />
              <label>Surrender Allowed</label>

            {this.state.doubleAllowed === true&&
              <>
              <br />
              <input type="checkbox" id="doubleSplitChoice"
                checked={this.state.doubleAfterSplitAllowed}
                onChange={this.selectDoubleAfterSplit}
              />
                <label>Double After Split</label>&nbsp;
              </>
            }
            <br />

            <button id="gameChoiceBtn" className="gameplayBtn" onClick={this.start}>Play</button>
          </div>
        }

        {this.state.optionsChosen === true &&
          <div id="game">

            <div id="gameOptions">
              <button className="gameplayBtn" onClick={newGameClick}>New Game</button>
              <button className="gameplayBtn" onClick={optionsClick}>Options</button>
            </div>

            {this.state.gameStarted === true &&
              <>
              <div id="dealerGame">
                {this.state.showDealerCards === true &&
                  this.displayWholeDealerHand()
                }
                {this.state.showDealerCards === false &&
                  this.displayHiddenDealerHand()
                }
              </div>

              <div id="playerGame">
                {this.displayAllPlayerHands()}
              </div>

              <div id="handStats">
                Active hands: {this.state.activeHands}&nbsp;
                Total hands: {this.state.totalHands}
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
