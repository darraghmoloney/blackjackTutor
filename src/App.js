import React, { Component } from 'react';
import HeaderBox from './HeaderBox';
import Footer from './Footer';
import Tutor from './Tutor';



class App extends Component {
  render() {
    let links = [
      { label: 'Home', link: '#home', active: true },
      { label: 'About', link: '#about' },
      { label: 'Tutor', link: '#tutor' },
      { label: 'Quiz', link: '#quiz' },
      { label: 'Contact Us', link: '#contact-us' },
    ];

    return (
      <div className="app">
        <HeaderBox links={links} />

        <Tutor />

      <Footer />
      </div>
    );
  }
}

export default App;
