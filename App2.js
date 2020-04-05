import React from 'react';
import QuestionCount from './QuestionCount.js';
//import QuestionList from './QuestionList.js';
import Results from './Results.js';
//import Question from './Question.js';
import {QuestionSheet} from './QuestionSheet';
import Welcome from './Welcome';
import Game from './Game.js';
import css from './App.css';
//import Game2 from './Game2.js';
//import $ from 'jquery';
const questions = QuestionSheet;

class App2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: questions,
      score: 0,
      currentQ: 0,
      choice: "",
      answer: "",
      highScore: 0,
      numGames: 0,
      totalScore: 0,
      playerAnswers: [],
      dealerAnswers: [],
      handNum: 0
      
     
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
 var questionCount = "";
 var game = '';
 this.state.playerAnswers = [];
 this.state.dealerAnswers = [];
 
 
 var welcome = <Welcome setCurrentQ ={this.setCurrentQ.bind(this)}{...this.state} />
 }

    else if ((this.state.currentQ !== 0) && (this.state.currentQ <= this.state.questions.length)){
questionCount = <QuestionCount{...this.state}/>
var results = '';
welcome = '';
game = <Game setChoice = {this.setChoice.bind(this)}
setScore={this.setScore.bind(this)}
setTotal = {this.setTotal.bind(this)}
setCurrentQ ={this.setCurrentQ.bind(this)}
setGames= {this.setGames.bind(this)}
{...this.state}/>

}else if (this.state.currentQ === this.state.questions.length+1) {
questionCount ='';
welcome = '';
game = '';
results = <Results setGames = {this.setGames.bind(this)} 
          setPlayerAnswers = {this.setPlayerAnswers.bind(this)}
          setDealerAnswers = {this.setDealerAnswers.bind(this)}
           setTotal = {this.setTotal.bind(this)}
           setScore={this.setScore.bind(this)}
           setHighScore = {this.setHighScore.bind(this)}
           setCurrentQ = {this.setCurrentQ.bind(this)}
           {...this.state} />
    }
else if  ((this.state.currentQ>=6) && (this.state.currentQ <=9)){ 
questionCount =' Here are your answers to the quiz!';
results = '';
welcome = '';
game = <Game setChoice = {this.setChoice.bind(this)}
setAnswer = {this.setAnswer.bind(this)}
setScore={this.setScore.bind(this)}
setTotal = {this.setTotal.bind(this)}
setCurrentQ ={this.setCurrentQ.bind(this)}
setGames= {this.setGames.bind(this)}
sethandNum={this.sethandNum.bind(this)}
{...this.state}/>
}
else {
  this.setState({currentQ:0});
 // this.setState({playerAnswers: ""});
 // this.setState({dealerAnswers: ""});
 this.state.playerAnswers = [];
 this.state.dealerAnswers = [];
 this.state.handNum = 0;
  console.log(this.state.currentQ);
  console.log(this.state.playerAnswers);
 // this.setState({handNum: 0});
}

   
/*The return method calls variable questionCount to display current question as long as you havent reached
  the end of the quiz. In that case it is set to an empty string. Then Question list is called passing in
  setter methods and all states. Question list will render current question answers. Result is then rendered once
  current becomes larger than array length.
*/

    return (
     
      <div className = "main">
        {welcome}
        {questionCount}
        {game}
        {results}
      </div>
    );
  }
}

export default App2;