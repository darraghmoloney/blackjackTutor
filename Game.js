import React from 'react';
import {cardDeck, makeMultiDecks, shuffleDeck} from './card.js';
import './Quiz.css';
import poker from './blackjackbackground.jpg';
import blackjackWelcome from './blackjackquizWelcome.jpg'
import {getHint} from './hintAnswer';
//import {Text} from "react-native";
const blankCard =  "./cardImages/200px-Card_back_05.svg.png";
class Game extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

         // optionsChosen: false,

          gameDeck: cardDeck,

          playerHands: [], //stored in Array to add hands later
          dealerHand: '',
          showDealerCards: false, //hide one card for the dealer
          gameStarted: false,
          welcome: true,
          results: false,
          AnswerNum: 1,
          answerMessage: "Nice job, you got the right answer!",
          QuestionCount: true,
          choiceDisabled: false,
          pastScores: [],
          lastTenScores: [],
          score:0,
          currentQ: 0,
          totalQuestions: 0,
          totalScore:0,
          playerPoints:0,
          dealerPoints:0,
          classDouble: "start",
          classSplit: "start",
          classHit: 'start',
          classStand: 'start',
          classSurrender: 'start',
          choice: "",
          answer: "start",
          highScore: 0,
          numGames: 0,
          playerAnswers: [],
          dealerAnswers: [],
          answerChoice: [],
          handNum: 0,
          playerHint: "",
          dealerHint: "" 

          

    }
    



    this.start = this.start.bind(this);
    this.welcome = this.welcome.bind(this);
    this.results = this.results.bind(this);
    this.resetHandle = this.resetHandle.bind(this);
    this.seeAnswers = this.seeAnswers.bind(this);

  }



/******************************************************************************/
//----------GAME SET-UP---------------------------------------------------------
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
/*  Deal first hands for the player and dealer */
  makeFirstHands() {
    //const setChoice = this.props.setChoice;
    this.setState({choices: ""});
   // setChoice("");
    console.log(this.props.choice);

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
   //this.setState({playerPoints: playerFirstPoints});
   this.state.playerPoints = playerFirstPoints;
   //this.state.playerHint = this.state.playerHands[0];
   console.log(this.state.playerHint);
  

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
   //  "naturalBlackjack": dealerNaturalBlackjack,
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
    // "splitDisabled": disabledSplit,
     "hitDisabled": false,
     "standDisabled": false,
     "doubleDisabled": false,
     "hintDisabled": false,
     "surrenderDisabled": false,
    // "naturalBlackjack": playerNaturalBlackjack,
   }

   firstHands.dealer = dealerFirstHand;
   firstHands.player = playerFirstHand;
   this.state.playerHint = firstHands.player;
   this.state.dealerHint = firstHands.dealer;
   console.log(this.state.playerHint);
   //if (this.props.currentQ>0 && this.props.currentQ <5){
   //  this.setState({})
  
  // }
  //this.setCorrectAnswers();

   return firstHands; //Returns an array of JS objects containing the hand info
  }

  



/******************************************************************************/
//----------DISPLAY__-----------------------------------------------------------
/******************************************************************************/


//______________________________________________________________________________
/*  Show every player hand using the .map() function */
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


