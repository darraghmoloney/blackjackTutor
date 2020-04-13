import React, { Component } from 'react';
import './HeaderBox.css';
import {BrowserRouter as Router, Link} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import AboutTest from './AboutTest';
import Tutor from './Tutor';
import Quiz from './Quiz';
import ContactUs from './ContactUs';

class HeaderBox extends Component {
    

   

    render() {
    
        return (
            <nav className="menu">
                <h1 className="menu__Title">BlackJack Tutor</h1>


                <ul className="menu__link">
         <li><Link className="individual_item" to='/'>Home</Link></li>
         <li> <Link className="individual_item" to='/aboutTest'>About</Link></li>
         <li><Link className="individual_item" to='/tutor'>Tutor</Link></li>
         <li> <Link className="individual_item" to='/quiz'>Quiz</Link></li>
         <li> <Link className="individual_item" to='/contactUs'>Contact Us</Link></li>
        </ul>
        
        
                
                
            </nav>
        );
    }
}

export default HeaderBox;