// Working no-repeat wordlist, game has endpoint, game 

window.addEventListener('load', init);

//Load More Words
function load_more_words()
{
  var xmlhttp;
  if (window.XMLHttpRequest)
  {
    //  IE7+, Firefox, Chrome, Opera, Safari 
    xmlhttp=new XMLHttpRequest();
  }
  else
  {
    // IE6, IE5 
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      words=xmlhttp.responseText.split("\n");
    }
  }
  xmlhttp.open("GET","words.txt",true);
  xmlhttp.send();
}

// Globals

// Available Levels
const levels = {
  easy: 10,
  medium: 5,
  hard: 3
};

// To change level
const currentLevel = levels.medium;

let time = currentLevel;
let score = 0;
let isPlaying = false;

// DOM Elements
const wordInput = document.querySelector('#word-input');
const currentWord = document.querySelector('#current-word');
const scoreDisplay = document.querySelector('#score');
const timeDisplay = document.querySelector('#time');
const message = document.querySelector('#message');
const seconds = document.querySelector('#seconds');
const highscoreDisplay = document.querySelector('#highscore');

var words = ['cybersafett'];

// Initialize Game


function init() {
  // Show number of seconds in UI
  seconds.innerHTML = currentLevel;
  // Fetch more words
  load_more_words();
  // Load word from array
  showWord(words);
  // Start matching on word input
  wordInput.addEventListener('input', startMatch);
  // Call countdown every second
  setInterval(countdown, 1000);
  // Initialize isPlaying to true
  isPlaying = true;
}

//start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    time = currentLevel + 1;
    showWord(words);
    wordInput.value = '';
    score++;
  }
  
  // Highscore based on score value for Session Storage
  if (typeof sessionStorage['highscore'] === 'undefined' || score > sessionStorage['highscore']) {
    sessionStorage['highscore'] = score;
  } else {
    sessionStorage['highscore'] = sessionStorage['highscore'];
  }

  // Prevent display of High Score: -1
  if (sessionStorage['highscore'] >= 0) {
    highscoreDisplay.innerHTML = sessionStorage['highscore'];
  }

  // If score is -1, display 0
  if (score === -1) {
    scoreDisplay.innerHTML = 0;
  } else {
    scoreDisplay.innerHTML = score;
  }

  // Check game status
  checkStatus();
}

// Match currentWord to wordInput
function matchWords() {
  if (wordInput.value === currentWord.innerHTML) {
    message.innerHTML = 'Correct!!!';
    return true;
  } else {
    message.innerHTML = '';
    return false;
  }
}

// Pick & show random word
function showWord(words) {
  if (words.length === 0) {
    // End the game if there are no more words
    isPlaying = false;
    message.innerHTML = 'No more words!';
    return;
  }
  // Generate random array index
  const randIndex = Math.floor(Math.random() * words.length);
  // Output random word
  currentWord.innerHTML = words[randIndex];
  // Remove word from array
  words.splice(randIndex, 1);
}

function checkStatus() {
  if (words.length === 0 && !isPlaying) {
    message.innerHTML = '🏆 Congrats! You stopped the hacker!! 🏆';
    wordInput.removeEventListener('input', startMatch);
    document.querySelector('#play-again-btn').style.display = 'block';
  } else if (words.length === 1 && currentWord.innerHTML === words[0]) {
    // Last word in the array is displayed, end the game after it is matched
    message.innerHTML = '🏆 Congrats! You stopped the hacker!! 🏆';
    isPlaying = false;
    wordInput.removeEventListener('input', startMatch);
    document.querySelector('#play-again-btn').style.display = 'block';
  } else if (!isPlaying && time === 0) {
    message.innerHTML = '☠ ☠ You got hacked. Game Over!!! ☠ ☠';
    score = -1;
    wordInput.removeEventListener('input', startMatch);
    document.querySelector('#play-again-btn').style.display = 'block';
  }
  
  // Add click event listener to the button
  document.querySelector('#play-again-btn').addEventListener('click', function() {
    location.reload();
  });
}

// Countdown timer
function countdown() {
  // Make sure time is not run out
  if (time > 0) {
    // Decrement
    time--;
  } else if (time === 0) {
    // Game is over
    isPlaying = false;
  }
  // Show time
  timeDisplay.innerHTML = time;

  // Check game status - moved to startgame func
  checkStatus();
}

