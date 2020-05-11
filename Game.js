import React from 'react';
import {cardDeck, makeMultiDecks, shuffleDeck} from './card.js';
import './Quiz.css';
import blackjackWelcome from './blackjackquizWelcome.jpg'
import {getHint} from './Hint.js';
const blankCard =  "./cardImages/200px-Card_back_05.svg.png";
class Game extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

          gameDeck: cardDeck,
          score:0,
          currentQ: 0,
          totalQuestions: 0,
          totalScore:0,
          highScore: 0,
          numGames: 0,
          playerPoints:0,
          dealerPoints:0,
          pastScores: [],
          lastTenScores: [],
          playerHands: [], //stored in Array to add hands later
          dealerHand: '', // stores dealerhand
          playerAnswers: [], //stores past player hands
          dealerAnswers: [], // stores past dealer hands 
          answerChoice: [], // stores the correct answers and players' choices
          showDealerCards: false, //hide one card for the dealer
          quizStarted: false, //renders gameplay when true
          welcome: true, //renders welcome page when true
          results: false, // renders results page when true
          AnswerNum: 1, // tracks the index of answers
          answerMessage: "Nice job, you got the right answer!",
          QuestionCount: true, // renders the current question number
          choiceDisabled: false, // disables buttons when answers are being shown 
          classDouble: "start", //Sets all gameplay buttons to starting className 
          classSplit: "start",
          classHit: 'start',
          classStand: 'start',
          classSurrender: 'start',
          answer: "start",
          choice: "",
          handNum: 0, // used to track index for player and dealer hands once quiz is over and answers shown
          playerHint: "",// These are used to send in first dealer hand and player hand to
          dealerHint: "" // hint function to find answers. 

          

    }
    



    this.start = this.start.bind(this);
    this.welcome = this.welcome.bind(this);
    this.results = this.results.bind(this);
    this.resetHandle = this.resetHandle.bind(this);
    this.seeAnswers = this.seeAnswers.bind(this);

  }


//*****************************************************************************************
//////////////////////////////////////GAME SET-UP//////////////////////////////////////////
//*****************************************************************************************


//*****************************************************************************************
//Get a card from the game deck 

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


//*****************************************************************************************
/* Calculate the points of a hand by looping through all cards and
  getting the total points. 
  */
  getCardPoints(hand) {
    let total = 0;
    for(let card of hand) {
      total += card.points;
    }
    return total;
  }





//*****************************************************************************************
// Deal first hands for the player and dealer 

  makeFirstHands() {
    this.setState({choices: ""});
    let firstHands = [];

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
   this.state.playerPoints = playerFirstPoints;
   
   if(playerFirstPoints > 21) {
       playerFirstPoints -= 10;
       playerAceTotal--;
   }

   /*  Points for dealer */
   let dealerFirstPoints = dealerCard2.points;
   let dealerTotalPoints = dealerCard1.points + dealerCard2.points;
   this.state.dealerPoints = dealerFirstPoints;
  

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

    
    /*  Create hands as JavaScript objects */
   let dealerFirstHand = {
     "cards": [dealerCard1, dealerCard2],
     "softAces": dealerAceTotal,
     "points": dealerTotalPoints,
     "shownPoints": dealerFirstPoints,
     "bust": false,
     "gameOverMessage": "",
   }

   let playerFirstHand = {
     "number": 0,
     "cards": [playerCard1, playerCard2],
     "softAces": playerAceTotal,
     "points": playerFirstPoints,
     "bust": false,
     "surrendered": false,
     "gameOverMessage": "",
     "hintMessage": "",
     "hintShown": false,
     "hitDisabled": false,
     "standDisabled": false,
     "doubleDisabled": false,
     "hintDisabled": false,
     "surrenderDisabled": false,
   }
   /* Save the dealer and player first hands in the firstHands object to be returned
      playerHint and dealerHint are created to use as parameters for the hint function*/

   firstHands.dealer = dealerFirstHand;
   firstHands.player = playerFirstHand;
   this.state.playerHint = firstHands.player;
   this.state.dealerHint = firstHands.dealer;

  /*Returns an array of JS objects containing the hand info*/
   return firstHands; 
  }

  



