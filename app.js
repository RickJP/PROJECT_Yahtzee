var activePlayer,
	gamePlaying = true,
	previousRoll = 0,
	newGame = false;
rollNumber = 0;
const DICE_DIR = 'images/dice/';
const DICE_HOLD_PREFIX = 'h';
init();

// START A NEW GAME => Call initialize function
document.querySelector('.btn-new').addEventListener('click', init);

function getDiceImgFile(diceId) {
	// Get file name by stripping out the path
	return document.getElementById(diceId).src.replace(/^.*[\\\/]/, '');
}

function isHeld(dImg) {
	// Return whether dice is held or not
	return dImg.charAt(0) === 'h' ? true : false;
}

function rollTheDice() {
	//console.log(`Roll Number ${rollNumber}`);
	const dicePrefix = 'dice-';

	for (let i = 1; i <= 5; i++) {
		// if dice not held roll dice, else continue
		diceImg = getDiceImgFile(`dice-${i}`);

		if (!isHeld(diceImg)) {
			// if not held then roll
			diceNum = Math.floor(Math.random() * 6) + 1;

			diceRolled = `${DICE_DIR}${diceNum}.png`;
			diceRef = `dice-${String(i)}`;
			document.getElementById(diceRef).style.display = 'block';
			document.getElementById(diceRef).src = diceRolled;
		} else {
			continue;
		}
	}
}

document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		rollTheDice();
		rollNumber++;

		// Disable the roll button
		document.querySelector('.btn-roll').disabled = true;

		// Enable category selection for current player (activePlayer)
		console.log('Active player: ' + activePlayer);
		document.getElementById(`s-card-${activePlayer}`).style.pointerEvents = 'auto';
	}
});

// Get selection from player 1
document.getElementById('s-card-0').addEventListener('click', (e) => {
	// Disable category selection
	document.getElementById('s-card-0').style.pointerEvents = 'none';

	// Enable roll button
	document.querySelector('.btn-roll').disabled = false;

	if (rollNumber === 2) {
		removeAllDice();
		nextPlayer();
	}

	console.log(e.target.classList.value);
});

// Get selection from player 2
document.getElementById('s-card-1').addEventListener('click', (e) => {
	// Disable category selection
	document.getElementById('s-card-1').style.pointerEvents = 'none';
	// Enable roll button
	document.querySelector('.btn-roll').disabled = false;

	console.log(e.target.classList.value);
});

// document.querySelector('.score-card').addEventListener('click', (e) => {
// 	console.log('clicked score card');
// });

// Allow dice to be held or not
document.getElementById('dice-group').addEventListener('click', (e) => {
	let numHeld = 0;
	for (let i = 1; i < 6; i++) {
		dImg = document.getElementById(`dice-${i}`).src.replace(/^.*[\\\/]/, '');
		if (isHeld(dImg)) {
			numHeld++;
		}
	}
	diceImg = e.target.src.replace(/^.*[\\\/]/, '');

	if (numHeld !== 4 || isHeld(diceImg)) {
		// Do not allow five dice to be held, but allow other dice to be unheld
		toggledDiceImg = diceImg.charAt(0) === 'h' ? diceImg.substr(1) : `h${diceImg}`;
		document.getElementById(e.target.id).src = `${DICE_DIR}${toggledDiceImg}`;
	}
});

function nextPlayer() {
	activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');
	removeAllDice();
}

function removeAllDice() {
	// Clear all dice from the UI
	for (let i = 1; i <= 5; i++) {
		document.getElementById(`dice-${i}`).style.display = 'none';
	}
}

function init() {
	activePlayer = 0;
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

	document.getElementById('s-card-0').style.pointerEvents = 'none';
	document.getElementById('s-card-1').style.pointerEvents = 'none';
}