//___________________________________________________________________________
/*  Show the first dealer hand in the game, with one card hidden */
  displayHiddenDealerHand() {
    const styleHand = {
      fontSize: 25
    }
    let shownCard = this.state.dealerHand.cards[1];
    return (
     
     <div style = {styleHand} className = "dealer">
       <div id ="dealerID">Dealer Points: {this.state.dealerHand.shownPoints}</div>
      
        <img className="cardDisplayQuiz" src={blankCard} alt="back of card" />
        <img className="cardDisplayQuiz" src={shownCard.imagePath} alt={shownCard.shortName} />
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
      <div className="dealer" >
        <div>
          Dealer Points: {this.state.dealerHand.points}&nbsp;
          {this.state.dealerHand.gameOverMessage}
        </div>
        {cards}
      </div>

    return displayHTML;
  }
/* This function leeps track and displays the Question number of the quiz*/ 
  displayQuestionNumber(){
    const styleQuestion = {
      fontSize: 25
    }
    //var currentQ = this.props.currentQ;
    var questions = this.props.questions;
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
      
        console.log(this.props.questionCount);
        console.log(this.props.currentQ);
        }
        
          
  seeAnswers(){
          this.setState({currentQ: this.state.currentQ+1});
          this.setState({results: false});
          this.setState({gameStarted: true});
          this.newGame();
        }
        
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
        
        if (this.state.pastScores.length>10){
          for (let i =0; i<10; i++){
            this.setState({ lastTenScores:  [...this.state.lastTenScores, this.state.pastScores[i]]});
          }
           PreviousScores = this.state.lastTenScores;
        } 
        else{
          PreviousScores = this.state.pastScores;
        }   
        let results =
          <div className = "results">
            <h4 style = {styleResult}>  {comment}</h4>
              <h4 style = {styleResult}>You got {this.state.score} out of 10 correct! &nbsp; {percentage}%</h4>
                 <h4 style = {styleResult}>Your high score is : {this.state.highScore}</h4>
                  <h4 style = {styleResult}>Your average score is: {averageScore} </h4>
                  <h4 style = {styleResult}> Your last scores are: {PreviousScores}</h4>
             <button className = "start" id = "tryAgain" onClick = {this.resetHandle.bind(this)}> Try Again! </button>
                <div className = "divider"></div>
              <button className = "start" id = "SeeAnswers" onClick = {this.seeAnswers.bind(this)}> See Answers </button>
               </div>
        
          return results;
        
  }

  welcome(){
      const test={
        fontSize: 40,
       }
      const styleObj2 ={
      fontSize: 30,
    }
      let welcome = 
      <div className = "welcomePage">
      <h4>
         <p style = {test}>Welcome to the Black Jack Quiz!</p>
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



/******************************************************************************/
//----------GAMEPLAY-----------------------------------------------------------
/******************************************************************************/


//______________________________________________________________________________
/*  Hit - Get a new card for the player hand, add it, and update the points, etc */
hit(){
    this.setState({choice: "hit"});
    this.setState({classHit: 'startClick'});
    this.setState({classStand: 'start'});
    this.setState({classSplit: "start"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
  }


//______________________________________________________________________________
/*  Double - get one more card, and stand (if not bust) */
Double(){
     this.setState({choice: "double"});
     this.setState({classHit: 'start'});
     this.setState({classStand: 'start'});
     this.setState({classSplit: "start"});
     this.setState({classDouble: "startClick"});
     this.setState({classSurrender: "start"});
     this.setState({nextDisabled: false}); 
   }

//______________________________________________________________________________
/*  Split - if both of the first cards have the same points, make
    a new hand from the second card of the original hand.
    Then deal new cards and add them to both hands.

    NB - Only a 2 card hand may be split
*/
split (){
    
    this.setState({choice: "split"});
    this.setState({classHit: 'start'});
    this.setState({classStand: 'start'});
    this.setState({classSplit: "startClick"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
   }


//______________________________________________________________________________
/*  Stand - stop playing for a specific hand.
    If all hands are not active, and some are not bust, the dealer should
    start playing, too.
*/
stand(){
    this.setState({choice: "stand"});
    this.setState({classHit: 'start'});
    this.setState({classStand: 'startClick'});
    this.setState({classSplit: "start"});
    this.setState({classDouble: "start"});
    this.setState({classSurrender: "start"});
    this.setState({nextDisabled: false});
    
    }
//______________________________________________________________________________
/*  Surrender -  */

Surrender(){
  this.setState({choice: "surrender"});
  this.setState({classHit: 'start'});
  this.setState({classStand: 'start'});
  this.setState({classSplit: "start"});
  this.setState({classDouble: "start"});
  this.setState({classSurrender: "startClick"});
  this.setState({nextDisabled: false});
}





/******************************************************************************/
//----------OPTIONS & START-----------------------------------------------------
/******************************************************************************/
/*previousQuestion(){
  if (this.state.currentQ>0 && this.state.currentQ < 11){
  
    this.setState({currentQ: this.state.currentQ-1});
    this.setState ({playerHands:  [this.state.playerAnswers[this.state.handNum]]});
    this.setState ({dealerHand: this.state.dealerAnswers[this.state.handNum]});
  }
}*/

//______________________________________________________________________________
/*  Reset & restart the game */
  newGame() {
  
    
    console.log(this.state.handNum);
    this.setState({currentQ: this.state.currentQ+1});
    this.setState({nextDisabled: true});

    let firstHands = this.makeFirstHands(); 
    this.setCorrectAnswers();
  
    if(this.state.currentQ ===10){
        this.setState({results: true});
        //this.state.pastScores.push(this.state.score+",");
        console.log("current score:" + this.state.score);
        console.log(this.state.pastScores);
        this.setState({gameStarted: false});  
        

    }
    

    if(this.state.currentQ !==5 && this.state.gameStarted === false) {
      this.setState({gameStarted: true});
    }
     
    if (this.state.answer === this.state.choice)
    {
      this.setState({score: this.state.score+1});
      this.setState({totalScore: this.state.totalScore+1});
    }

    let LocalAnswerChoice = {
        "choice": this.state.choice,
        "answer": this.state.answer,
      }
  
      if(this.state.currentQ  <11){
        this.setState({choiceDisabled: false})
        this.setState({classHit: 'start'});
        this.setState({classStand: 'start'});
        this.setState({totalQuestions: this.state.totalQuestions +1});
        this.setState({classDouble: "start"});
        this.setState({classSplit: "start"});
        this.setState({classSurrender:'start'});
        this.setState ({playerHands: [firstHands.player]});
        this.setState ({dealerHand: firstHands.dealer});
        this.setState ({showDealerCards: false});
        this.setState({ answerChoice: [...this.state.answerChoice, LocalAnswerChoice]});
        this.setState({ playerAnswers: [...this.state.playerAnswers, this.state.playerHands]});
        this.setState({ dealerAnswers:  [...this.state.dealerAnswers, this.state.dealerHands]});
        this.setState({ playerAnswers: [...this.state.playerAnswers, firstHands.player]});
        this.setState({dealerAnswers: [...this.state.dealerAnswers, firstHands.dealer]});
        
  }
  else if(this.state.currentQ ===21){
        this.setState({AnswerNum: 1});
        this.setState({gameStarted: false});
        this.setState({welcome: true});
        this.setState({currentQ: 0});
        this.setState({handNum: 0});
       
  }
    else{
        this.setState({results: false})
        this.setState({nextDisabled: false})
      

    /*  Player hand stored as an array so more hands can be added later */

       this.setState ({playerHands:  [this.state.playerAnswers[this.state.handNum]]});
       this.setState ({dealerHand: this.state.dealerAnswers[this.state.handNum]});
       this.setState ({showDealerCards: false});
       this.setState({handNum: this.state.handNum+1});
       this.setState({AnswerNum: this.state.AnswerNum + 1});
       this.setState({choiceDisabled: true});
       this.setState({classHit: 'answers'});
       this.setState({classStand: 'answers'});
       this.setState({classDouble:"answers"});
       this.setState({classSplit:"answers"});
       this.setState({classSurrender:"answers"});  
       this.setButtonColor(); 
        console.log(this.state.playerAnswers[this.state.handNum]);
        console.log(this.state.choiceDisabled)
        console.log(this.state.handNum);
       // console.log(this.state.playerAnswers);
   }
   
   // this.setCorrectAnswers();
    this.setState({choice: ""});
    console.log(this.state.answerChoice);
    console.log(this.state.playerAnswers);
    console.log(this.state.dealerAnswers);
   
 }


//______________________________________________________________________________
/*  Render the game after gameplay options were set (Surrender allowed etc) */
    start() {
      
    this.setState({classHit: "start"});
    this.setState({classStand: "start"});
    this.setState({score: 0});
    this.state.playerAnswers.length = 0;
    this.state.dealerAnswers.length = 0;
    this.state.answerChoice.length = 0;
    this.setState({optionsChosen: true});
    this.setState({welcome: false});
    console.log(this.state.playerAnswers);
    console.log(this.state.dealerAnswers);
    console.log(this.state.answerChoice);



      if(this.state.gameStarted === false) {
        this.newGame();
      }
    }

    setCorrectAnswers(){

      let playerHint = getHint(this.state.dealerHint, this.state.playerHint, true,  true, true);
      this.setState({answer: playerHint.shortHint});
      console.log(this.state.answer);
  }




    setButtonColor(){
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
       
   }  if (correctAnswer && playerChoice ==="surrender"){
        this.setState({classSurrender:"correct"});
        this.setState({answerMessage: "Nice job, you got the right answer!"});
       
}
///////////////Answer: Hit///////////////////////////////
       if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
       && this.state.answerChoice[this.state.AnswerNum].choice==="stand" && this.state.answerChoice[this.state.AnswerNum].answer ==="hit"){  
        this.setState({classHit: 'correct'});
        this.setState({classStand: 'wrong'});
        this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
       
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="split" && this.state.answerChoice[this.state.AnswerNum].answer ==="hit"){  
   this.setState({classHit: 'correct'});
   this.setState({classSplit:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
  
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="double" && this.state.answerChoice[this.state.AnswerNum].answer ==="hit"){  
   this.setState({classHit: 'correct'});
   this.setState({classDouble:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
  
}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="surrender" && this.state.answerChoice[this.state.AnswerNum].answer ==="hit"){  
   this.setState({classHit: 'correct'});
   this.setState({classSurrender:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Hit!"});
  
}
////////////////////////Answer: stand//////////////////////////////////////////
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="hit" && this.state.answerChoice[this.state.AnswerNum].answer ==="stand"){  
   this.setState({classHit: 'wrong'});
   this.setState({classStand: 'correct'});
   this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});

}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="split" && this.state.answerChoice[this.state.AnswerNum].answer ==="stand"){  
   this.setState({classStand: 'correct'});
   this.setState({classSplit:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
  
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="double" && this.state.answerChoice[this.state.AnswerNum].answer ==="stand"){  
   this.setState({classStand: 'correct'});
   this.setState({classDouble:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="surrender" && this.state.answerChoice[this.state.AnswerNum].answer ==="stand"){  
   this.setState({classStand: 'correct'});
   this.setState({classSurrender:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Stand!"});
}

///////////////////////////Answer: Split//////////////////////////////

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="hit" && this.state.answerChoice[this.state.AnswerNum].answer ==="split"){  
   this.setState({classHit: 'wrong'});
   this.setState({classSplit:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
  
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="stand" && this.state.answerChoice[this.state.AnswerNum].answer ==="split"){  
   this.setState({classStand: 'wrong'});
   this.setState({classSplit:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
  }
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="double" && this.state.answerChoice[this.state.AnswerNum].answer ==="split"){  
   this.setState({classDouble:"wrong"});
   this.setState({classSplit:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="surrender" && this.state.answerChoice[this.state.AnswerNum].answer ==="split"){  
   this.setState({classSplit:"correct"});
   this.setState({classSurrender:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Split!"});
}


///////////////////////////Answer: Double//////////////////////////////////////


if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="hit" && this.state.answerChoice[this.state.AnswerNum].answer ==="double"){  
   this.setState({classHit: 'wrong'});
   this.setState({classDouble:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
 
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="stand" && this.state.answerChoice[this.state.AnswerNum].answer ==="double"){  
   this.setState({classStand: 'wrong'});
   this.setState({classDouble:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
  
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="split" && this.state.answerChoice[this.state.AnswerNum].answer ==="double"){  
   this.setState({classDouble:"correct"});
   this.setState({classSplit:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
 
}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="surrender" && this.state.answerChoice[this.state.AnswerNum].answer ==="double"){  
   this.setState({classDouble:"correct"});
   this.setState({classSurrender:"wrong"});
   this.setState({answerMessage: "Unlucky, the correct answer was Double!"});
}
///////////////////////Answer: Surrender///////////////////////////////////////

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="hit" && this.state.answerChoice[this.state.AnswerNum].answer ==="surrender"){  
   this.setState({classHit: 'wrong'});
   this.setState({classSurrender:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="stand" && this.state.answerChoice[this.state.AnswerNum].answer ==="surrender"){  
   this.setState({classStand: 'wrong'});
   this.setState({classSurrender:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
}
if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="split" && this.state.answerChoice[this.state.AnswerNum].answer ==="surrender"){  
   this.setState({classSplit:"wrong"});
   this.setState({classSurrender:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
}

if (this.state.answerChoice[this.state.AnswerNum].answer!==this.state.answerChoice[this.state.AnswerNum].choice 
  && this.state.answerChoice[this.state.AnswerNum].choice==="double" && this.state.answerChoice[this.state.AnswerNum].answer ==="surrender"){  
   this.setState({classDouble:"wrong"});;
   this.setState({classSurrender:"correct"});
   this.setState({answerMessage: "Unlucky, the correct answer was Surrender!"});
}










    
    }


////////////////////////////////////////////////////////////////////////////////
//----------RENDER--------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////



  render() {

    return(
        <div className="game">
        <div>
        {this.state.QuestionCount === true && this.displayQuestionNumber()}
        {this.state.welcome === true && this.welcome()}
        {this.state.results === true && this.results()}
         
        {this.state.gameStarted === true &&
        <div>
    
          {this.state.showDealerCards === true &&
            this.displayWholeDealerHand()
          }
    
          {this.state.showDealerCards === false &&
            this.displayHiddenDealerHand()
          }
        <br/>
        
        {this.displayAllPlayerHands()} <br/>
        <div id="gameOptions">
          <button className = "start" id = "newQuestion" disabled={this.state.nextDisabled} onClick={() => {this.newGame()}}>Next Question</button>
        </div>
           <br/>
        </div>
        
        }
        </div>
      </div>
        
    );
  }


}

export default Game;
