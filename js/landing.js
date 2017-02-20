$(function () {
  $('#landing-play').click(function () {
    window.location.href = 'play.html';
  });

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
  }, 1000)

})