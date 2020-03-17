import React from 'react';
// This comonent is just finding average and returning as soon as user reaches end of quiz
class Welcome extends React.Component {
   

 
   handleStart(event){
const setCurrentQ = this.props.setCurrentQ;
setCurrentQ(this.props.currentQ +1);
    }

  render() {
   
    return (
   
      <div>
        <h4>
        <p>Welcome to the Black Jack Quiz!</p>
        <p>Please select your difficulty below..</p></h4>
          <button>Beginner</button>
          <button>Intermediate</button>
          <button>Advanced</button>
           <br/><br/>
          <button onClick = {this.handleStart.bind(this)}>Start</button>
         
      </div>
    );
 
 }
}

export default Welcome;