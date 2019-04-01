var scores,
	roundScores,
	activePlayer,
	gamePlaying = true,
	previousRoll = 0,
	winningScore,
	newGame = false;
rollNumber = 0;
const DICE_DIR = 'images/dice/';
const DICE_HOLD_DIR = 'images/dice_hold/';
const DICE_HOLD_PREFIX = 'h';
init();

// START A NEW GAME
document.querySelector('.btn-new').addEventListener('click', init);

document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		rollNumber++;
		const dicePrefix = 'dice-';

		function rollDice() {
			number = Math.floor(Math.random() * 6) + 1;
			return number;
		}

		//console.log(`Roll Number ${rollNumber}`);
		for (let i = 1; i <= 5; i++) {
			number = rollDice();
			diceRolled = DICE_DIR + number + '.png';
			diceRef = dicePrefix + String(i);

			//console.log(`${diceRef} : ${diceRolled}`);

			document.getElementById(diceRef).style.display = 'block';
			document.getElementById(diceRef).src = diceRolled;
		}
		if (rollNumber === 2) {
			rollNumber = 0;
			//playerDecides();
		}
	}
});

function getDiceFile(diceRef) {
	var fullPath = document.getElementById(diceRef).src;
	var fileName = fullPath.replace(/^.*[\\\/]/, '');
	//var relPath = fullPath.replace(/^(?:\/\/|[^\/]+)*\//, '');
	return fileName;
}

function toggleHold(f, dRef) {
	// Check for 'h' as first letter (i.e. check for hold dice)
	if (f[0] === 'h') {
		// remove 'h' from file name
		f = f.substr(1);
		// set dice to active
		document.getElementById(dRef).src = DICE_DIR + f;
	} else {
		// set dice to hold
		document.getElementById(dRef).src = DICE_HOLD_DIR + DICE_HOLD_PREFIX + f;
	}
}

document.getElementById('dice-1').addEventListener('click', () => {
	diceRef = 'dice-1';
	file = getDiceFile(diceRef);
	toggleHold(file, diceRef);
	console.log(file);
});
document.getElementById('dice-2').addEventListener('click', () => {
	diceRef = 'dice-2';
	file = getDiceFile(diceRef);
	toggleHold(file, diceRef);
});
document.getElementById('dice-3').addEventListener('click', () => {
	diceRef = 'dice-3';
	file = getDiceFile(diceRef);
	toggleHold(file, diceRef);
});
document.getElementById('dice-4').addEventListener('click', () => {
	diceRef = 'dice-4';
	file = getDiceFile(diceRef);
	toggleHold(file, diceRef);
});
document.getElementById('dice-5').addEventListener('click', () => {
	diceRef = 'dice-5';
	file = getDiceFile(diceRef);
	toggleHold(file, diceRef);
});

function nextPlayer() {
	activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
	roundScore = 0;
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	removeAllDice();
}

function removeAllDice() {
	for (let i = 1; i <= 5; i++) {
		diceRef = 'dice-' + i;
		document.getElementById(diceRef).style.display = 'none';
	}
}

function init() {
	scores = [ 0, 0 ];
	activePlayer = 0;
	roundScore = 0;
	gamePlaying = true;
	rollNumber = 0;

	removeAllDice();

	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';

	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');

	document.querySelector('.player-0-panel').classList.add('active');
}
