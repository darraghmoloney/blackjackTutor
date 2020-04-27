import React from 'react';
import {cardDeck, makeMultiDecks, shuffleDeck} from './card.js';
import './Quiz.css';


const blankCard =  "./cardImages/200px-Card_back_05.svg.png";
const nextChoice = "";
class GameTutor extends React.Component {

  constructor(props) {

    super(props);

    this.state = {

         // optionsChosen: false,

          gameDeck: cardDeck,

          playerHands: [], //stored in Array to add hands later
          dealerHand: '',
          activeHands: 0,
          totalHands: 0,
          bustHands: 0,
          showDealerCards: false, //hide one card for the dealer
          gameStarted: false,
          welcome: true,
          results: false,
          AnswerNum: 1,
          answerMessage: "Nice job, you got the right answer!",
          QuestionCount: true,
          nextDiasbled: false,
          playerPoints:0,
          dealerPoints:0,
          PP: [],
          DP: []
          

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
    const setChoice = this.props.setChoice;

    setChoice("");
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
   //if (this.props.currentQ>0 && this.props.currentQ <5){
   //  this.setState({})
  
  // }

   return firstHands; //Returns an array of JS objects containing the hand info
  }



/******************************************************************************/
//----------DISPLAY__-----------------------------------------------------------
/******************************************************************************/


//______________________________________________________________________________
/*  Show every player hand using the .map() function */
  displayAllPlayerHands() {
    const setClassHit = this.props.setClassHit;
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

          <div className="playerStatus">
            <span id="playerPoints">Player Points: {hand.points}</span>
            <span id="handStatus"> &nbsp; {hand.gameOverMessage}</span>
          </div>

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

      return hands;
  }


//____{//<div id="dealerPoints">Dealer Points: {this.state.dealerHand.shownPoints}</div>}_{//<div id="dealerCards" className="dealerShow">}_________________________________________________________________________
/*  Show the first dealer hand in the game, with one card hidden */
  displayHiddenDealerHand() {
    let shownCard = this.state.dealerHand.cards[1];
    return (
     
     <div className = "dealer">
       <div id ="dealerID">Dealer Points: {this.state.dealerHand.shownPoints}</div>
      
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

    var currentQ = this.props.currentQ;
    var questions = this.props.questions;
      if(currentQ===0 || currentQ === 5){
    
        let displayQuestionNumber = "";
        return displayQuestionNumber;
      }
    if (currentQ>0 && currentQ<5){
      let displayQuestionNumber = 
         <div className = "questionCount">
          <h4> Question {currentQ} / 4</h4>
         </div>
       return displayQuestionNumber;
     }
     else{
       let displayQuestionNumber = 
       <div className = "questionCount">
       <h4> Question {(this.state.AnswerNum-1)} / 4:  {this.state.answerMessage}</h4>
      </div>
      return displayQuestionNumber;
     }
     
  }
  
  resetHandle(){
        const {setCurrentQ, setScore, setGames, currentQ, setClassStand, setClassHit} = this.props;

        setClassStand("start");
        setClassHit("start");
        setCurrentQ(this.props.currentQ - 5);
        console.log(this.props.currentQ);
        setScore(this.props.score === 0);
        setGames(this.props.numGames + 1);
        console.log(currentQ);
        console.log(this.props.questionCount);
        this.setState({results: false});
        this.setState({welcome: true});
        }
        
          
  seeAnswers(){
          const {setCurrentQ} = this.props;
          const currentQ = this.props.currentQ;
         // let six = 6;
          //this.setState({currentQ: six});
          setCurrentQ(this.props.currentQ + 1);
          console.log(currentQ);
          this.setState({results: false});
          this.setState({gameStarted: true});
          this.newGame();
        }
        
  results(){ 
        const {setHighScore, highScore} = this.props;
        var averageScore = (this.props.totalScore/this.props.numGames);
            var percentage = (this.props.score / 4* 100);
            var comment = '';
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
               
                if (this.props.score > highScore){
                     setHighScore(this.props.score);
                }
               
        let results =
          <div className = "results">
              <h4>You got {this.props.score} out of 4 correct!</h4>
                <h4>{percentage}% - {comment}</h4>
                 <h4>Your high score is : {highScore}</h4>
                  <h4>Your average score is: {averageScore} </h4>
             <button className = "start" id = "tryAgain" onClick = {this.resetHandle.bind(this)}> Try Again! </button>
                <div className = "divider"></div>
              <button className = "start" id = "SeeAnswers" onClick = {this.seeAnswers.bind(this)}> See Answers </button>
               </div>
        
          return results;
        
  }

  welcome(){
   
      let welcome = 
      <div className = "welcomePage">
      <h4>
         <p >Welcome to the Black Jack Quiz!</p>
           <p>Please select your difficulty below..</p></h4>
        <button id = "beginner">Beginner</button>
          <div className = "divider"></div>
        <button id = "beginner">Intermediate</button>
          <div className = "divider"></div>
        <button id = "beginner">Advanced</button>
         <br/><br/>
        <button className = "start" id = "startQuiz"  onClick={() => {this.start()}}>Start Quiz!</button>
       
    </div>
    return welcome;
  }



/******************************************************************************/
//----------GAMEPLAY-----------------------------------------------------------
/******************************************************************************/


//______________________________________________________________________________
/*  Hit - Get a new card for the player hand, add it, and update the points, etc */
hit(){
 
    const choice = this.props;
    const setChoice = this.props.setChoice;
    const setClassStand = this.props.setClassStand;
    const setClassHit = this.props.setClassHit;
    setChoice("Hit");
    setClassStand("start");
    setClassHit("startClick");
    this.setState({nextDisabled: false});
  }


//______________________________________________________________________________
/*  Double - get one more card, and stand (if not bust) */


//______________________________________________________________________________
/*  Split - if both of the first cards have the same points, make
    a new hand from the second card of the original hand.
    Then deal new cards and add them to both hands.

    NB - Only a 2 card hand may be split
*/
split (){
    const setChoice = this.props.setChoice;
    const choice = this.props;
    setChoice("Split");
    this.setState({nextDisabled: false});
   }


//______________________________________________________________________________
/*  Stand - stop playing for a specific hand.
    If all hands are not active, and some are not bust, the dealer should
    start playing, too.
*/
stand(){
    const {setChoice, setClassStand, setClassHit, choice }= this.props;
    setChoice("Stand");
    setClassStand("startClick");
    setClassHit("start");
    this.setState({nextDisabled: false});
    
    }


/******************************************************************************/
//----------OPTIONS & START-----------------------------------------------------
/******************************************************************************/


//______________________________________________________________________________
/*  Reset & restart the game */
  newGame() {
  
    const {playerFirstPoints, dealerFirstPoints, setAnswerMessage, setClassHit, setClassStand, 
          answerChoice, dealerAnswers, playerAnswers, currentQ, setCurrentQ, handNum, sethandNum,
          answer, setAnswer, setChoice,  setScore, score, choice} = this.props;
    const correct = "correct";
    const wrong = "wrong";
    const start = "start";
    const Stand = "Stand";
    const Hit = "Hit";
    const Split = "Split";
    const reSet = "";

    //setChoice(reSet);
    setCurrentQ(currentQ+1);

    let firstHands = this.makeFirstHands(); //Deal new hands
    console.log(currentQ);
    console.log(choice);
    
    if(choice===""){
       this.setState({nextDisabled: true});
    }
   
    if(this.props.currentQ ===4){
        this.setState({results: true});
        this.setState({gameStarted: false});

    }

    if(currentQ !==5 && this.state.gameStarted === false) {
      this.setState({gameStarted: true});
    }
     
    if (this.props.answer === this.props.choice)
    {
      setScore(this.props.score+1);
    }

    let LocalAnswerChoice = {
        "choice": choice,
        "answer": answer,
      }
  
      if(this.props.currentQ  <5){
        setClassHit("start");
        setClassStand("start");
        this.setState ({playerHands: [firstHands.player]});
        this.setState ({dealerHand: firstHands.dealer});
        this.setState ({showDealerCards: false});
        this.setState({answerChoice: answerChoice.push(LocalAnswerChoice)});
        this.setState({playerAnswers: playerAnswers.push(this.state.playerHands)});
        this.setState({dealerAnswers: dealerAnswers.push(this.state.dealerHand)});
        this.setState({playerAnswers: playerAnswers.push(firstHands.player)});
        this.setState({dealerAnswers: dealerAnswers.push(firstHands.dealer)});
  }
  else if(this.props.currentQ ===9){
        this.setState({AnswerNum: 1});
        this.setState({gameStarted: false});
        this.setState({welcome: true});
        setCurrentQ(currentQ-9);
        sethandNum(1);
  }
    else{
        this.setState({results: false})
        this.setState({nextDisabled: false})
        this.setButtonColor(); 

    /*  Player hand stored as an array so more hands can be added later */
        this.setState ({playerHands:  [playerAnswers[handNum]]});
        this.setState ({dealerHand: dealerAnswers[handNum]});
        this.setState ({activeHands: 1});
        this.setState ({totalHands: 1});
        this.setState ({showDealerCards: false});
        this.setState ({bustHands: 0});
        sethandNum(handNum+2);
        this.setState({AnswerNum: this.state.AnswerNum + 1});
        console.log(handNum);
        console.log(playerAnswers);
   }
   
    this.setCorrectAnswers();
    setChoice("");
 }


//______________________________________________________________________________
/*  Render the game after gameplay options were set (Surrender allowed etc) */
    start() {
     
      this.setState({optionsChosen: true});
      this.setState({welcome: false});

      if(this.state.gameStarted === false) {
        this.newGame();
      }
    }


    setCorrectAnswers(){
      const {setAnswer, answer, currentQ} = this.props;

      if(this.state.dealerPoints===2 && (this.state.playerPoints>=13 && this.state.playerPoints<=21))
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(this.state.playerPoints);
        console.log(answer);
      }
      else if(this.state.dealerPoints===3 && (this.state.playerPoints>=13 && this.state.playerPoints<=21))
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(answer);
      }
      else if(this.state.dealerPoints===4 && (this.state.playerPoints>=12 && this.state.playerPoints<=21))
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(answer);
      }
      else  if(this.state.dealerPoints===5 && (this.state.playerPoints>=12 && this.state.playerPoints<=21))
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(answer);
      }
     else if(this.state.dealerPoints===6 && (this.state.playerPoints>=12 && this.state.playerPoints<=21))
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(this.state.playerPoints);
        console.log(answer);
      }
      else if(this.state.dealerPoints>=7 && (this.state.playerPoints>=17 && this.state.playerPoints<=21))  
      {
        setAnswer("Stand");
        this.setState({answer: "Stand"});
        console.log(answer);
        console.log(this.state.dealerPoints);
        console.log(this.state.playerPoints);
      }
      else
      {
        setAnswer("Hit");
        this.setState({answer: "Hit"});
        console.log(answer);
        console.log(this.state.DP[currentQ]);
        console.log(this.state.PP[currentQ]);

      }
    }



    setButtonColor(){
      const {answerChoice,setClassHit, setClassStand} = this.props;
      if (answerChoice[this.state.AnswerNum].answer===answerChoice[this.state.AnswerNum].choice && answerChoice[this.state.AnswerNum].answer==="Hit"){
          setClassHit("correct");
          setClassStand("start");
          this.setState({answerMessage: "Nice job, you got the right answer!"});
     }
      if (answerChoice[this.state.AnswerNum].answer===answerChoice[this.state.AnswerNum].choice && answerChoice[this.state.AnswerNum].answer==="Stand"){
          setClassStand("correct");
          setClassHit("start");
          this.setState({answerMessage: "Nice job, you got the right answer!"});
     }
      if (answerChoice[this.state.AnswerNum].answer!==answerChoice[this.state.AnswerNum].choice && answerChoice[this.state.AnswerNum].choice==="Stand"){
          setClassStand("wrong");
          setClassHit("correct");
          this.setState({answerMessage: "Unlucky, you answered that question incorrect!"});
     }
      if (answerChoice[this.state.AnswerNum].answer!==answerChoice[this.state.AnswerNum].choice && answerChoice[this.state.AnswerNum].choice==="Hit"){
         setClassStand("correct");
         setClassHit("wrong");
         this.setState({answerMessage: "Unlucky, you answered that question incorrect!"});
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
        
        {this.displayAllPlayerHands()} <br/>
        <div id="gameOptions">
          <button className = "start" id = "newQuestion" disabled={this.state.nextDisabled} onClick={() => {this.newGame()}}>Next Question</button>
        </div>
        </div>
        
        }
        </div>
      </div>
        
    );
  }


}

export default GameTutor;
