import React from 'react';
import {cardDeck} from './card.js';


const deckForGame = cardDeck;
const blankCard =  "./cardImages/200px-Card_back_05.svg.png";
const nextChoice = "";


class Game extends React.Component {

  constructor(props) {

    super(props);
const answer = this.props.answer;
const setChoice = this.props.setChoice;
const setAnswer = this.props.setChoice;
const Stand = "Stand";
const Hit = "Hit";
const Split = "Split";
     /*  Deal cards for Player & Dealer */

    let playerCard1 = this.getCard();
    let dealerCard1 = this.getCard();

    let playerCard2 = this.getCard();
    let dealerCard2 = this.getCard();

    /*  Check how many Aces the player has */
    let playerAceTotal = 0;
    if(playerCard1.value === "A") {
      playerAceTotal++;
    }
    if(playerCard2.value === "A") {
      playerAceTotal++;
    }

    /*  Get the points for the first player hand
        and change them if there are 2 Aces
    */
    let playerFirstPoints = this.getCardPoints([playerCard1, playerCard2]);
    if(playerFirstPoints > 21) {
        playerFirstPoints -= 10;
        playerAceTotal--;
    }

    /*  Points for dealer */
    let dealerFirstPoints = dealerCard2.points;
    let dealerTotalPoints = dealerCard1.points + dealerCard2.points;

    let dealerAceTotal = 0;
    if(dealerCard1.value === "A") {
      dealerAceTotal++;
    }
    if (dealerCard2.value === "A") {
      dealerAceTotal++;
    }

    if(dealerTotalPoints > 21) {
      dealerTotalPoints -= 10;
      dealerAceTotal--;
    }
    if(dealerFirstPoints==2 && (playerFirstPoints>=13 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==3 && (playerFirstPoints>=13 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==4 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==5 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==6 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints>=7 && (playerFirstPoints>=17 && playerFirstPoints<=21))  //needs equivalent for jack, queen,king
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else
    {
      setAnswer(Hit);
      this.setState({answer: Hit});
      console.log(answer);
    }

    
     

     /*  Check if either hand is a perfect blackjack (Ace & Face card) */
    let dealerPerfectBlackjack = this.checkPerfectBlackjack(dealerCard1, dealerCard2);
    let playerPerfectBlackjack = this.checkPerfectBlackjack(playerCard1, playerCard2);

    /*  Disable the split button if the two cards have different pts */
    let disabledSplit = (playerCard1.points !== playerCard2.points);

     /*  Create hands as JavaScript objects */
    let dealerFirstHand = {
      "cards": [dealerCard1, dealerCard2],
      "softAces": dealerAceTotal,
      "points": dealerTotalPoints,
      "shownPoints": dealerFirstPoints,
      "bust": false,
      "gameOverMessage": "",
      "perfectBlackjack": dealerPerfectBlackjack,
    }

    let playerFirstHand = {
      "number": 0,
      "cards": [playerCard1, playerCard2],
      "softAces": playerAceTotal,
      "points": playerFirstPoints,
      "bust": false,
      "gameOverMessage": "",
      "hintMessage": "",
      "hintShown": false,
      "splitDisabled": disabledSplit,
      "hitDisabled": false,
      "standDisabled": false,
      "doubleDisabled": false,
      "hintDisabled": false,

      "perfectBlackjack": playerPerfectBlackjack,
    }
    if (this.props.currentQ>5){
      this.state = {

        gameDeck: cardDeck,

       // playerHands: [playerFirstHand], //a nested array
          playerHands: this.props.playerAnswers[0],
        //dealerHand: dealerFirstHand,
        dealerHand: this.props.dealerAnswers[0],

        activeHands: 1,
        totalHands: 1,
        bustHands: 0,

        showDealerCards: false, //hide one card for the dealer

        playerHandJSX: '',
  }

console.log(this.state.playerHands);
console.log(this.state.dealerHand);
    }

    this.state = {

          gameDeck: cardDeck,

          playerHands: [playerFirstHand], //a nested array

          dealerHand: dealerFirstHand,

          activeHands: 1,
          totalHands: 1,
          bustHands: 0,

          showDealerCards: false, //hide one card for the dealer

          playerHandJSX: '',
    }

  

    
    console.log({playerFirstHand});
    console.log(`Dealer dealt: [ ? ` +
      `, ${this.state.dealerHand.cards[1].shortName}] Pts shown: ${this.state.dealerHand.shownPoints}`);

    console.log(`Dealer has ${this.state.dealerHand.softAces} soft aces`);

    console.log(`Player dealt: [${this.state.playerHands[0].cards[0].shortName}` +
      `, ${this.state.playerHands[0].cards[1].shortName}] Pts: ${this.state.playerHands[0].points}`);

    console.log(`Player has ${this.state.playerHands[0].softAces} soft aces`);

    console.log(`Dealer perfectBlackjack: ${dealerPerfectBlackjack}`);
    console.log(`Player perfectBlackjack: ${playerPerfectBlackjack}`);
    
  }

  /*  Get a card from the game deck */
  getCard() {

    /*  Remove the first card from the array */
    if(deckForGame.length > 0) {
      let nextCard = deckForGame.shift();
      return nextCard;
    }

    // TODO: handle the card deck being empty
  }

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

  /*  Check if 2 cards are a perfect Blackjack
      i.e. an Ace and a Face card
      - A perfect Blackjack will win over another 21 point hand 
      NB This function should only be called if the hand has only
      two cards in it
  */
  checkPerfectBlackjack(card1, card2) {
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

  /*  Show every player hand using the .map() function */
  displayAllPlayerHands() {
  const setClassHit = this.props.setClsasHit;
    let hands =
    this.state.playerHands.map( (hand, index) => (
      
        <div key={index} className="playerShow w3-container">


        {hand.cards.map( (card, index) => (
            <img key={index} className="card w3-center w3-animate-right" src={card.imagePath} alt={card.shortName} />
        ))}



          <div className="handStatus">
            <span id="playerPoints">Player Points: {hand.points}</span>
            <span id="handStatus"> &nbsp; {hand.gameOverMessage}</span>
            <span id="hint"> &nbsp; {hand.hintMessage}</span>
          </div>
        { /*
         
        <div class="start">
         <input type="radio" id="radio1" name="radios" value="all" checked/>
         <label for="radio1">Hit</label>
         <div className ="divider2"></div>
         <input type="radio" id="radio2" name="radios" value="false"/>
         <label for="radio2">Stand</label>
         <div className ="divider2"></div>
         <input type="radio" id="radio3" name="radios" value="true"/>
         <label for="radio3">Split</label>
        </div>*/}
        

          <div id="playerButtons">
            <button  className = {this.props.classHit} id = "Hit" disabled={hand.hitDisabled} onClick={() => {this.hit(hand.number)}}>Hit</button>
            <div className ="divider2"></div>
            <button className = "start" id = "Split" disabled={hand.splitDisabled} onClick={() => {this.split(hand.number)}}>Split</button>
            <div className ="divider2"></div>
            <button className = {this.props.classStand} id = "Stand" disabled={hand.standDisabled} onClick={() => {this.stand(hand.number)}}>Stand</button>
            <div className ="divider2"></div>
            <button className = "start" id = "Hint" disabled={hand.hintDisabled} onClick={() => {this.toggleHint(hand.number)}}>Hint</button>
          </div>
</div>
      
      ));
 console.log(hands);
      return hands;
        }

  

  /*  Show the first dealer hand in the game, with one card hidden */
  displayHiddenDealerHand() {
    let shownCard = this.state.dealerHand.cards[1];
    return (
      <div id="dealerCards" className="dealerShow">
        <img className="cardDisplay" src={blankCard} alt="back of card" />
        <img className="cardDisplay" src={shownCard.imagePath} alt={shownCard.shortName} />
        <div id="dealerPoints">Dealer Points: {this.state.dealerHand.shownPoints}</div>
      </div>
    );
  }


  /*  Show both of the first 2 cards of the dealer, if the player is finished
      and not bust for every hand
   */
  displayWholeDealerHand() {
  //  const dealerAnswers = this.props.dealerAnswers;
  //  const playerAnswers = this.props.playerAnswers;
  //  this.setState({playerAnswers: playerAnswers.push(this.state.playerHands)});
  //  this.setState({dealerAnswers: dealerAnswers.push(this.state.dealerHand)});
    let cards =
    this.state.dealerHand.cards.map( (card, index) => (
      <img key={index} className="card w3-center w3-animate-right" src={card.imagePath} alt={card.shortName} />
    )
    );

    let displayHTML =
      <div id="dealerHand" className="dealerShow w3-container">{cards}<div id="dealerPoints">Dealer Points: {this.state.dealerHand.points} {this.state.dealerHand.gameOverMessage}</div></div>

    return displayHTML;
  }

  //  Hit - Get a new card for the player hand, add it, and update the points, etc 
  /*
  hit(handNumber) {

    //  Get the current hand 
    let fullHand = this.state.playerHands;
    let hand;
    let handIndex = 0;
    for(let i=0; i<fullHand.length; i++) {
      if(fullHand[i].number === handNumber) {
        hand = fullHand[i];
        handIndex = i;
        break;
      }
    }

    //  A bust hand cannot get a new card, so we stop the function here by returning
    //  if this hand is bust
   
    if(hand.bust === true) {
      return;
    }

    //  Get the next card from the game deck 
    let newCard = this.getCard();

    hand.perfectBlackjack = false; //Cannot be a perfect blackjack with 2+ cards
    hand.points += newCard.points;

    // Check for Ace for points changing reasons 
    if(newCard.value === 'A') {
      hand.softAces ++;
    }

    console.log(`Hit for Hand ${handNumber}. Added ${newCard.shortName}, Pts: ${hand.points} `);

    // Reduce pts of Aces if necessary 
    while(hand.points > 21 && hand.softAces > 0) {
      hand.points -= 10;
      hand.softAces --;
      console.log(`Hardened Ace for Hand ${handNumber}, Pts: ${hand.points}`);
    }

    // Add the actual card object 
    hand.cards.push(newCard);

    hand.splitDisabled = true; //Cannot split with more than 2 cards in hand

    // Handle a bust hand 
    if(hand.points > 21) {
      hand.bust = true;
      hand.gameOverMessage = "Bust!";
      console.log(`Hand ${handNumber} is bust`);
      hand.hitDisabled = true;  //Disable buttons
      hand.standDisabled = true;
      hand.doubleDisabled = true;
      hand.hintDisabled = true;
      hand.hintMessage = "";

      let active = this.state.activeHands - 1; //Track when dealer should play
      this.setState({activeHands: active});

      let bust = this.state.bustHands;
      bust++;
      this.setState({bustHands: bust});

      // If there are no more hands being played, and some of them
       // are not bust, check the dealer cards
      
      if((active === 0) && (bust < this.state.totalHands)) {

        this.dealerPlay();
      }

    }

    fullHand[handIndex] = hand; //Adding this hand back to group of player hands

    this.setState({playerHands: fullHand});

  }/*


    /*  Double - get one more card, and stand (if not bust) */
  double(handNumber) {
    /* Get the correct hand by searching all the player hands for it */
    let fullHand = this.state.playerHands;
    let hand;
    let handIndex = 0;
    for(let i=0; i<fullHand.length; i++) {
      if(fullHand[i].number === handNumber) {
        hand = fullHand[i];
        handIndex = i;
        break;
      }
    }
    hand.doubleDisabled = true; //Can only double once
    hand.splitDisabled = true; //Cannot split with 3 cards
    hand.hintDisabled = true; //Hint no longer needed as final card played
    hand.perfectBlackjack = false; //No perfect blackjack with more than 2 cards
    fullHand[handIndex] = hand;
    this.setState({playerHands: fullHand});

    this.hit(handNumber);
    this.stand(handNumber);
  }


  /*  Split - if both of the first cards have the same points, make
      a new hand from the second card of the original hand.
      Then deal new cards and add them to both hands.

      NB - Only a 2 card hand may be split
  */
 /*
  split(handNumber) {

    let currentHands = this.state.playerHands;
    // Get the hand object to change from the state variables 
    let handToChange;

    for(let i=0; i<currentHands.length;i++) {
      if(currentHands[i].number === handNumber) {
        handToChange = currentHands[i];

        break;
      }
    }

    //  Disallow change if hand has more than 2 cards 
    if(handToChange.cards.length > 2) {
      return;
    }

    //  Remove the SECOND card from the original hand
       // and if it's an Ace, set the new hand aces to 1
    
    let cardToMove = handToChange.cards.pop();
    let newHandSoftAces = (cardToMove.value === "A") ? 1: 0;

    console.log(cardToMove.value);
    console.log(handToChange.softAces);
    //  Update the no. of Aces in the original hand if necessary 
    if(cardToMove.value === "A") {
      handToChange.softAces--;

      console.log(handToChange.softAces);
    }

    //  Get a new card for the original hand 
    let firstReplacementCard = this.getCard();
    handToChange.cards.push(firstReplacementCard);

    // Check if the original hand should allow split (2 cards with same points)
    handToChange.splitDisabled = (handToChange.cards[0].points !== firstReplacementCard.points);
    handToChange.perfectBlackjack = this.checkPerfectBlackjack(handToChange.cards[0], firstReplacementCard);


    //  Update the original hand Ace count if the card just dealt was an Ace 
    if(firstReplacementCard === "A") {
      handToChange.softAces++;
    }
    // Deal new card for the new hand & check for Ace
    let newHandOtherCard = this.getCard();
    if(newHandOtherCard.value === "A") {
      newHandSoftAces++;
    }


    // Calculate points for new hand
    let newHandPoints = cardToMove.points + newHandOtherCard.points;
    if(newHandPoints > 21) {
      newHandPoints -= 10;
      newHandSoftAces--;
      console.log(newHandSoftAces);
    }

    let newHandNumber = (this.state.totalHands) + 1;

    // Disable split if the points values of both cards are different 
    let newHandDisabledSplit = (cardToMove.points !== newHandOtherCard.points);

    let newPerfectBlackjack = this.checkPerfectBlackjack(cardToMove, newHandOtherCard);

    // Create a new hand object 
    let newHand = {
      "number": newHandNumber,
      "cards": [cardToMove, newHandOtherCard],
      "softAces": newHandSoftAces,
      "points": newHandPoints,
      "bust": false,
      "gameOverMessage": "",
      "hintMessage": "",
      "hintShown": false,
      "splitDisabled": newHandDisabledSplit,
      "hitDisabled": false,
      "standDisabled": false,
      "doubleDisabled": false,
      "hintDisabled": false,
      "perfectBlackjack": newPerfectBlackjack,
    };

    // Fix the points for the Original Hand 
    handToChange.points = handToChange.cards[0].points +
      firstReplacementCard.points;

    // Reduce pts if 2 Aces in hand 
    if(handToChange.points > 21) {
      handToChange.points -= 10;
      handToChange.softAces--;
    }

    // Add new hand array to Hands object 
    currentHands.push(newHand);

    console.log(`New hand added [${newHand.cards[0].shortName}, ${newHand.cards[1].shortName}] `
      + `Pts: ${newHand.points}`);

    let currentActiveHands = (this.state.activeHands) + 1;

    this.setState({playerHands: currentHands});
    this.setState({totalHands: newHandNumber});
    this.setState({activeHands: currentActiveHands});

  }

  /*  Stand - stop playing for a specific hand.
      If all hands are not active, and some are not bust, the dealer should
      start playing, too.
  */
 hit(){
 
   const choice = this.props;
   const setChoice = this.props.setChoice;
   const setClassStand = this.props.setClassStand;
   const setClassHit = this.props.setClassHit;
   const Hit = "Hit";
   setChoice(Hit);
   const start = "start";
   const select = "startClick";
   setClassStand(start);
  setClassHit(select);
   //this.setState({choice: Hit});

 }
 split (){
  const setChoice = this.props.setChoice;
  const Split = "Split";
  const choice = this.props;
  setChoice(Split);

  //this.setState({choice: Split});
 }

  stand(){
  const setChoice = this.props.setChoice;
  const setClassStand = this.props.setClassStand;
  const setClassHit = this.props.setClassHit;
  const Stand = "Stand";
  const start = "start";
  const select = "startClick";
  const choice = this.props;
  setChoice(Stand);
  setClassStand(select);
  setClassHit(start);
  //this.setState({choice: Stand});


  }
  /*
  stand(handNumber) {
    // Get current hand from hands list 
    const setScore = this.props.setScore;
   setScore(this.props.score + 1);
   const score = this.props.score;
    console.log(score);


    let hands = this.state.playerHands;
    let currentHand;
    let currentIndex;
    for(let i=0; i<hands.length;i++) {
      if(hands[i].number === handNumber) {
        currentHand = hands[i];
        currentIndex = i;
        break;
      }
    }

    // No stand allowed if the hand is bust
     // (button should be disabled anyway)
    //
    if(currentHand.bust === true) {
      return;
    }

    currentHand.hitDisabled = true;
    currentHand.splitDisabled = true;
    currentHand.standDisabled = true;
    currentHand.doubleDisabled = true;
    currentHand.hintDisabled = true;
    currentHand.hintMessage = "";

    let active = this.state.activeHands;
    active--;

    hands[currentIndex] = currentHand;

    this.setState({playerHands: hands});
    this.setState({activeHands: active});

    //  Dealer should play if no hands are active 
    if(active === 0) {
      // this.setState({showDealerCards: true});
      this.dealerPlay(); //XXXXXXXXXXXXXXXXXXXXX//
    }

  }
  */
/*
  toggleHint(handNumber) {


    let hands = this.state.playerHands;
    let currentHand;
    let currentIndex;
    hands.forEach((hand, i) => {
      if(hand.number === handNumber) {
        currentHand = hand;
        currentIndex = i;
      }
    });

    let hintVisible = currentHand.hintShown;
    hintVisible = !hintVisible;

    currentHand.hintShown = hintVisible;

    if(hintVisible === true) {
      currentHand.hintMessage = "You should hit. No wait... stand. Or double. Maybe split??";
    }
    else {
      currentHand.hintMessage = "";
    }
    hands[currentIndex] = currentHand;
    this.setState({playerHands: hands});
  }

  //  Play the game as the dealer after the player finished and has
     //    some hands which didn't go bust
     
    
  dealerPlay() {
    this.setState({showDealerCards: true});


    let hand = this.state.dealerHand;
    let dealerPts = hand.points;
    let softAces = hand.softAces;

    console.log(`Dealer hand: [${hand.cards[0].shortName}, ${hand.cards[1].shortName}], `
      + `Pts: ${dealerPts}`
    );
    console.log(`Dealer has ${softAces} soft Aces`);

      while((dealerPts < 17) || (dealerPts === 17 && softAces > 0)) {

        // Get a new card and add it to the dealer's hand 
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

      //  Check if dealer went bust 
      if(dealerPts > 21) {
        hand.bust = true;
        hand.gameOverMessage = "Bust!";
        this.setState({dealerHand: hand});
      }
      //  Dealer play is now finished - Find the winners 
      this.checkWinningHands();
    // }, 2000);
  }

  // Check which hands won, if some hands are not already bust 
  checkWinningHands() {

    //  Get the dealer hand 
    let dHand = this.state.dealerHand;

    //  Get the player hands array 
    let hands = this.state.playerHands;

    let dealerPts = dHand.points;

    //  Loop through all the player hands, and check each of them for
        a win compared to the dealer's points
    
    hands.forEach((hand, i) => {
      // Only check hands that aren't bust 
      if(hand.bust !== true) {

        //  Check case 1: player pts are better 
        if(hand.points > dealerPts) {
          hand.gameOverMessage = "Hand Won!";
          console.log( `Player hand ${hand.number} wins on points` );
        }

        //  Check case 2: same pts 
        else if(hand.points === dealerPts ) {

          //  2a: player has a Perfect Blackjack 
          if(hand.perfectBlackjack === true) {
            //  2a-1 dealer doesn't also have a Perfect Blackjack,
              //  so player wins
             
            if(dHand.perfectBlackjack === false) {
              hand.gameOverMessage = "Perfect Blackjack! Hand Won!";
              console.log( `Player hand ${hand.number} wins with Perfect Blackjack` );
            }
            // 2a-2 dealer also has a Perfect Blackjack, so no winner 
            else {
            hand.gameOverMessage = "Perfect Blackjacks. Push.";
            console.log( `Player hand ${hand.number} push on Perfect Blackjack` );
            }

          }
          //  2b: player doesn't have a Perfect Blackjack 
          else {
            //  2b-1 dealer has a Perfect Blackjack, so dealer wins 
            if(dHand.perfectBlackjack === true) {
              hand.gameOverMessage = "Hand Lost. Dealer wins with Perfect Blackjack";
              console.log( `Player hand ${hand.number} lost with dealer Perfect Blackjack` );
            }
            //  2b-2 nobody has a Perfect Blackjack, no winner 
            else {
              hand.gameOverMessage = "Push.";
              console.log( `Player hand ${hand.number} push with dealer` );
            }
          }
      }
      //  Check case 3: player pts are worse 
      else {
        //  If the dealer is not bust, the player hand loses 
        if(dHand.bust === false) {
          hand.gameOverMessage = "Hand Lost.";
          console.log( `Player hand ${hand.number} loses on points` );
        }
        //  If the dealer is bust, the player hand wins
            (player hand was already checked for not being bust)
        
        else {
          hand.gameOverMessage = "Dealer Bust! Hand Won!";
        }
      }
    }});

    this.setState({playerHands: hands});


  }
*/

  /*  Reset & restart the game */
  newGame() {
    const setAnswerMessage = this.props.setAnswerMessage;
    const setClassHit = this.props.setClassHit;
    const setClassStand = this.props.setClassStand;
    const answerChoice = this.props.answerChoice;
    const dealerAnswers = this.props.dealerAnswers;
   const playerAnswers = this.props.playerAnswers;
    const currentQ = this.props.currentQ;
    const setCurrentQ = this.props.setCurrentQ;
    const handNum = this.props.handNum;
    const sethandNum = this.props.sethandNum;
    const answer = this.props.answer;
    const setAnswer = this.props.setAnswer;
    const setChoice = this.props.setChoice;
    const setScore = this.props.setScore;
    const score = this.props.score;
    const choice = this.props.choice;
    const correct = "correct";
    const wrong = "wrong";
    const start = "start";
    const Stand = "Stand";
    const Hit = "Hit";
    const Split = "Split";
    const reSet = "";
   

    

    


    setChoice(reSet);
    setCurrentQ(currentQ+1);
    console.log(this.props.currentQ);
    let playerCard1 = this.getCard();
    let dealerCard1 = this.getCard();

    let playerCard2 = this.getCard();
    let dealerCard2 = this.getCard();

    let playerAceTotal = (playerCard1.value === "A") ?
      ((playerCard2.value === "A") ? 2 : 1 ) : 0;

    let playerFirstPoints = this.getCardPoints([playerCard1, playerCard2]);
    if(playerFirstPoints > 21) {
        playerFirstPoints -= 10;
        playerAceTotal--;
    }
    let dealerFirstPoints = dealerCard2.points;
    let dealerTotalPoints = dealerCard1.points + dealerCard2.points;

    let dealerAceTotal = (dealerCard2.value === "A") ? 1 : 0;
    if(dealerTotalPoints > 21) {
      dealerTotalPoints -= 10;
      dealerAceTotal--;
    }

    let disabledSplit = (playerCard1.points !== playerCard2.points);

    let dealerPerfectBlackjack = this.checkPerfectBlackjack(dealerCard1, dealerCard2);
    let playerPerfectBlackjack = this.checkPerfectBlackjack(playerCard1, playerCard2);

    let dealerFirstHand = {
      "cards": [dealerCard1, dealerCard2],
      "softAces": dealerAceTotal,
      "points": dealerTotalPoints,
      "shownPoints": dealerFirstPoints,
      "bust": false,
      "gameOverMessage": "",
      "perfectBlackjack": dealerPerfectBlackjack,
    }

    let playerFirstHand = {
      "number": 0,
      "cards": [playerCard1, playerCard2],
      "softAces": playerAceTotal,
      "points": playerFirstPoints,
      "bust": false,
      "gameOverMessage": "",
      "hintMessage": "",
      "hintShown": false,
      "splitDisabled": disabledSplit,
      "hitDisabled": false,
      "hintDisabled": false,
      "perfectBlackjack": playerPerfectBlackjack,
    }
    

    if(dealerFirstPoints==2 && (playerFirstPoints>=13 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==3 && (playerFirstPoints>=13 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==4 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==5 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints==6 && (playerFirstPoints>=12 && playerFirstPoints<=21))
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else if(dealerFirstPoints>=7 && (playerFirstPoints>=17 && playerFirstPoints<=21))  //needs equivalent for jack, queen,king
    {
      setAnswer(Stand);
      this.setState({answer: Stand});
      console.log(answer);
    }
    else
    {
      setAnswer(Hit);
      this.setState({answer: Hit});
      console.log(answer);
    }

    if (this.props.answer == this.props.choice)
    {
      setScore(this.props.score+1);
    }


     let LocalAnswerChoice = {
      "choice": choice,
      "answer": answer,
    }

    if(this.props.currentQ < 6){
    setClassHit("start");
    setClassStand("start");
    this.setState ({playerHands: [playerFirstHand]});
    this.setState ({dealerHand: dealerFirstHand});
    this.setState ({activeHands: 1});
    this.setState ({totalHands: 1});
    this.setState ({showDealerCards: false});
    this.setState ({bustHands: 0});

    this.setState({answerChoice: answerChoice.push(LocalAnswerChoice)});
    this.setState({playerAnswers: playerAnswers.push(this.state.playerHands)});
    this.setState({dealerAnswers: dealerAnswers.push(this.state.dealerHand)});
    //  playerAnswers.push(this.state.playerHands);
     // dealerAnswers.push(this.state.dealerHand);
     console.log(playerAnswers[handNum]);
     console.log(playerAnswers[handNum]);
     console.log(answerChoice);
    }

    else{
      
         if (answerChoice[handNum].answer===answerChoice[handNum].choice && answerChoice[handNum].answer===Hit){
             setClassHit(correct);
             setClassStand(start);
             setAnswerMessage("Nice job, you got the right answer!");
      }
         if (answerChoice[handNum].answer===answerChoice[handNum].choice && answerChoice[handNum].answer===Stand){
            setClassStand(correct);
            setClassHit(start);
            setAnswerMessage("Nice job, you got the right answer!");
      }
        if (answerChoice[handNum].answer!==answerChoice[handNum].choice && answerChoice[handNum].answer===Stand){
          setClassStand(wrong);
          setClassHit(correct);
          setAnswerMessage("Unlucky, you answered that question incorrect!");
        }
        if (answerChoice[handNum].answer!==answerChoice[handNum].choice && answerChoice[handNum].answer===Hit){
          setClassStand(correct);
          setClassHit(wrong);
          setAnswerMessage("Unlucky, you answered that question incorrect!");
          
        }

      this.setState ({playerHands: playerAnswers[handNum]});
      this.setState ({dealerHand: dealerAnswers[handNum]});
      this.setState ({activeHands: 1});
      this.setState ({totalHands: 1});
      this.setState ({showDealerCards: false});
      this.setState ({bustHands: 0});
      
      sethandNum(handNum+1);
      console.log(handNum);
     
      }
      

   
  

    console.log(`Dealer dealt: [ ? ` +
      `, ${dealerFirstHand.cards[1].shortName}] Pts shown: ${dealerFirstHand.shownPoints}`);

    console.log(`Dealer has ${dealerFirstHand.softAces} soft aces`);

    console.log(`Player dealt: [${playerFirstHand.cards[0].shortName}` +
      `, ${playerFirstHand.cards[1].shortName}] Pts: ${playerFirstHand.points}`);

    console.log(`Player has ${playerFirstHand.softAces} soft aces`);

    console.log(`Dealer perfectBlackjack: ${dealerPerfectBlackjack}`);
    console.log(`Player perfectBlackjack: ${playerPerfectBlackjack}`);
    console.log(playerAnswers);
    console.log(dealerAnswers);
    console.log(score);
    console.log(choice);
    console.log(answer);

    }
  


 




  render() {


    return(
      <div className="game">
        <div id="dealerGame">
          {this.state.showDealerCards === true &&
            this.displayWholeDealerHand()
          }
          {this.state.showDealerCards === false &&
            this.displayHiddenDealerHand()
          }
        </div>
        {this.displayAllPlayerHands()} <br/>
        <div id="gameOptions">
          <button className = "start" id = "newQuestion" disabled={nextChoice} onClick={() => {this.newGame()}}>Next Question</button>
        </div>
      </div>
    );
  }


}

export default Game;






