import React from 'react';
import QuestionCount from './QuestionCount.js';
import Results from './Results.js';
//import Welcome from './Welcome';
import Game from './Game.js';
//import GameTutor from './GameTutor';
import css from './Quiz.css';
import WelcomeCss from './Welcome.css';
import { Redirect } from 'react-router-dom';

class App2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
      score: 0,
      currentQ: 0,
      choice: "",
      answer: "Card",
      highScore: 0,
      numGames: 0,
      totalScore: 0,
      playerAnswers: [],
      dealerAnswers: [],
      answerChoice: [],
      //answerMessage: "Nice job, you got the right answer!",
      classHit: 'start',
      classStand: 'start',
      handNum: 1,
      
    }

    this.setCurrentQ = this.setCurrentQ.bind(this);
    this.setScore = this.setScore.bind(this);
    this.setChoice = this.setChoice.bind(this);
    this.setHighScore = this.setHighScore.bind(this);
    this.setGames = this.setGames.bind(this);
    this.setTotal = this.setTotal.bind(this);
    this.sethandNum = this.sethandNum.bind(this);
    this.setDealerAnswers= this.setDealerAnswers.bind(this);
    this.setPlayerAnswers = this.setPlayerAnswers.bind(this);
    this.setAnswer = this.setAnswer.bind(this);
    this.setClassHit = this.setClassHit.bind(this);
    this.setClassStand = this.setClassStand.bind(this);
    this.setAnswerMessage = this.setAnswerMessage.bind(this);
   
  }
  setAnswerMessage(answerMessage){
    this.setState({answerMessage});
  }
  setClassStand(classStand){
  this.setState({classStand});
}

 setClassHit(classHit){
   this.setState({classHit});
 }
 setAnswer(answer){
   this.setState({answer});
 }
  setTotal(totalScore){
 this.setState({totalScore});
  }
 
  setGames(numGames){
 this.setState({numGames});
  }
  setHighScore(highScore){
this.setState({highScore});
  }
 
  setCurrentQ(currentQ) {
    this.setState({currentQ});
  }
  setScore(score) {
    this.setState({score});
  }
  setChoice(choice) {
 this.setState({choice});
  }
  sethandNum(handNum){
    this.setState({handNum});
  }
  setPlayerAnswers(playerAnswers){
    this.setState({playerAnswers});
  }
  setDealerAnswers(dealerAnswers){
    this.setState({dealerAnswers});
  }
 
  /* If the current question is less than amount of questions, then call on the questionCount component
    to return which question you are on...eg 1 out of 4... If the current question
    reaches more than number of questions in quiz, you have come to the end and result component is called
  */

 
  render() {
    

if(this.state.currentQ === 0){
  console.log(this.state.currentQ);
  console.log(this.state.playerAnswers);
  console.log(this.state.dealerAnswers);
  this.state.classHit = "start";
  this.state.classStand = "start";
  this.state.score = 0;
  var questionCount = "";
  var game = '';
  this.state.playerAnswers = [];
  this.state.dealerAnswers = [];
  this.state.answerChoice= [];
 // var game = <Welcome setCurrentQ ={this.setCurrentQ.bind(this)}{...this.state} />
//  var welcome = <Welcome setCurrentQ ={this.setCurrentQ.bind(this)}{...this.state} />
 }

 if ((this.state.currentQ >= 0) && (this.state.currentQ <= 4)){
  questionCount = <QuestionCount{...this.state}/>
  var results = '';
  //welcome = '';
   game = <Game setChoice = {this.setChoice.bind(this)}
          setAnswerMessage = {this.setAnswerMessage.bind(this)}
          setClassStand = {this.setClassStand.bind(this)}
          setClassHit = {this.setClassHit.bind(this)}
          setAnswer = {this.setAnswer.bind(this)}
          setChoice ={this.setChoice.bind(this)}
          setScore={this.setScore.bind(this)}
          setTotal = {this.setTotal.bind(this)}
          setCurrentQ ={this.setCurrentQ.bind(this)}
          setGames= {this.setGames.bind(this)}
          setClassHit = {this.setClassHit.bind(this)}
          setPlayerAnswers = {this.setPlayerAnswers.bind(this)}
          setDealerAnswers = {this.setDealerAnswers.bind(this)}
          setHighScore = {this.setHighScore.bind(this)}
          
          {...this.state}/>
  }
  /*
else if (this.state.currentQ === 5) {
//  questionCount ='';
 // welcome = '';
//  game = '';
 var  results = <Results setGames = {this.setGames.bind(this)} 
          setClassStand = {this.setClassStand.bind(this)}
          setClassHit = {this.setClassHit.bind(this)}
          setPlayerAnswers = {this.setPlayerAnswers.bind(this)}
          setDealerAnswers = {this.setDealerAnswers.bind(this)}
           setTotal = {this.setTotal.bind(this)}
           setScore={this.setScore.bind(this)}
           setHighScore = {this.setHighScore.bind(this)}
           setCurrentQ = {this.setCurrentQ.bind(this)}
           {...this.state} />
  }*/
else   {
//((this.state.currentQ>=6) && (this.state.currentQ <=9)){ 
  questionCount = "Question " + this.state.handNum +":           " + this.state.answerMessage;
  results = '';
  //welcome = '';
  game = <Game setChoice = {this.setChoice.bind(this)}
          setAnswerMessage = {this.setAnswerMessage.bind(this)}
          setClassStand = {this.setClassStand.bind(this)}
          setClassHit = {this.setClassHit.bind(this)}
          setAnswer = {this.setAnswer.bind(this)}
          setScore={this.setScore.bind(this)}
          setTotal = {this.setTotal.bind(this)}
          setCurrentQ ={this.setCurrentQ.bind(this)}
          setGames= {this.setGames.bind(this)}
          sethandNum={this.sethandNum.bind(this)}
          setPlayerAnswers = {this.setPlayerAnswers.bind(this)}
          setDealerAnswers = {this.setDealerAnswers.bind(this)}
          setHighScore = {this.setHighScore.bind(this)}
          {...this.state}/>
}
//else {
 //this.setState({currentQ:0});
 //this.state.playerAnswers = [];
 //this.state.dealerAnswers = [];
 //this.state.handNum = 0;
 // console.log(this.state.currentQ);
 // console.log(this.state.playerAnswers);
 
//}

  
/*The return method calls variable questionCount to display current question as long as you havent reached
  the end of the quiz. In that case it is set to an empty string. Then Question list is called passing in
  setter methods and all states. Question list will render current question answers. Result is then rendered once
  current becomes larger than array length.
*/

    return (
     
      <div className = "main">
        {/*welcome*/}
    {/*questionCount*/}
        {game}
        {/*results*/}
      </div>
    );
  }
}

export default App2;