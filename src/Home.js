import React, { Component } from 'react';
import HeaderBox from './headerBox';
import Footer from './Footer';
import './App.css';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import AboutTest from './AboutTest';
import Tutor from './Tutor';
import Quiz from './Quiz';
import ContactUs from './ContactUs';
import blackjack_1150 from './blackjack_1150.png';
import {Navbar, Nav, NavDropdown} from 'react-bootstrap';
import {Jumbotron, Button} from 'react-bootstrap';


class Home extends Component {
  render() {
   

    return (
      <Router>
      <div className="app">
        <HeaderBox/>
        
         <Route path="/" exact strict render={
          () => {
            return (
            <div className="homePage">
              <div className="jumboHolder">
                 <div className="innerJumbo">
                   </div>
                 
              </div>

              <div className="home-tiles">
              <div id="menu-tile">
                
                <a href="/aboutTest"><span>About</span></a>
              </div>
              <div id="specials-tile">
                <a href="/tutor">
                  <span>Tutor</span>
                </a>
              </div>
              <div id="quiz-tile">
                <a href="/quiz">
                <span>Quiz</span>
                </a>
              </div>
              </div>
              
            </div>);
          }
        }/>
        <Route path ="/aboutTest" exact strict component={AboutTest}/>
        <Route path ="/tutor" exact strict component={Tutor}/>
        <Route path ="/quiz" exact strict component={Quiz}/>
        <Route path ="/contactUs" exact strict component={ContactUs}/>
      
      <Footer />
      </div>
      </Router>
    );
  }
}

export default Home;