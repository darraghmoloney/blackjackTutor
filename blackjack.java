package blackjack;
import java.util.*;
public class blackjack {
public static void main(String [] args)
{
Scanner myScanner = new Scanner(System.in); //scanner used for taking in ints
boolean playAgain = true;

while(playAgain==true) //at the end of this loop, the player will be asked if they want to play again, if so loop restarts, code re this loop is found at the bottom
{





System.out.println("What does the dealer have?");
int dealer = myScanner.nextInt(); /*what the dealer has, at the moment assumes entire hand is revealed,
will need to add in a deal method after player has finished their decisions*/


System.out.println("What do you have?");
int player = myScanner.nextInt(); //the player's initial hand score, need to add in how ace is 1 or 11, and K,Q,J=10


boolean notEnd = true; //used for loop,becomes false either from choosing stand or going bust



while(notEnd==true)
{
System.out.println("What do you want to do?"); //loop asks you what player what their decision is
System.out.println("1:Stand");
System.out.println("2:Hit");
int decision = myScanner.nextInt(); //uses a number to decide which decision you make
if(decision==1)
{
System.out.println("Player chose stand");
notEnd=false; //stand ends the round, quits the player decision loop
}
else if(decision==2)
{
System.out.println("Player chose hit");
System.out.println("What were you dealt?"); //hit adds a new card to the player score, loop restarts unless player goes bust
int newCard = myScanner.nextInt();
player=player+newCard;
if(player>21)
{
notEnd=false;
}
}
else if(decision!=1 || decision !=2)
{
//in case player chooses an invalid option, loop restarts
System.out.println("invalid entry!");

}
}

/*after decision loop, following if statements display results
results include
if the player goes bust,
if player and dealer go bust
if only the dealer goes bust
if player is greater than dealer
if player is less than dealer
if player is tied with dealer
NB requires the natural blackjack win condition which needs the ace ruling added
*/

if(player>21)
{
System.out.println("You lose!");
}
else if (player>21 && dealer>21)
{
System.out.println("You lose!");
}
else if (dealer>21 && player <=21)
{
System.out.println("You win!");
}
else if (player>dealer)
{
System.out.println("You win!");
}
else if(player<dealer)
{
System.out.println("You lose!");
}
else if (player==dealer)
{
System.out.println("Tie, bet pushed");
}

//similar to the player decision loop, resets the game
boolean invalid = false;
do
{

System.out.println("Do you wish to stop playing?");
System.out.println("1:Yes");
System.out.println("2:No");

int rematch = myScanner.nextInt();
if(rematch==1)
{
System.out.println("Game finished");          //ends loop that the whole code is in
playAgain=false;
invalid=false;
}
else if(rematch ==2)
{
playAgain=true;
invalid=false;
}
else
{
//in case player chooses an invalid option, loop restarts
System.out.println("invalid entry!");
invalid=true;
}
}
while(invalid==true);
}

}
}

/* final notes
 * the game needs to start by shuffling the deck class so that its different each time
 * the deck class needs to replace the scanner input for the dealer and player hands with the deal method from
 * the ruling on how aces, kings, queens and jacks work need to be added
 * more player options like split, double, surrender need to be added. Split will probably be the biggest hurdle
 * replace the scanner inputs to make decisions using buttons, the likes of split should only be available if you do have a pair
 * after player decisions are done deal 1 card to the dealer to show their remaining hand then have the dealer
 * continue making decisions based off its ruleset (hitting on soft 7's)
 * add in win condition for natural blackjacks (it beats normal 21, ties against dealer natural blackjack)
 * replace the scanner inputs for whether you want to play again with buttons
 */
