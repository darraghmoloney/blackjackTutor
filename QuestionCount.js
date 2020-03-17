import React from 'react';

class QuestionCount extends React.Component {
  render() {
 // This method keeps track of question number
 var currentQ = this.props.currentQ;
 var questions = this.props.questions;
    return(
      <div>
       <h4> Question {currentQ} / {questions.length}</h4>
      </div>
    );
  }
}

export default QuestionCount;