let activePlayer = 0,
	gamePlaying = true,
	previousRoll = 0,
	newGame = false,
	rollNumber,
	diceHeld;
const DICE_DIR = 'images/dice/';
const DICE_HOLD_PREFIX = 'h';

// Start init on refresh
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
	}
}

function getRollTotals() {
	let rollTotals = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
	for (let i = 0; i < 5; i++) {
		number = document.getElementById('dice-group').children[i].getAttribute('value');
		rollTotals[number] += 1;
	}
	return rollTotals;
}

function calcSumTotalAllDice() {
	let sumTotal = 0;
	for (let i = 1; i < 6; i++) {
		sumTotal += parseInt(document.getElementById(`dice-${i}`).getAttribute('value'));
	}
	return sumTotal;
}

function calculateScoreForOthers(e) {
	// Get choice from player (target ID)
	scoreId = `s${e.target.id}`;
	// Strip out the prefix to leave the number
	selection = parseInt(e.target.id.substr(2));
	let score = 0;

	currentScore = document.getElementById(scoreId).textContent;

	if (selection > 6 && selection < 14) {
		//Update the score to the UI

		// TODO
		let isValid,
			newScore = 0;
		isValid = document.getElementById(`s${activePlayer}-${selection}`).getAttribute('valid');

		console.log('IS VALID: ' + isValid);
		console.log('CURRENT SCORE: ' + currentScore === '0');
		if (isValid && (currentScore === '0' || currentScore !== '-')) {
			// SCORE -> CHANCE
			console.log('ENTERED IF');
			if (selection === 7) {
				newScore = calcSumTotalAllDice();
			}
			// SCORE -> 4 OF A KIND
			if (selection === 8) {
				newScore = calcSumTotalAllDice();
			}
			// SCORE -> 3 OF A KIND
			if (selection === 9) {
			}
			// SCORE -> SMALL STRAIGHT
			if (selection === 10) {
			}
			// SCORE -> LARGE STRAIGHT
			if (selection === 11) {
			}
			// SCORE -> FULL HOUSE
			if (selection === 12) {
			}
			// SCORE -> YAHTZEE
			if (selection === 13) {
			}
			console.log('NEW SCORE: ' + newScore);
			document.getElementById(scoreId).textContent = newScore;
		}
	}
}

function setOptionsListTo(action = 'none') {
	for (let i = 1; i < 14; i++) {
		// Reset BG Color
		//document.getElementById(`${activePlayer}-${i}`).style.backgroundColor = '#d9e0f8de';
		// Set options to diabled
		document.getElementById(`${activePlayer}-${i}`).style.pointerEvents = action;
	}
}

function highlightOption(opt, allowSelection) {
	if (document.getElementById(`${activePlayer}-${opt}`).className !== 'highlight') {
		document.getElementById(`${activePlayer}-${opt}`).classList.add('highlight');
	}
	//document.getElementById(`${activePlayer}-${opt}`).style.pointerEvents = allowSelection;
}

function highlightOrNot(num) {
	checkOption = document.getElementById(`s${activePlayer}-${num}`).textContent;

	// Check whether score is possible for an option and highlight it, if it is.
	if (checkOption === '0' && checkOption !== '-') {
		// Highlight the options that will give a score
		if (rollNumber === 1) {
			highlightOption(num, 'none');
		} else {
			highlightOption(num, 'auto');
			document.getElementById(`s${activePlayer}-${num}`).setAttribute('valid', true);
		}
	}
}

function showOptionsAndValidate(allDiceHeld = false) {
	rollTotals = getRollTotals();
	let countForStraight = 0;
	let rolledA2 = false,
		rolledA3 = false;

	if (allDiceHeld) {
		rollNumber = 2;
	}

	console.log(rollTotals);

	// Highlight options
	for (let i = 1; i < 7; i++) {
		if (rollTotals[i] === 0) countForStraight = 0;

		if (rollTotals[i] > 0) {
			highlightOrNot(i); // FOR SINGLES

			if (rollTotals[i] === 1 || rollTotals[i] === 2) {
				countForStraight++;
			}

			if (rollTotals[i] === 2) {
				rolledA2 = true;
			} else if (rollTotals[i] === 3) {
				rolledA3 = true;
			}
			if (rolledA2 && rolledA3) {
				highlightOrNot(12);
			}

			if (rollTotals[i] === 3) {
				highlightOrNot(8); // 3 OF A KIND
			} else if (rollTotals[i] === 4) {
				highlightOrNot(9); // 4 OF A KIND
			} else if (rollTotals[i] === 5) {
				highlightOrNot(13); // YAHTZEE!
			}

			if (countForStraight === 4) {
				// Got a small straight
				highlightOrNot(10);
			} else if (countForStraight === 5) {
				// Got a large straight
				highlightOrNot(11);
			}
		}
	}
	highlightOrNot(7);
}

