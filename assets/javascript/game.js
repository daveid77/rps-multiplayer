// 
// RPS Multiplayer
//

$(document).ready(function() {

  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyCEC51xbY107uDWNawFfhprL6fIvr_f-h4',
    authDomain: 'rps-multiplayer-9d6f5.firebaseapp.com',
    databaseURL: 'https://rps-multiplayer-9d6f5.firebaseio.com',
    projectId: 'rps-multiplayer-9d6f5',
    storageBucket: 'rps-multiplayer-9d6f5.appspot.com',
    messagingSenderId: '102143919957'
  };
  firebase.initializeApp(config);

  var database =  firebase.database();

  var connectionsRef = database.ref('/connections');

  var connectedRef = database.ref('.info/connected');

  connectedRef.on("value", function(snap) {
    // If they are connected..
    if (snap.val()) {
      // Add user to the connections list.
      var con = connectionsRef.push('userconnect');
      // Remove user from the connection list when they disconnect.
      con.onDisconnect().remove();
    }
  });

});