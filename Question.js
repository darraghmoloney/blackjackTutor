import React from 'react';
 
class Question extends React.Component {
 /* handler method to deal with value changing as user has choice to chnage anser before submitting*/





  handleRadioChange(event){
 const setChoice = this.props.setChoice;
 const choice = this.props.choice;
 const  value = event.target;
 const name = event.target;
 this.setState({[name]: value})
 setChoice(event.target.value);

 }
 
 /* handleclick method for next question, updates current question and score*/
 
 handleNext(event) {
const{setCurrentQ, setScore, question, currentChoice, choice, setGames, setTotal,} = this.props;
     event.preventDefault();
     console.log(this.props.score);
     var selected = event.value;
     setCurrentQ(this.props.currentQ + 1);
     if (choice === question.correct){
     {
       setScore(this.props.score + 1);
     }
     if (this.props.currentQ > this.props.questions.length)
     setGames(this.props.numGames +1);
     setTotal(this.props.totalScore + this.props.score);
     console.log(this.props.totalScore);

   }
 }
  /*  handleclick method for previous question, updates to previous question and decrements score if
    last question was correct*/
  handlePrevious(){
 const {setCurrentQ, setCurrent, setChoice, setScore, choice, question} = this.props;
 if(this.props.currentQ >1){
setCurrentQ(this.props.currentQ - 1);
   }
if (choice === question.correct){
setScore(this.props.score-1)  
 }
 }

 
 
 
 /* handleButtonChange(e){
const {setCurrent, setScore, question, currentChoice} = this.props;
e.preventDefault();
const selected = e.target.value;
     setCurrent(this.props.current + 1);
  }
  */
 
 
  /*
  {question.text} renders specific question which was passed through by previous component QuestionList
  as an object. Map function is used to return choices as answers from question object in a list.
*/
   
  render() {
   var {question} = this.props;
    return (
      <div>
        <h3>{question.text}</h3>
        <ul>
          {
            question.choices.map(choice => {
              return (
             
                <li key={choice.id}>
                {choice.id}
                  <input onChange={this.handleRadioChange.bind(this)}
                  type="radio"
                  name={question.id}
                  value={choice.id}/>
                  {choice.text}
                </li>  
              );
            })
          }
        </ul>
        <button onClick = {this.handlePrevious.bind(this)} > Previous</button>
        <button onClick = {this.handleNext.bind(this)} > Next </button>
      </div>
    );
  }
}

   
   
   
   
   

   

export default Question;