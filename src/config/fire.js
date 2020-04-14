import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyB1ADVd1PkiKM-aGiBeOUK68TpkAt0mHV8",
    authDomain: "blackjacktutor-22c16.firebaseapp.com",
    databaseURL: "https://blackjacktutor-22c16.firebaseio.com",
    projectId: "blackjacktutor-22c16",
    storageBucket: "blackjacktutor-22c16.appspot.com",
    messagingSenderId: "106843317349",
    appId: "1:106843317349:web:c747ed8d833e309fd7928c",
    measurementId: "G-JHQ3K41SPN"
  };

  const fire = firebase.initializeApp(config);
  export default fire;