//******************************************************************************************
/////////////////////////////////////////DISPLAY///////////////////////////////////////////
//*****************************************************************************************


//*****************************************************************************************
/*  Show every player hand using the .map() function. Game play buttons are also 
    defined here. */
  displayAllPlayerHands() {
 
    const styleHand = {
      fontSize: 25
    }
    let hands =
    this.state.playerHands.map( (hand, index) => (
        <div id="allPlayerHands" key={index} className="playerShow w3-container">


        {hand.cards.map( (card, index) => (
            <img
              key={index}
              className="cardDisplayQuiz  w3-center w3-animate-right"
              src={card.imagePath}
              alt={card.shortName}
            />
        ))}

          <div style = {styleHand} className="playerStatus">
            <span id="playerPoints">Player Points: {hand.points}</span>
            <span id="handStatus"> &nbsp; {hand.gameOverMessage}</span>
          </div>
      
          <div id="playerButtons">
            <button  className = {this.state.classHit} id = "Hit" disabled={this.state.choiceDisabled} onClick={() => {this.hit(hand.number)}}>Hit</button>
            <div className ="divider2"></div>
            <button className = {this.state.classSplit} id = "Split" disabled={this.state.choiceDisabled} onClick={() => {this.split(hand.number)}}>Split</button>
            <div className ="divider2"></div>
            <button className = {this.state.classStand} id = "Stand" disabled={this.state.choiceDisabled} onClick={() => {this.stand(hand.number)}}>Stand</button>
            <div className ="divider2"></div>
            <button className = {this.state.classDouble} id = "Hint" disabled={this.state.choiceDisabled} onClick={() => {this.Double(hand.number)}}>Double Down</button>
            <div className ="divider2"></div>
            <button className = {this.state.classSurrender} id = "Surrender" disabled={this.state.choiceDisabled} onClick={() => {this.Surrender(hand.number)}}>Surrender</button>

          </div>
        </div>
      ));

      return hands;
  }


//*****************************************************************************************
// Show the first dealer hand in the game, with one card hidden 

  displayHiddenDealerHand() {
    const styleHand = {
      fontSize: 25
    }
    let shownCard = this.state.dealerHand.cards[1];
    return (
     
     <div style = {styleHand} className = "dealer">
       
      
        <img className="cardDisplayQuiz" src={blankCard} alt="back of card" />
        <img className="cardDisplayQuiz" src={shownCard.imagePath} alt={shownCard.shortName} />
        <div id ="dealerID">Dealer Points: {this.state.dealerHand.shownPoints}</div>
      </div>
    );
  }


//*****************************************************************************************
/* Show both of the first 2 cards of the dealer, if the player is finished
/  and not bust for every hand*/

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
      <div className="dealer" >
        <div>
          Dealer Points: {this.state.dealerHand.points}&nbsp;
          {this.state.dealerHand.gameOverMessage}
        </div>
        {cards}
      </div>

    return displayHTML;
  }

