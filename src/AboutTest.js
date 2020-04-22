import React, { Component, useState  } from 'react';
import './AboutTest.css';
import basicStrategy from './basicStrategy.png';
import blackjack_1150 from './blackjack_1150.png';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



class AboutTest extends Component {

    render () {
        
        
        
        
                function playerOptions(e) {
                        alert("Hit: An additional card is dealt to the player, if they're hand is still less than or equal to 21 they can make an additional choice");
                        alert("Stand:The player is satisfied with their hand, the dealer reveals their hidden card and then hits or stands depending on what they have (dealer options will be covered later) the 2 hands are then compared (winning conditions will be covered later) ");
                        alert("Double: If doubling is allowed the bet is doubled and one additional card is dealt to the player (No more may be dealt after) it should only be used if the player is in a particularly advantageous position.");
                        alert(" Split:This can be done when the player has 2 cards with the same score dealt to them, they split the cards and form 2 separate hands, a bet equal to the original is placed on both hands. A second card is then dealt to each hand. If another match is made an additional split can be done. Some variations of the game don't allow the player to double after a split has been performed.");
                        alert("Surrender:Some casino's allow for a surrender, after the dealer checks for a blackjack the player can choose to surrender, they lose half their bet and the next hand is played. Should only be used if the player is in a disadvantageous position.");
                    }
                
                function dealerOptions(b){
                    alert("Once the player has finished choosing their options, then the dealer plays. Depending on the casino they might play slightly differently, but usually it will be the same as the following.");
                    alert("When the dealer has finished the initial deal, if they have a 10 revealed they check their hidden face down card to see if its an ace, if so they turn over the cards and take your bet and hand away. If you also have a blackjack the hand is pushed");
                    alert("Once the player has finished their turn and has not gotten a score over 21 the dealer's hidden card is revealed. They must hit until the cards total up to 17 or higher. As soon as that happens they must stay. In the most common variation which blackjack tutor uses, if the dealer has a 'soft 17' they must hit.");
                    }
                
                function winConditions(w){
                   alert("If both the player and the dealer go bust, the dealer wins.");
                alert("If both player and dealer have a natural blackjack, the hand is pushed");
                alert("If there is only one natural blackjack, whoever has it wins.");
                alert("If both player and dealer have the same score, the hand is pushed.");
                alert("If a player has a higher score than the dealer without going bust, player wins.");
                alert("If the dealer goes bust and the player does not, the player wins.");
                }

                function keyTerminology(k){
                    alert("Push: a draw, player does not lose the money they bet and a new hand is dealt.");
                    alert("Natural/natural blackjack: a hand made up of a single ace and a card whose total is 10 (10, jack, queen, king). The strongest hand in blackjack.");
                    alert("Hard totals/hard hand/hard 17 etc: A hard hand is one that does not contain an ace, for example a jack and a 7 is a hard 17 as they can only add up to 17.");
                    alert("Soft totals/soft hand/soft 17 etc:</h4> A soft hand is one that contains an ace, the number it refers to is usually the highest amount it can be equal to, for example an ace and a 6 can be counted as either a score of 7 or 17, but it is referred to as a soft 17.");
                }
                
                function howToPlay(h){
                    alert("Blackjack is a game where you must beat the dealer's hand by getting a hand whose value is greater than the dealer but less than or equal to 21. Cards have scores equal to the number they display while Jacks, Queens and Kings are equal to 10 and Ace's can be either 1 or 11 At the beginning of the game the player places the chips they intend to bet with and the player and the the dealer is dealt 2 cards each,the dealer's 2nd card remains face down, all others are revealed.The player then chooses what to do. Some options are only available in certain variations of the game");
                }

        return (
            
            <div className="AboutTest">

        
            <h1 id="pageTitle">About Us </h1> 
            <p id="intro">  
                Here you will be able to play games of blackjack as well as
                practice and learn a method known as basic strategy. By learning
                this strategy you will improve your odds at winning hands as close
                to the house edge as possible.
                Check out the about section to learn how to play!
            </p> 
            
            <div id="whatIs">
            <h2 id="whatIsTitle">What is basic strategy?</h2>
            
            <p id="whatIsPara">
            In all casino games the house always has the edge. In blackjack its usually 
            about 0.5% to 1%. It doesn't sound high, but after playing hundreds of hands,
            you will statistically lose more than you win. And that's *ONLY* if you're playing perfectly. 
            If a player is not playing in the best statistical way, 
            then they are liable to lose even more often.

            Basic strategy is how to play perfectly. You will still lose to the house edge,
            but it will bring you as close to it as possible. 
            Basic strategy is necessary to be combined with more complicated methods such
            as card counting (which this app does not cover) in order to beat a casino.
            </p>

            </div>

            <div id="buttonDiv">
            <button id="button1" onClick={keyTerminology}>Key Terminology</button>
            <button id="button2" onClick={playerOptions}>Player options</button>
            <button id="button3" onClick={dealerOptions}>Dealer Options</button>
            <button id="button4" onClick={winConditions}>Win Conditions</button>
            <button id="button5" onClick={howToPlay}>How To Play!</button>
            </div>
            
            <div id="warningDiv">
            <h2 id="warningTitle"><b>**WARNING**</b></h2>
            <p id="warningPara">
                While this will improve your odds, it is not enough to counteract
                the house edge, you are more likely to lose so do not use this advice
                thinking you will beat the casinos, other techniques are needed such as
                card counting which this app does not cover, also casinos may offer
                Variations on the rules which can change the results please gamble responsibly.
            </p>
            </div>
            
  </div>



        )
    }   
}

export default AboutTest;