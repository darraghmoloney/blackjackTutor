import React from 'react';

// This component is just finding average score, High Score and score, and returning as soon as user reaches end of quiz
class Results extends React.Component {

// handle event for "Try Again" button, resets quiz by setting current question to 0. this triggers conditional rendering
// in main component to render question 1.
  resetHandle(){
const {setCurrentQ, setScore, setGames, currentQ, setClassStand, setClassHit} = this.props;
const start = "start";
setClassStand(start);
setClassHit(start);
setCurrentQ(this.props.currentQ - 5);
console.log(this.props.currentQ);
setScore(this.props.score === 0);
setGames(this.props.numGames + 1);
console.log(currentQ);
console.log(this.props.questionCount);
}

  
seeAnswers(){
  const {setCurrentQ} = this.props;
  const currentQ = this.props.currentQ;
 // let six = 6;
  //this.setState({currentQ: six});
  setCurrentQ(this.props.currentQ + 1);
  console.log(currentQ);
}

  render() {
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
       
    return (
      <div className = "results">
        <h4>You got {this.props.score} out of 4 correct!</h4>
          <h4>{percentage}% - {comment}</h4>
          <h4>Your high score is : {highScore}</h4>
          <h4>Your average score is: {averageScore} </h4>
           <button className = "start" id = "tryAgain" onClick = {this.resetHandle.bind(this)}> Try Again! </button>
          <div className = "divider"></div>
           <button className = "start" id = "SeeAnswers" onClick = {this.seeAnswers.bind(this)}> See Answers </button>
      </div>
    );
  }
}

export default Results;