// *****************************************************************************************
/* Displays the current question depending on what section of the  quiz the user is on. If 
welcome or results page are shown, then it is set to an empty string, during the quiz it displays
question number and for the answers section it shows question number and a message*/

  displayQuestionNumber(){
    const styleQuestion = {
      fontSize: 25
    }
    if(this.state.currentQ===0 || this.state.currentQ === 11){
        let displayQuestionNumber = "";
        return displayQuestionNumber;
      }
    if (this.state.currentQ>0 && this.state.currentQ<11){
        let displayQuestionNumber = 
         <div className = "questionCount">
          <h4 style = {styleQuestion}> Question {this.state.currentQ} / 10</h4>
         </div>
       return displayQuestionNumber;
     }
     else{
       let displayQuestionNumber = 
       <div className = "questionCount">
       <h4 style = {styleQuestion}> Question {(this.state.AnswerNum-1)} / 10: &nbsp; {this.state.answerMessage}</h4>
      </div>
      return displayQuestionNumber;
     }
     
  } 
 

   //*****************************************************************************************
   /* Handles the results page. Score, average score, high score, past scores and
      answer message are all saved as variables and rendered.*/ 

  results(){ 
        var averageScore = Math.round((this.state.totalScore/this.state.totalQuestions)*10);
            var percentage = (this.state.score / 10* 100);
            var comment = '';
            var PreviousScores;
            this.state.pastScores.push(this.state.score+",");
        const styleResult = {
          fontSize: 30
        }
        if(percentage === 100){
                comment = "Congratulations, you are ready to win big!" ;
                }
        else if (percentage > 80) {
                comment =  "You are doing great, You are nearly ready!";
        } else if (percentage < 80 && percentage > 60) {
                comment = 'Nice score, you are getting the hang of it!';
        } else {
                 comment = 'You need to keep working on your Black Jack!';
        }
                if (this.state.score > this.state.highScore){
                     this.setState({highScore: this.state.score});
                }
       
        PreviousScores = this.state.pastScores;
        let results =
          <div className = "results">
            <h4 style = {styleResult}>  {comment}</h4>
              <h4 style = {styleResult}>You got {this.state.score} out of 10 correct! &nbsp; {percentage}%</h4>
                 <h4 style = {styleResult}>Your high score is:&nbsp; {this.state.highScore}</h4>
                  <h4 style = {styleResult}>Your average score is:&nbsp; {averageScore} </h4>
                  <h4 style = {styleResult}> Your previous scores are:&nbsp; {PreviousScores}</h4>
                  <div> </div>
             <button className = "start" id = "tryAgain" onClick = {this.resetHandle.bind(this)}> Try Again! </button>
                <div className = "divider"></div>
              <button className = "start" id = "SeeAnswers" onClick = {this.seeAnswers.bind(this)}> See Answers </button>
              <br/>
              <div></div>
               </div>
        
          return results;      
  }

  //*****************************************************************************************
  /* This function handles the welcome page and contains the start quiz button*/
   
  welcome(){
      const styleObj1={
        fontSize: 40,
       }
      const styleObj2 ={
      fontSize: 30,
    }
      let welcome = 
      <div className = "welcomePage">
      <h4>
         <p style = {styleObj1}>Welcome to the Black Jack Quiz!</p>
           <p style = {styleObj2}>Please click start quiz to begin...</p></h4>
          <div >
          <img className = "welcomePicture"src={blackjackWelcome} alt="blackjackWelcome"  height={250} width={400}
        />
          </div>
         <br/>
        <button className = "startQuiz" id = "startQuiz"  onClick={() => {this.start()}}>Start Quiz!</button>
        <div> </div>
        <br/>
    </div>
    return welcome;
  }

  //*****************************************************************************************
/*This function decides whether or not to show "Previous Question" button or not. It is only 
showed during the answers section*/

  showPrevButton(){
    var prevButton ;
     if (this.state.currentQ<11 || this.state.currentQ ===12){
      prevButton =
       <div id="gameOptions">
         <button className = "start" id = "newQuestion" disabled={this.state.nextDisabled} 
                onClick={() => {this.nextQuestion()}}>Next Question</button>
        </div>}
      else {
      prevButton =
      <div id="gameOptions">
        <button className = "start" id = "newQuestion" disabled={this.state.previousDisabled} 
                onClick={() => {this.prevCallBack()}}>Previous Question</button>
        <div className = "divider" ></div>
          <button className = "start" id = "newQuestion" disabled={this.state.nextDisabled} 
                onClick={() => {this.nextQuestion()}}>&nbsp;Next&nbsp; &nbsp;Question&nbsp;</button>
         </div>}
  
  return prevButton;
}




