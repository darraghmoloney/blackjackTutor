import React, { Component } from 'react';
import HeaderBox from './HeaderBox';
import Footer from './Footer';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import AboutTest from './AboutTest';
import Tutor from './Tutor';
import Quiz from './Quiz';
import ContactUs from './ContactUs';


class App extends Component {
  render() {
   

    return (
      <Router>
      <div className="app">
        <HeaderBox/>
        
         <Route path="/" exact strict render={
          () => {
            return (<h1> Welcome Home</h1>);
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

export default App;