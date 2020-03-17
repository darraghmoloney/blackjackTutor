import React from 'react';
import QuestionCount from './QuestionCount.js';
import QuestionList from './QuestionList.js';
import Results from './Results.js';
import Question from './Question.js';
import {QuestionSheet} from './Questions';
import Welcome from './Welcome';
const questions = QuestionSheet

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: questions,
      score: 0,
      currentQ: 0,
      choice: "",
      highScore: 0,
      numGames: 0,
      totalScore: 0
     
     
    }

    this.setCurrentQ = this.setCurrentQ.bind(this);
    this.setScore = this.setScore.bind(this);
    this.setChoice = this.setChoice.bind(this);
    this.setHighScore = this.setHighScore.bind(this);
    this.setGames = this.setGames.bind(this);
    this.setTotal = this.setTotal.bind(this);
   
  }
 
  //setter methods for current question, choice and score
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
 
  /* If the current question is less than amount of questions, then call on the questionCount component
    to return which question you are on...eg 1 out of 4... If the current question
    reaches more than number of questions in quiz, you have come to the end and result component is called
  */
  render() {

     if(this.state.currentQ === 0){
var questionCount = "";

var welcome = <Welcome setCurrentQ ={this.setCurrentQ.bind(this)}{...this.state} />
}
   
    else if ((this.state.currentQ !== 0) && (this.state.currentQ <= this.state.questions.length)){
questionCount = <QuestionCount{...this.state}/>
results = '';
welcome = '';

}else {
questionCount ='';
welcome = '';
results = <Results setGames = {this.setGames.bind(this)}
setTotal = {this.setTotal.bind(this)}
           setScore={this.setScore.bind(this)}
           setHighScore = {this.setHighScore.bind(this)}
           setCurrentQ = {this.setCurrentQ.bind(this)}
           {...this.state} />
    }

   
/*The return method calls variable questionCount to display current question as long as you havent reached
  the end of the quiz. In that case it is set to an empty string. Then Question list is called passing in
  setter methods and all states. Question list will render current question answers. Result is then rendered once
  current becomes larger than array length.
*/

    return (
      <div>
        {welcome}
        {questionCount}
       
        <QuestionList setChoice = {this.setChoice.bind(this)}
        setScore={this.setScore.bind(this)}
        setTotal = {this.setTotal.bind(this)}
        setCurrentQ ={this.setCurrentQ.bind(this)}
        setGames= {this.setGames.bind(this)}
        {...this.state}/>
       
        {results}
      </div>
    );
  }
}

export default App;