/*****************************************************************************************/
///////////////////////////////////////////Quiz Functions/////////////////////////////////
/***************************************************************************************/


//**************************************************************************************** 
// Update user choice and button to hit
hit(){
    this.setState({choice: "hit"});
    this.setState({classHit: 'startClick'});
    this.setState({classStand: 'start'});
    this.setState({classSplit: "start"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
  }


//*****************************************************************************************
// Update user choice and button to stand and validates next question button
Double(){
     this.setState({choice: "double"});
     this.setState({classHit: 'start'});
     this.setState({classStand: 'start'});
     this.setState({classSplit: "start"});
     this.setState({classDouble: "startClick"});
     this.setState({classSurrender: "start"});
     this.setState({nextDisabled: false}); 
   }

//*****************************************************************************************
//Update user choice and button to split and validates next question button
split (){
    
    this.setState({choice: "split"});
    this.setState({classHit: 'start'});
    this.setState({classStand: 'start'});
    this.setState({classSplit: "startClick"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
   }


//*****************************************************************************************
// Update user choice and button to stand and validates next question button

stand(){
    this.setState({choice: "stand"});
    this.setState({classHit: 'start'});
    this.setState({classStand: 'startClick'});
    this.setState({classSplit: "start"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
    
    }
//*****************************************************************************************
// Update user choice and button to surrender and validates next question button 

Surrender(){
  this.setState({choice: "surrender"});
  this.setState({classHit: 'start'});
  this.setState({classStand: 'start'});
  this.setState({classSplit: "start"});
  this.setState({classDouble: "start"});
  this.setState({classSurrender: "startClick"});
  this.setState({nextDisabled: false});
}


//*****************************************************************************************
/* Updates the next question in the quiz depending on question number */

  nextQuestion() {
    console.log("handnum next" +this.state.handNum);
   /* Object created for comparing user choice and answer*/
    let LocalAnswerChoice = {
        "choice": this.state.choice,
        "answer": this.state.answer,
      }
  /* increments question number, makes new hands, and finds correct answer */

    this.setState({currentQ: this.state.currentQ+1});
    this.setState({nextDisabled: true});
    let firstHands = this.makeFirstHands(); 
    this.setCorrectAnswers();

  /*This renders the results page once the last question is finished */

    if(this.state.currentQ ===10){
        this.setState({results: true});
        this.setState({quizStarted: false});  
    }
    
    /*If results or welcome page currently shown, set quizStarted to true to start quiz */

    if(this.state.quizStarted === false) {
      this.setState({quizStarted: true});
    }
     /*If answer is correct, update score*/

    if (this.state.answer === this.state.choice)
    {
      this.setState({score: this.state.score+1});
      this.setState({totalScore: this.state.totalScore+1});
    }
   
    /* If current question is less than 11, then the quiz is being played. It renders random hands
       from the makeHands function, and also stores these hands as well as user choice and answers in 
       sepparate arrays to be used for answers section. Buttons are reset to starting className.*/ 

      if(this.state.currentQ  <11){
        this.setState({choiceDisabled: false})
        this.setState({classHit: 'start'});
        this.setState({classStand: 'start'}); 
        this.setState({classDouble: "start"});
        this.setState({classSplit: "start"});
        this.setState({classSurrender:'start'});
        this.setState({totalQuestions: this.state.totalQuestions +1}); 
        this.setState ({playerHands: [firstHands.player]});
        this.setState ({dealerHand: firstHands.dealer});
        this.setState ({showDealerCards: false});
        this.setState({ answerChoice: [...this.state.answerChoice, LocalAnswerChoice]});
        this.setState({ playerAnswers: [...this.state.playerAnswers, this.state.playerHands]});
        this.setState({ dealerAnswers:  [...this.state.dealerAnswers, this.state.dealerHands]});
        this.setState({ playerAnswers: [...this.state.playerAnswers, firstHands.player]});
        this.setState({dealerAnswers: [...this.state.dealerAnswers, firstHands.dealer]});

   /* Reset  question number to 0 when all the answers have been shown, welcome page therefore
      set to true and quizStarted set to false. */   
  }

  else if(this.state.currentQ ===21){
        this.setState({AnswerNum: 1});
        this.setState({quizStarted: false});
        this.setState({welcome: true});
        this.setState({currentQ: 0});
        this.setState({handNum: 0});
       
  }
  /* If question number is greater than 11, then the answers section of the quiz is being shown.
      playerHands and dealerHands render previous hands that are stored in playerAnswer and 
      dealerAnswer arrays. handNum is used as an index and is initially set to 0, corresponding 
      to the question number being shown from the quiz, and increments with nextQuestion 
      button click. setButtonColor is called to change the buttons depending on the answer */ 

    else{ 
        this.setState({results: false})
        this.setState ({playerHands:  [this.state.playerAnswers[this.state.handNum]]});
        this.setState ({dealerHand: this.state.dealerAnswers[this.state.handNum]});
        this.setState ({showDealerCards: false});
        this.setState({handNum: this.state.handNum+1});
        this.setState({AnswerNum: this.state.AnswerNum + 1});
        this.setState({choiceDisabled: true});
        this.setState({nextDisabled: false})
        this.setState({classHit: 'answers'});
        this.setState({classStand: 'answers'});
        this.setState({classDouble:"answers"});
        this.setState({classSplit:"answers"});
        this.setState({classSurrender:"answers"});  
        this.setButtonColor(); 
   }
   console.log(this.state.answerChoice);
    console.log(this.state.playerAnswers);
    console.log(this.state.dealerAnswers);
   /* Resets the users choice*/
        this.setState({choice: ""}); 
 }

  //*****************************************************************************************
  /* Resets the quiz if the user does not want to see their answers once they finish*/
  resetHandle(){
    this.setState({classStand: "start"});
    this.setState({classHit: "start"});
    this.setState({classDouble: "start"});
    this.setState({classSplit: "start"});
    this.setState({currentQ: 0});
    this.setState({results: false});
    this.setState({welcome: true});
    this.setState({score: 0});
    this.setState({numGames: this.state.numGames+1});
    }
    
//*****************************************************************************************
/*Called with "See Answers" button, results set to false, quizStarted set to true, question
is incremented and newQuestion is called */ 

  seeAnswers(){
    this.setState({currentQ: this.state.currentQ+1});
    this.setState({results: false});
    this.setState({quizStarted: true});
    this.nextQuestion();
    }


//*****************************************************************************************
/* This function starts the quiz, it also resets score and the arrays used to store the dealer
   hands, player hands and answers */
  start() {  
    this.setState({classHit: "start"});
    this.setState({classStand: "start"});
    this.setState({score: 0});
    this.state.playerAnswers.length = 0;
    this.state.dealerAnswers.length = 0;
    this.state.answerChoice.length = 0;
    this.setState({welcome: false});

      if(this.state.quizStarted === false) {
        this.nextQuestion();
      }
    }
//**************************************************************************************** 
//This function uses the hint logic to find the correct answer for each question 
  setCorrectAnswers(){
      let playerHint = getHint(this.state.dealerHint, this.state.playerHint, true,  true, true);
      this.setState({answer: playerHint.shortHint});
      console.log(this.state.answer);
  }


//*****************************************************************************************
/*This function compares the users choice with the correct answer, if the answer is correct
/ it will change the button of choice green. If the answer is wrong, the button chosen turns red
/ and the correct button turns green. If the answer is wrong the message is also updated stating 
/ the correct answer*/

    setButtonColor(){
      console.log("set button color "+this.state.AnswerNum);
      console.log("user Choice" + this.state.answerChoice[this.state.AnswerNum].choice);
      let playerChoice = this.state.answerChoice[this.state.AnswerNum].choice;
      let gameAnswer = this.state.answerChoice[this.state.AnswerNum].answer;
      let correctAnswer = true;
      if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice)
       correctAnswer = false;
      
      if (correctAnswer && playerChoice === "hit"){
          this.setState({classHit: 'correct'});
          this.setState({answerMessage: "Nice job, you got the right answer!"});    
      }
      if (correctAnswer && playerChoice === "stand"){
        this.setState({classStand: 'correct'});
        this.setState({answerMessage: "Nice job, you got the right answer!"});
      }
      if (correctAnswer && playerChoice === "split"){
        this.setState({classSplit:"correct"});
        this.setState({answerMessage: "Nice job, you got the right answer!"});   
       }
       if (correctAnswer && playerChoice === "double"){
        this.setState({classDouble: "correct"});
        this.setState({answerMessage: "Nice job, you got the right answer!"});
       }
      if (correctAnswer && playerChoice ==="surrender"){
        this.setState({classSurrender:"correct"});
        this.setState({answerMessage: "Nice job, you got the right answer!"});
       
}
////////////////////////////////Answer: Hit//////////////////////////////////

      if(!correctAnswer&& playerChoice==="stand"&& gameAnswer==="hit"){
         this.setState({classHit: 'correct'});
         this.setState({classStand: 'wrong'});
         this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
      }

      if(!correctAnswer&& playerChoice==="split"&& gameAnswer==="hit"){
         this.setState({classHit: 'correct'});
         this.setState({classSplit:"wrong"});
         this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
      }

      if(!correctAnswer&& playerChoice==="double"&& gameAnswer==="hit"){
         this.setState({classHit: 'correct'});
         this.setState({classDouble:"wrong"});
         this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
      }
      if(!correctAnswer&& playerChoice==="surrender"&& gameAnswer==="hit"){
        this.setState({classHit: 'correct'});
        this.setState({classSurrender:"wrong"});
        this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
      }

////////////////////////////////////Answer: Stand///////////////////////////////////

    if(!correctAnswer&& playerChoice==="hit"&& gameAnswer==="stand"){
       this.setState({classHit: 'wrong'});
       this.setState({classStand: 'correct'});
       this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
     }

    if(!correctAnswer&& playerChoice==="split"&& gameAnswer==="stand"){
       this.setState({classStand: 'correct'});
       this.setState({classSplit:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
     }

    if(!correctAnswer&& playerChoice==="double"&& gameAnswer==="stand"){
       this.setState({classStand: 'correct'});
       this.setState({classDouble:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
     }

    if(!correctAnswer&& playerChoice==="surrender"&& gameAnswer==="stand"){
       this.setState({classStand: 'correct'});
       this.setState({classSurrender:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
    }

////////////////////////////////////Answer: Split///////////////////////////////////

    if(!correctAnswer&& playerChoice==="hit"&& gameAnswer==="split"){
       this.setState({classHit: 'wrong'});
       this.setState({classSplit:"correct"});
       this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
    }

    if(!correctAnswer&& playerChoice==="stand"&& gameAnswer==="split"){
       this.setState({classStand: 'wrong'});
       this.setState({classSplit:"correct"});
       this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
    }

    if(!correctAnswer&& playerChoice==="double"&& gameAnswer==="split"){
       this.setState({classDouble:"wrong"});
       this.setState({classSplit:"correct"});
       this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
   }
    if(!correctAnswer&& playerChoice==="surrender"&& gameAnswer==="split"){
       this.setState({classSplit:"correct"});
       this.setState({classSurrender:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
   }

///////////////////////////////////Answer: Double///////////////////////////////////
    if(!correctAnswer&& playerChoice==="hit"&& gameAnswer==="double"){
       this.setState({classHit: 'wrong'});
       this.setState({classDouble:"correct"});
       this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
   }
    if(!correctAnswer&& playerChoice==="stand"&& gameAnswer==="double"){
       this.setState({classStand: 'wrong'});
       this.setState({classDouble:"correct"});
       this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
   }
    if(!correctAnswer&& playerChoice==="split"&& gameAnswer==="double"){
       this.setState({classDouble:"correct"});
       this.setState({classSplit:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
   }
    if(!correctAnswer&& playerChoice==="surrender"&& gameAnswer==="double"){
       this.setState({classDouble:"correct"});
       this.setState({classSurrender:"wrong"});
       this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
   }

///////////////////////////////////Answer: Surrender///////////////////////////////////

  if(!correctAnswer&& playerChoice==="hit"&& gameAnswer==="surrender"){
     this.setState({classHit: 'wrong'});
     this.setState({classSurrender:"correct"});
     this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
    }

  if(!correctAnswer&& playerChoice==="stand"&& gameAnswer==="surrender"){ 
     this.setState({classStand: 'wrong'});
     this.setState({classSurrender:"correct"});
     this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
    }

  if(!correctAnswer&& playerChoice==="split"&& gameAnswer==="surrender"){
     this.setState({classSplit:"wrong"});
     this.setState({classSurrender:"correct"});
     this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
   }

  if(!correctAnswer&& playerChoice==="double"&& gameAnswer==="surrender"){
     this.setState({classDouble:"wrong"});;
     this.setState({classSurrender:"correct"});
     this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
   }
     }
//*****************************************************************************************
/*This function uses a callback for setState of AnswerNum due to React being asynchronous.
  AnswerNum is used to track index of the answers array. It must be decremented first before 
  previousQuestion is called.  */

     prevCallBack(){
      this.setState((prevState) => {
        console.log(this.state.AnswerNum)
          return {AnswerNum: this.state.AnswerNum-2};
      }, () => {
        console.log(this.state.AnswerNum);
          this.previousQuestion();
      });
  }
  //*****************************************************************************************
  /*This function allows user to go back to previous question in the answers section. */  

  previousQuestion(){
    this.setState({currentQ: this.state.currentQ -1});
    this.setState({nextDisabled: false});
    this.setState ({playerHands:  [this.state.playerAnswers[this.state.handNum-2]]});
    this.setState ({dealerHand: this.state.dealerAnswers[this.state.handNum-2]});
    this.setState({handNum: this.state.handNum-1});
    this.setState ({showDealerCards: false});
    this.setState({choiceDisabled: true});
    this.setState({classHit: 'answers'});
    this.setState({classStand: 'answers'});
    this.setState({classDouble:"answers"});
    this.setState({classSplit:"answers"});
    this.setState({classSurrender:"answers"});  
    this.setButtonColor(); 
    this.setState({AnswerNum: this.state.AnswerNum+1});
    console.log(this.state.answerChoice);
    console.log(this.state.playerAnswers);
    console.log(this.state.dealerAnswers);
  }


//*****************************************************************************************
///////////////////////////////////////RENDER//////////////////////////////////////////////
//*****************************************************************************************


//*****************************************************************************************
/* The render uses a series of booleans to decide which functions to display, 
  They are all based on question number. Welcome page displays on question 0, the quiz 
  from 1-10, results page on 11, and answers page from 11-20 */

  render() {

    return(
        <div className="game">
        <div>
        {this.state.QuestionCount === true && this.displayQuestionNumber()}
        {this.state.welcome === true && this.welcome()}
        {this.state.results === true && this.results()}
         
        {this.state.quizStarted === true &&
        <div>
    
          {this.state.showDealerCards === true &&
            this.displayWholeDealerHand()
          }
    
          {this.state.showDealerCards === false &&
            this.displayHiddenDealerHand()
          }
        
        
        {this.displayAllPlayerHands()} 
          <br/>
        {this.showPrevButton()}
           <br/>
        </div>
        
        }
        </div>
      </div>
        
    );
  }


}

export default Game;
