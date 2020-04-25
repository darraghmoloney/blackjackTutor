/*  Tables are arranged with player points as the outer key,
    and dealer points as the inner key that gets the hint
    string like 'h' for hint, etc.

    i.e. table[playerPts][dealerPts] == 'h'

    Sometimes the player points key is a points range like '5to8'
    (from 5 points to 8 points) so this needs an extra check before
    the table value is looked up.

    Dealer points are always just the actual number simply
    because it's easier to read.

    Tables are designed based on the strategy tables image in
    the app, & are hopefully easier to check as an array
    than through if statements.
 */



 /* Default strategy - any Aces worth 1 pt, & hand is not
    a single pair of cards
 */
export const hardStrategyTable = {
/*

'playerPoints':
{
'dealerPoints': 'action',
'dealerPoints': 'action'
...}

 'h' : hit     'd': double if possible, else hit
 's': stand    'h2s3': hit with 2 cards, stand with 3+
 'rh': surrender if possible, otherwise hit
*/
'4to8':
  {
    '2': 'h',
    '3': 'h',
    '4': 'h',
    '5': 'h',
    '6': 'h',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h' //11 means a visible dealer Ace
  },
'9':
  {
    '2': 'h',
    '3': 'd',
    '4': 'd',
    '5': 'd',
    '6': 'd',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'10':
  {
    '2': 'd',
    '3': 'd',
    '4': 'd',
    '5': 'd',
    '6': 'd',
    '7': 'd',
    '8': 'd',
    '9': 'd',
    '10': 'h',
    '11': 'h'
  },
'11':
  {
    '2': 'd',
    '3': 'd',
    '4': 'd',
    '5': 'd',
    '6': 'd',
    '7': 'd',
    '8': 'd',
    '9': 'd',
    '10': 'd',
    '11': 'h'
  },
'12':
  {
    '2': 'h',
    '3': 'h',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'13to14':
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'15':
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'rh',
    '11': 'h'
  },
'16':
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 'h',
    '8': 'h',
    '9': 'rh',
    '10': 'h2s3',
    '11': 'rh'
  },
'17+':
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 's',
    '8': 's',
    '9': 's',
    '10': 's',
    '11': 's'
  },
};




/*  Strategy when the player has an Ace worth 11 pts in their hand*/
export const softStrategyTable = {
/*
  'ds': double if possible, otherwise stand
*/
'13to14': //A,2 && A,3
  {
    '2': 'h',
    '3': 'h',
    '4': 'h',
    '5': 'd',
    '6': 'd',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'15to16':
{
  '2': 'h',
  '3': 'h',
  '4': 'd',
  '5': 'd',
  '6': 'd',
  '7': 'h',
  '8': 'h',
  '9': 'h',
  '10': 'h',
  '11': 'h'
},
'17': //A,6
  {
    '2': 'h',
    '3': 'd',
    '4': 'd',
    '5': 'd',
    '6': 'd',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'18': //A,7
  {
    '2': 's',
    '3': 'ds',
    '4': 'ds',
    '5': 'ds',
    '6': 'ds',
    '7': 's',
    '8': 's',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'19+': //A,8 && A,9 && A, 10
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 's',
    '8': 's',
    '9': 's',
    '10': 's',
    '11': 's'
  },
};



/*  Strategy for a single pair of cards
    (NB pair is determined by points,
     so different face card combinations
     such as K,J / Q,J / K,10 etc still count)
*/
export const pairsStrategyTable = {
/*
  'p': split
  'ph': split if double after split allowed, otherwise hit
*/
'4or6': //2,2 && 3,3
  {
    '2': 'ph',
    '3': 'ph',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 'p',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'8': //4,4
  {
    '2': 'h',
    '3': 'h',
    '4': 'h',
    '5': 'ph',
    '6': 'ph',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'10': //5,5
  {
    '2': 'd',
    '3': 'd',
    '4': 'd',
    '5': 'd',
    '6': 'd',
    '7': 'd',
    '8': 'd',
    '9': 'd',
    '10': 'h',
    '11': 'h'
  },
'12': //6,6
  {
    '2': 'ph',
    '3': 'p',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 'h',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'14': //7,7
  {
    '2': 'p',
    '3': 'p',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 'p',
    '8': 'h',
    '9': 'h',
    '10': 'h',
    '11': 'h'
  },
'16': //8,8
  {
    '2': 'p',
    '3': 'p',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 'p',
    '8': 'p',
    '9': 'p',
    '10': 'p',
    '11': 'p'
  },
'18': //9,9
  {
    '2': 'p',
    '3': 'p',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 's',
    '8': 'p',
    '9': 'p',
    '10': 's',
    '11': 's'
  },
'20': //10/J/Q/K, 10/J/Q/K
  {
    '2': 's',
    '3': 's',
    '4': 's',
    '5': 's',
    '6': 's',
    '7': 's',
    '8': 's',
    '9': 's',
    '10': 's',
    '11': 's'
  },
'AA': //A,A is 12pts like 6,6, so it needs different key name
  {
    '2': 'p',
    '3': 'p',
    '4': 'p',
    '5': 'p',
    '6': 'p',
    '7': 'p',
    '8': 'p',
    '9': 'p',
    '10': 'p',
    '11': 'p'
  },
};
