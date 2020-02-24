package basicStrat;

import java.util.*;

public class basicStrat {
public static void main(String [] args) {
Scanner myScanner = new Scanner(System.in);
boolean tryAgain = true;
while(tryAgain == true)
{

boolean dub = true;
do
{

System.out.println("Is doubling down allowed?");
System.out.println("1:Yes");
System.out.println("2:No");

int dubCheck = myScanner.nextInt();
if(dubCheck==1)
{
System.out.println("Ok");        

dub=false;
}
else if(dubCheck ==2)
{
System.out.println("Ok");
dub=false;
}
else
{
//in case player chooses an invalid option, loop restarts
System.out.println("invalid entry!");
dub=true;
}
}
while(dub==true);


boolean dubSplit = true;
do
{

System.out.println("Is doubling down after a split allowed?");
System.out.println("1:Yes");
System.out.println("2:No");

int dubSplitCheck = myScanner.nextInt();
if(dubSplitCheck==1)
{
System.out.println("Ok");
dubSplit=false;
}
else if(dubSplitCheck ==2)
{
System.out.println("Ok");
dubSplit=false;
}
else
{
//in case player chooses an invalid option, loop restarts
System.out.println("invalid entry!");
dubSplit=true;
}
}
while(dubSplit==true);

boolean surr = true;
do
{

System.out.println("Is Surrender allowed?");
System.out.println("1:Yes");
System.out.println("2:No");

int surrCheck = myScanner.nextInt();
if(surrCheck==1)
{
System.out.println("Ok");        
surr=false;
}
else if(surrCheck ==2)
{
System.out.println("Ok");  
surr=false;
}
else
{

System.out.println("invalid entry!");
surr=true;
}
}
while(surr==true);






System.out.println("What card has the dealer revealed");
int dealer = myScanner.nextInt();//scanner to take in dealer's revealed card
System.out.println("What cards does the player have?");
int player = myScanner.nextInt();//scanner to take in player's score


//following are when an invalid score is entered, might have to be changed when ace ruling is applied

if((dealer<2 && player<2) ||(dealer<2 && player>21) || (dealer >11 && player<2) ||(dealer >11 && player>21))
{
System.out.println("Invalid for both dealer and player"); //should deal when both values are invalid
}
else if(dealer<2 || dealer >11)
{
System.out.println("Invalid for dealer"); //deals with when dealer has invalid score
}
else if( player<2 || player>21)
{
System.out.println("Invalid for player"); //deals with when player has invalid score
}
else if(dealer==2 && (player>=13 && player<=21))
{
System.out.println("You should stand");
}
else if(dealer==3 && (player>=13 && player<=21))
{
System.out.println("You should stand");
}
else if(dealer==4 && (player>=12 && player<=21))
{

System.out.println("You should stand");
}
else if(dealer==5 && (player>=12 && player<=21))
{
System.out.println("You should stand");
}
else if(dealer==6 && (player>=12 && player<=21))
{
System.out.println("You should stand");
}
else if(dealer>=7 && (player>=17 && player<=21))  //needs equivalent for jack, queen,king
{
System.out.println("You should stand");
}
else
{
System.out.println("You should hit");
}
//needs if(dealer==Ace)



//loop for trying again


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
tryAgain=false;
invalid=false;
}
else if(rematch ==2)
{
tryAgain=true;
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
/*final notes
make a table for soft totals by incorporating the ace ruling properly, this is only for hard totals
make a table for split conditions
make alt table for if surrender and/or double and/or double after split is an option
*/