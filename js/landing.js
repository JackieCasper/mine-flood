$(function () {
  var playerName = localStorage.getItem('playerName');
  if (playerName) {
    $('#landing-name').val(playerName);
  }

  $('#landing-play').click(function () {
    var playerName = $('#landing-name').val();
    if (playerName) {
      localStorage.setItem('playerName', playerName);
      window.location.href = 'play.html';
    } else {
      alert('Please Enter Your Name!');
    }
  })
})