function calculateScoreForNumbers(e) {
	//disableOptions();
	// Get choice from player (target ID)
	scoreId = `s${e.target.id}`;
	// Strip out the prefix to leave the number
	selection = e.target.id.substr(2);

	if (selection > 0 && selection < 7) {
		// Use the number to calculate the score
		score = rollTotals[selection] * selection;
		// Update the score to the UI
		if (score === 0) {
			score = '-';
		}
		document.getElementById(scoreId).textContent = score;
	}
}

document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		rollTheDice();
		rollNumber++;

		showOptionsAndValidate();

		if (rollNumber === 2) {
			// Disable the roll button
			document.querySelector('.btn-roll').disabled = true;
			document.querySelector('.btn-roll').classList.toggle('disabled');
			// Disable dice group on second roll
			document.getElementById('dice-group').style.pointerEvents = 'none';

			clearAllHighlights();
			setOptionsListTo('auto');
			showOptionsAndValidate();
		}
	}
});

// Listen for click on score card
[ ...document.querySelectorAll('.score-card') ].forEach((item) => {
	item.addEventListener('click', (e) => {
		console.log('ROLL NO. ' + rollNumber);
		if (rollNumber === 2) {
			calculateScoreForNumbers(e);
			calculateScoreForOthers(e);
			//setOptionsListTo('auto');
			nextPlayer();
		}
	});
});

// Allow dice to be held or not
document.getElementById('dice-group').addEventListener('click', (e) => {
	diceImg = e.target.src.replace(/^.*[\\\/]/, '');
	toggledDiceImg = diceImg.charAt(0) === 'h' ? diceImg.substr(1) : `h${diceImg}`;

	document.getElementById(e.target.id).src = `${DICE_DIR}${toggledDiceImg}`;
	document.getElementById(e.target.id).classList.toggle('held');
	diceHeld++;
	if (diceHeld === 5) {
		// Disable the roll button
		document.querySelector('.btn-roll').disabled = true;
		document.querySelector('.btn-roll').classList.toggle('disabled');
		// Disable dice group on second roll
		document.getElementById('dice-group').style.pointerEvents = 'none';
		showOptionsAndValidate(true); // All dice held = true to enable selection
		diceHeld = 0;
	}
});

function clearAllHighlights(player = activePlayer) {
	// TODO
	sCardItems = document.getElementById(`s-card-${player}`).children;
	noOfItems = sCardItems.length;

	for (let i = 0; i < noOfItems; i++) {
		sCardItems[i].classList.remove('highlight');
	}
}

function nextPlayer() {
	document.querySelector('.btn-roll').disabled = false;
	document.querySelector('.btn-roll').classList.toggle('disabled');
	document.getElementById(`s-card-${activePlayer}`).style.pointerEvents = 'none';

	resetDice();
	clearAllHighlights();

	activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
	rollNumber = 0;

	// document.querySelector('.player-0-panel').classList.toggle('active');
	// document.querySelector('.player-1-panel').classList.toggle('active');

	setOptionsListTo('none');
}
function resetDice() {
	for (let i = 1; i < 6; i++) {
		diceImg = getDiceImgFile(`dice-${i}`);
		isHeld(diceImg) ? (diceImg = diceImg.substr(1)) : null;
		document.getElementById(`dice-${i}`).src = `${DICE_DIR}${diceImg}`;
		document.getElementById(`dice-${i}`).removeAttribute('value');
		document.getElementById(`dice-${i}`).classList.remove('held');
		document.getElementById(`dice-${i}`).style.display = 'none';
	}
	document.getElementById('dice-group').style.pointerEvents = 'auto';
}

function init() {
	activePlayer = 0;
	gamePlaying = true;
	rollNumber = 0;

	clearAllHighlights(0);
	clearAllHighlights(1);
	document.querySelector('.btn-roll').classList.remove('disabled');
	document.querySelector('.btn-roll').disabled = false;

	// document.getElementById('name-0').textContent = 'Player 1';
	// document.getElementById('name-1').textContent = 'Player 2';
	// document.querySelector('.player-0-panel').classList.remove('active');
	// document.querySelector('.player-1-panel').classList.remove('active');

	// document.querySelector('.player-0-panel').classList.add('active');

	document.getElementById('s-card-0').style.pointerEvents = 'none';
	document.getElementById('s-card-1').style.pointerEvents = 'none';

	diceHeld = 0;
	resetDice();
	setOptionsListTo('none');
}
