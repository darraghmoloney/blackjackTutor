import React from 'react';
import Question from './Question.js';
// this.props from questions is sent in and used to map out the question.
// if the current question is equal to the questions ID, then call the Question
//component and pass through props for that specific question and specific ID
//so the question component knows to render that particular question.

//Can use this as deck class, have to create a deal button to call the function , this button will then
//call choices component which will render choices.
class QuestionList extends React.Component {
  render() {
 
 
    return(
      <div>
        {
          this.props.questions.map(question => {
 
            if (this.props.currentQ === question.id) {

              return <Question question={question} key={question.id} {...this.props}/>
            }
          })
        }
      </div>
    );
  }
}

export default QuestionList;