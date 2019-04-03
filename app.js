var activePlayer,
	gamePlaying = true,
	previousRoll = 0,
	newGame = false,
	rollNumber;
const DICE_DIR = 'images/dice/';
const DICE_HOLD_PREFIX = 'h';

const rollTable = new Map();

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

function getDiceNumCat(dNum) {
	let category;
	switch (dNum) {
		case 1:
			category = 'ones';
			break;
		case 2:
			category = 'twos';
			break;
		case 3:
			category = 'threes';
			break;
		case 4:
			category = 'fours';
			break;
		case 5:
			category = 'fives';
			break;
		case 6:
			category = 'sixes';
			break;
	}
	return category;
}

function rollTheDice() {
	const dicePrefix = 'dice-';

	for (let i = 1; i <= 5; i++) {
		// if dice not held roll dice, else continue
		diceImg = getDiceImgFile(`dice-${i}`);

		if (!isHeld(diceImg)) {
			// if not held then roll
			diceNum = Math.floor(Math.random() * 6) + 1;

			diceRolled = `${DICE_DIR}${diceNum}.png`;
			diceRef = `dice-${String(i)}`;

			// Set the value for each dice
			document.getElementById(diceRef).setAttribute('value', diceNum);

			// Show the dice
			document.getElementById(diceRef).style.display = 'block';
			document.getElementById(diceRef).src = diceRolled;
		} else {
			continue;
		}

		// Update Roll Table
		category = getDiceNumCat(diceNum);
		addOne = rollTable.get(category) + 1;
		rollTable.set(category, addOne);
	}
}

function getValFromCat(category) {
	return rollTable.get(category);
}

function showOptions() {
	for (let i = 0; i < 6; i++) {
		//console.log(document.querySelectorAll(`#s-card-${activePlayer}`)[0].children[i].className);
		// Get an option
		option = document.querySelectorAll(`#s-card-${activePlayer}`)[0].children[i].className;
		if (getValFromCat(option) > 0) {
			document.querySelector(`#s-card-${activePlayer} .${option}`).style.backgroundColor = 'yellow';
			document.querySelector(`#s-card-${activePlayer} .${option}`).style.pointerEvents = 'auto';
		}
	}
}

function getSelectionFromPlayer(e) {
	// Enable roll button
	document.querySelector('.btn-roll').disabled = false;
	document.querySelector('.btn-roll').classList.toggle('disabled');

	// Update score after player selection option

	disableOptions();

	if (rollNumber === 2) {
		nextPlayer();
	}
}

function disableOptions() {
	for (let i = 1; i < 14; i++) {
		// Reset BG Color
		document.getElementById(`${activePlayer}-${i}`).style.backgroundColor = '#d9e0f8de';
		// Set options to diabled
		document.getElementById(`${activePlayer}-${i}`).style.pointerEvents = 'none';
	}
}

document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		rollTheDice();
		rollNumber++;

		// Disable the roll button
		document.querySelector('.btn-roll').disabled = true;
		document.querySelector('.btn-roll').classList.toggle('disabled');

		// Enable category selection for current player (activePlayer)
		//document.getElementById(`s-card-${activePlayer}`).style.pointerEvents = 'auto';

		// Disable dice group on second roll
		if (rollNumber === 2) {
			document.getElementById('dice-group').style.pointerEvents = 'none';
		}
		showOptions();
	}
});

// Get selection from player 1
document.getElementById('s-card-0').addEventListener('click', (e) => {
	getSelectionFromPlayer(e);
});
// Get selection from player 2
document.getElementById('s-card-1').addEventListener('click', (e) => {
	getSelectionFromPlayer(e);
});

//TODO

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
		document.getElementById(e.target.id).classList.toggle('held');
	}
});

function nextPlayer() {
	//resetOptions();

	activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	resetTheDice();
	removeAllDice();
	resetRollTable();

	document.getElementById('dice-group').style.pointerEvents = 'auto';
	rollNumber = 0;
}

function resetTheDice() {
	for (let i = 1; i < 6; i++) {
		diceImg = getDiceImgFile(`dice-${i}`);
		isHeld(diceImg) ? (diceImg = diceImg.substr(1)) : null;
		document.getElementById(`dice-${i}`).src = `${DICE_DIR}${diceImg}`;

		document.getElementById(diceRef).removeAttribute('value');
	}
}

function removeAllDice() {
	// Clear all dice from the UI
	for (let i = 1; i < 6; i++) {
		document.getElementById(`dice-${i}`).style.display = 'none';
		document.getElementById(`dice-${i}`).classList.remove('held');
	}
}

function resetRollTable() {
	rollTable.set('ones', 0);
	rollTable.set('twos', 0);
	rollTable.set('threes', 0);
	rollTable.set('fours', 0);
	rollTable.set('fives', 0);
	rollTable.set('sixes', 0);
}

// function resetOptions(player = activePlayer) {
// 	for (let i = 0; i < 6; i++) {
// 		option = document.querySelectorAll(`#s-card-${player}`)[0].children[i].className;

// 		if (player === 0) {
// 			bgColor0 = 'white';
// 			bgColor1 = '#d9e0f8de';
// 		} else {
// 			bgColor0 = '#d9e0f8de';
// 			bgColor1 = 'white';
// 		}
// 	}
// }

function init() {
	activePlayer = 0;
	gamePlaying = true;
	rollNumber = 0;

	document.querySelector('.btn-roll').classList.remove('disabled');
	document.querySelector('.btn-roll').disabled = false;

	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');

	document.querySelector('.player-0-panel').classList.add('active');

	document.getElementById('s-card-0').style.pointerEvents = 'none';
	document.getElementById('s-card-1').style.pointerEvents = 'none';

	// resetOptions(1);
	removeAllDice();
	resetRollTable();
	disableOptions();
}
