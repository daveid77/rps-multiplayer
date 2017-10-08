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

  var playerId = 0;
  var playerSet = false;
  var name = '';
  var wins = 0;
  var losses = 0;
  var ties = 0;

  var database =  firebase.database();

  var playersRef = database.ref('/players');

  var chatRef = database.ref('/chat');

  chatRef.orderByChild('dateAdded').limitToLast(1).on('child_added', function(chatSnapshot) {
  // chatRef.on('value', function(chatSnapshot) {

      console.log('playerSet: ' + playerSet)
    if (playerSet) {
      if (chatSnapshot.val()) {
        var chatPlayer = chatSnapshot.val().playerId; 
          console.log('chatPlayer: ' + chatPlayer);
        var chatName = chatSnapshot.val().name; 
          console.log('chatName: ' + chatName);
        var chatMessage = chatSnapshot.val().message;
          console.log('chatMessage: ' + chatMessage);
        var newChat = $('<p>').addClass('playerid-' + chatPlayer)
          .html('<span class="chat-name">' + chatName + '</span>: ' + chatMessage);
        $('#chat-area').append(newChat);
        $('#chat-area').scrollTop($('#chat-area')[0].scrollHeight);
      }
    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  playersRef.on('value', function(playersSnapshot) {

    var playersNum = playersSnapshot.numChildren();
      // console.log('playersNum: ' + playersNum);
      // console.log('playerSet: ' + playerSet);

    if (!playerSet) {
      if (playersSnapshot.numChildren() === 2) {
          // console.log('both 1 & 2 exist, leave playerId as 0');
        $('#busy-game').show();
        $('#start-game').hide();
      } else if (playersSnapshot.child('1').exists()) {
          // console.log('1 exists, set playerId to 2');
        $('#start-game').show();
        $('#busy-game').hide();
        playerId = 2;
      } else {
          // console.log('2 exists, set playerId to 1');
        $('#start-game').show();
        $('#busy-game').hide();
        playerId = 1;
      } 
      // console.log('once playerId: ' + playerId);
    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


  function writeUserData(playerId, name, wins, losses, ties) {
    firebase.database().ref('players/' + playerId).set({
      name: name,
      wins: wins,
      losses: losses,
      ties: ties
    });
  }

  function writeChatData(playerId, name, message) {
    firebase.database().ref('chat').push({
      playerId: playerId,
      name: name,
      message: message,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  }


  // Start button
  $('#start-button').on('click', function() {
      // console.log('start button click playerId: ' + playerId);

    playerSet = true;
      // console.log('playerSet: ' + playerSet);

    name = $('#enter-name').val().trim();
      // console.log('name: ' + name);

    // Hide start game element & show live game elements
    $('#start-game').hide();
    $('#player-name').text(name);
    $('#player-number').text(playerId);
    $('#player-info, #player-id').show();

    // Clear previous name
    $('#enter-name').val('');

    writeUserData(playerId, name, wins, losses, ties);

    playerRef = playersRef.child(playerId);
      // console.log('playerRef: ' + playerRef)
    playerRef.onDisconnect().remove();
  })

  // Chat send button
  $('#send-button').on('click', function() {
      // console.log('send message');

    message = $('#chat-entry').val().trim();
      //console.log('message: ' + message);

    // Clear previous message
    $('#chat-entry').val('');

    writeChatData(playerId, name, message);
  })

});