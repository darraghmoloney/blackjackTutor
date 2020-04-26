import React from 'react';
// This comonent is just finding average and returning as soon as user reaches end of quiz
class Welcome extends React.Component {
   

 
 handleStart(event){
const setCurrentQ = this.props.setCurrentQ;
setCurrentQ(this.props.currentQ +1);
console.log(this.props.currentQ);

    }

  render() {
   
    return (
   
      <div className = "welcome">
        <h4>
        <p>Welcome to the Black Jack Quiz!</p>
        <p>Please select your difficulty below..</p></h4>
          <button id = "beginner">Beginner</button>
          <div className = "divider"></div>
          <button id = "beginner">Intermediate</button>
          <div className = "divider"></div>
          <button id = "beginner">Advanced</button>
           <br/><br/>
          <button className = "start" id = "startQuiz" onClick = {this.handleStart.bind(this)}>Start Quiz!</button>
         
      </div>
    );
 
 }
}

export default Welcome;