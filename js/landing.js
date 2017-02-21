///////////////////////////////////////
//    __             _    _          //
//    \ \  __ _  ___| | _(_) ___     //
//     \ \/ _` |/ __| |/ / |/ _ \    //
//  /\_/ / (_| | (__|   <| |  __/    //
//  \___/ \__,_|\___|_|\_\_|\___|    //
//                                   //
//    ___                            //
//   / __\__ _ ___ _ __   ___ _ __   //
//  / /  / _` / __| '_ \ / _ \ '__|  //
// / /__| (_| \__ \ |_) |  __/ |     //
// \____/\__,_|___/ .__/ \___|_|     //
//                |_|                //
//                                   //
///////////////////////////////////////

// stuff to do on the landing page
$(function () {
  // get player name from local storage
  var playerName = localStorage.getItem('playerName');
  // if there is a player name
  if (playerName) {
    // set input val
    $('#landing-name').val(playerName);
  }

  // click event listener for play button
  $('#landing-play').click(function () {
    // get value of input
    var playerName = $('#landing-name').val();
    // if there is a value
    if (playerName) {
      // sore it
      localStorage.setItem('playerName', playerName);
      // redirect
      window.location.href = 'play.html';
      // no player name
    } else {
      // tell them to enter a name
      alert('Please Enter Your Name!');
    }
  });
});