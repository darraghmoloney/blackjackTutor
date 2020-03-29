import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {

    render () {

        return (
            <div className="Footer">
            <footer className="panel-footer">
            <div className="container">
              <div className ="row">
                <section id="hours" className="col-sm-4">
                  <span>Hours:</span><br></br>
                  Monday-Friday: 12:00 - 04:00 <br></br>
                  Saturday: 12:00 - 06:00<br></br>
                  Sunday Closed 
                  <hr className="visible-xs"></hr>
                </section>
            
                <section id="address" className="col-sm-4">
                  <span>Address: </span><br></br>
                  123 Casino Lane<br></br>
                  Maynooth Co.Kildare
                  <p>* Availbable for Consulation throughout Leinster</p>
                  <hr className="visible-xs"></hr>
                </section>
    
                <section id="testimonials" className="col-sm-4">
              
                  <p>"The best BlackJack App out there"</p>
                  <p>"I became a millionaire in 4 minutes"</p>
                  <p>"I lost my wife and kids using this app!"</p>
                  <hr className="visible-xs"></hr>
                </section>
              </div>
              
              <div className="text-center"> &copy; Copyright BlackJack Tutor 2020</div>
            </div>
          </footer>
        </div>
        )
    }
}

export default Footer;