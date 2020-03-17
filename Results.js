import React from 'react';
// This component is just finding average score, High Score and score, and returning as soon as user reaches end of quiz
class Results extends React.Component {

// handle event for "Try Again" button, resets quiz by setting current question to 0. this triggers conditional rendering
// in main component to render question 1.
  resetHandle(event){
const {setCurrentQ, setScore, setGames} = this.props;
setCurrentQ(this.props.currentQ === 0);
setScore(this.props.score === 0);
setGames(this.props.numGames + 1);
   }

  render() {
const {setHighScore, highScore} = this.props;
var averageScore = (this.props.totalScore/this.props.numGames);
    var percentage = (this.props.score / this.props.questions.length * 100);
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
      <div>
        <h4>You got {this.props.score} out of {this.props.questions.length} correct!</h4>
          <h4>{percentage}% - {comment}</h4>
          <h4>Your high score is : {highScore}</h4>
          <h4>Your average score is: {averageScore} </h4>
           <button onClick = {this.resetHandle.bind(this)}> Try Again! </button>
      </div>
    );
  }
}

export default Results;
