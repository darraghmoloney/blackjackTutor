import React from 'react';

class QuestionCount extends React.Component {
  render() {
 // This method keeps track of question number
 var currentQ = this.props.currentQ;
 var questions = this.props.questions;
    return(
      <div className = "questionCount">
       <h4> Question {currentQ} / 4</h4>
      </div>
    );
  }
}

export default QuestionCount;