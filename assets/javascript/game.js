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
  var playersRef = database.ref('/players');
  var chatRef = database.ref('/chat');

  var playerId = 0;
  var playerSet = false;
  var name = '';
  var playerOneName = '';
  var playerTwoName = '';
  var wins = 0;
  var losses = 0;
  var ties = 0;

  // Chat listeners
  chatRef.on('child_removed', function(chatSnapshot) {
    $('#chat-area').empty();
    $('#chat-area').html('The other player has disconnected.');
    setTimeout(function() {
      $('#chat-area').empty();
    }, 3000);
  });
  chatRef.on('child_added', function(chatSnapshot) {

    if (playerSet) {
      if (chatSnapshot.val()) {

        var chatPlayer = chatSnapshot.val().playerId; 
        var chatName = chatSnapshot.val().name; 
        var chatMessage = chatSnapshot.val().message;
        var newChat = $('<p>')
          .addClass('playerid-' + chatPlayer)
          .html('<span class="chat-name">' + chatName + ':</span> ' + chatMessage);
        $('#chat-area').append(newChat);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
      }
    }

  }, function(errorObject) {
    console.log("The chat read failed: " + errorObject.code);
  });

  // Player listener
  playersRef.on('value', function(playersSnapshot) {
      //console.log(playersRef);
    playersNum = playersSnapshot.numChildren();
      console.log('playersNum: ' + playersNum); 
      console.log('playerSet: ' + playerSet); 

    if (!playerSet) {
        console.log('!playerSet');
      if (playersNum === 2) {
        $('#busy-game').show();
        $('#start-game').hide();
          console.log('numChildren === 2');
      } else if (playersSnapshot.child('1').exists()) {
        playerOneName = playersSnapshot.child('1').child('name').val();
          console.log('playerOneName: ' + playerOneName);
        $('#start-game').show();
        $('#busy-game').hide();
          console.log('child 1 exists');
        playerId = 2;
      } else {
        $('#start-game').show();
        $('#busy-game').hide();
          console.log('ELSE - no child exists');
        playerId = 1;
      } 
      playersRef.onDisconnect().remove();
    } else {
        console.log('ELSE playerSet')
    }

  }, function(errorObject) {
    console.log("The player read failed: " + errorObject.code);
  });


  function writeChatData(playerId, name, message) {
    firebase.database().ref('chat').push({
      playerId: playerId,
      name: name,
      message: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }

  function writeUserData(playerId, name, wins, losses, ties) {
    firebase.database().ref('players/' + playerId).set({
      name: name,
      wins: wins,
      losses: losses,
      ties: ties
    });
  }


  // Chat send button
  $('#send-button').on('click', function() {

    if (playerSet) {
        console.log('send button, IF playerSet');

      // Do nothing if no message entered
      if ($('#chat-entry').val() !== '') {

        message = $('#chat-entry').val().trim();

        // Clear previous message
        $('#chat-entry').val('');

        writeChatData(playerId, name, message);

        chatRef.onDisconnect().remove();

      }
    }
  });

  // Start button
  $('#start-button').on('click', function() {

    playerSet = true;

    name = $('#enter-name').val().trim();

    // Hide start game element & show live game elements
    $('#start-game').hide();
    $('#player-name').text(name);
    $('#player-number').text(playerId);
    $('#player-info, #player-id').show();

    // Clear previous name
    $('#enter-name').val('');

    writeUserData(playerId, name, wins, losses, ties);

    playerRef = playersRef.child(playerId);
    playerRef.onDisconnect().remove();
  });

});