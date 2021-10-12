function burger() {
  const burger = document.querySelector('.burger')
  const nav = document.querySelector('#navbarBasicExample')
  burger.classList.toggle('is-active')
  nav.classList.toggle('is-active')
}


$(document).ready(function() {
  const socket = io.connect("http://127.0.0.1:5000");

$('#vote1').on('click', function(){ socket.emit('vote', 1);});

$('#vote2').on('click', function(){ socket.emit('vote', 2); });

socket.on('vote_results', function(votes){
  const total_votes = votes.results_1 + votes.results_2;

  const bar_1 = Math.round(votes.results_1 / total_votes * 100);

  const bar_2 = 100 - bar_1;
  
  $('#results-1').css('width', bar_1 + '%');
  $('#results-2').css('width', bar_2 + '%');

  console.log(votes.results_1)

});
});

