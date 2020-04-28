import React, { Component } from 'react';
import App2 from './App2';
import css from './Quiz.css';
import Game from './Game.js';
//import css from './Quiz.css';
import WelcomeCss from './Welcome.css';
import { Redirect } from 'react-router-dom';


class Quiz extends Component {

    render () {

        return (
            <div className="Quiz"> 
            <Game />
        </div>
        )
    }
}

export default Quiz;