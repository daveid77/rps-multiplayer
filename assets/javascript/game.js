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

  var playernum = '';
  var name = '';
  var wins = 0;
  var losses = 0;
  var ties = 0;

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

  // PSEUDOCODE
  // 
  // Player enters name, clicks Start 
  //    - capture name
  //    - store in firebase
  //    - change respective "waiting for player" to player name
  //    - show win, loss, and tie totals in user boxes (all = zero before first match)
  // Repeat for player 2 start
  // When two users have started: 
  //    - populate player one box with RPS choices
  //    - player one message: "it's your turn" 
  //    - player two message: "waiting for <player one name> to choose"
  //    - choosing player box highlighted on both player's screens (yellow outline)
  // Player one chooses
  //    - player one choice displayed large (other choices disappear) 
  //    - populate player two box with RPS choices
  //    - player one message: "waiting for <player two name> to choose"
  //    - player two message: "it's your turn" 
  //    - choosing player box highlighted on both player's screens (yellow outline)
  // Player two chooses
  //    - player two choice displayed large (other choices disappear)
  //    - player messages disappear 
  //    - calculate winner, or tie
  //    - populate game result with "<winning player name> Wins!" or "Tie Game!"
  //    - wins, losses, and ties update accordingly for BOTH players 
  // Game resets (after delay)
  // 
  // CHAT
  //    - user enters text in input
  //    - capture text
  //    - store in firebase as new top level child (same as "players")
  //    - display in text-area 
  //    - use different colors for each player in text area
  //    
  // DISCONNECT
  //    - player can leave / refresh page / etc
  //      - chat text-area message: "<player name> has disconnected."
  //    - disconnected player's date removed from firebase
  //    - disconnected player's screen returns to initial state with name/start
  //    - both player's screens reset to pre-game state (message "waiting for player 2")
  // 
  // 

database.ref("/players").on("value", function(snapshot) {
  if (snapshot.child('1').exists()) {
    console.log('one exists');
  } else if (snapshot.child('2').exists()) {
    console.log('two exists');
  } else {
    console.log('neither one NOR two exists');
  }
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

  function writeUserData(playernum, name, wins, losses, ties) {
    firebase.database().ref('players/' + playernum).set({
      name: name,
      wins: wins,
      losses: losses,
      ties: ties
    });
  }

  // start button
  $('#start-button').on('click', function() {
    if (playernum === 1) {
      playernum = 2;
    } else {
      playernum = 1;
    }
    name = $('#enter-name').val();
      console.log('name: ' + name);
    // hide start game elements & show live game elements
    $('#start-game').hide();
    $('#player-name').text(name);
    $('#player-info, #player-id').show();
    // clear previous name entered
    $('#enter-name').val('');
    writeUserData(playernum, name, wins, losses, ties);
  })

  // chat button
  $('#send-button').on('click', function() {

    // clear previous text message entered
    $('#chat-entry').val('');
  })

});