$(function () {

  var i = 0;

  var incrementI = function () {
    if (i === 18) {
      i = 0;
    } else {
      i++;
    }
  }

  setInterval(function () {
    $('.color-flood-help').css({
      backgroundImage: `url(img/colorflow/${i}.png)`
    });
    incrementI();
  }, 1000);
  
  
  $('#landing-play').click(function(){
    var playerName = $('#landing-name').val();
    if(playerName){
      localStorage.setItem('playerName', playerName);
      window.location.href = 'play.html';
    } else {
      alert('Please Enter Your Name!');
    }
  })
}) 