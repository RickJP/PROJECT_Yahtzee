let activePlayer = 0,
	gamePlaying = true,
	previousRoll = 0,
	newGame = false,
	rollCount,
	diceHeld;
const DICE_DIR = 'images/dice/';
const DICE_HOLD_PREFIX = 'h';

// Initailize game on refresh
init();

// START A NEW GAME => Call initialize function
document.querySelector('.btn-new').addEventListener('click', init);

/*** 
 * 										*
 *   DICE HANDLING    *
 * 										*
 */

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

/*** 
 * 										*
 *   DICE CALC   			*
 * 										*
 */

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
	let success = false;
	currentScore = document.getElementById(scoreId).textContent;
	if (selection > 6 && selection < 14) {
		let isValid,
			newScore = 0;

		// TODO
		isValid = document.getElementById(`${activePlayer}-${selection}`).classList.contains('valid');

		if (currentScore === '0') {
			if (isValid) {
				// SCORE -> CHANCE
				if (selection === 7) {
					newScore = calcSumTotalAllDice();
				}
				// SCORE -> 4 OF A KIND
				if (selection === 8) {
					newScore = calcSumTotalAllDice();
				}
				// SCORE -> 3 OF A KIND
				if (selection === 9) {
					newScore = calcSumTotalAllDice();
				}
				// SCORE -> SMALL STRAIGHT
				if (selection === 10) {
					newScore = 30;
				}
				// SCORE -> LARGE STRAIGHT
				if (selection === 11) {
					newScore = 40;
				}
				// SCORE -> FULL HOUSE
				if (selection === 12) {
					newScore = 25;
				}
				// SCORE -> YAHTZEE
				if (selection === 13) {
					newScore = 50;
				}
			} else {
				newScore = '-';
			}
			document.getElementById(scoreId).textContent = newScore;
			return (success = true);
		}
	}
}

function updateTotals() {
	scoreElements = document.getElementById(`the-scores-${activePlayer}`).children;
	let uTotal = (lTotal = 0);

	// Calculate Totals for upper section
	for (let i = 0; i < 7; i++) {
		if (scoreElements[i].textContent !== '-') {
			uTotal += parseInt(scoreElements[i].textContent);
		}
	}
	document.getElementById(`s${activePlayer}-ut`).textContent = uTotal;

	for (let i = 9; i < 15; i++) {
		if (scoreElements[i].textContent !== '-') {
			lTotal += parseInt(scoreElements[i].textContent);
		}
	}
	document.getElementById(`s${activePlayer}-lt`).textContent = lTotal;

	document.getElementById(`s${activePlayer}-t`).textContent = uTotal + lTotal;
	//TODO
}

/*** 
 * 											*
 *   PLAYER OPTIONS     *
 * 											*
 */

function setOptionsListTo(action = 'none') {
	for (let i = 1; i < 14; i++) {
		document.getElementById(`${activePlayer}-${i}`).style.pointerEvents = action;
	}
}

function highlightOption(opt, allowSelection) {
	if (document.getElementById(`${activePlayer}-${opt}`).className !== 'valid') {
		document.getElementById(`${activePlayer}-${opt}`).classList.add('valid');
	}
}

function highlightOrNot(num) {
	checkOption = document.getElementById(`s${activePlayer}-${num}`).textContent;

	// Check whether score is possible for an option and highlight it, if it is.
	if (checkOption === '0') {
		// Highlight the options that will give a score
		if (rollCount % 2 === 1) {
			// 1st ROLL
			highlightOption(num, 'none');
		} else {
			highlightOption(num, 'auto');
			//document.getElementById(`s${activePlayer}-${num}`).setAttribute('valid', true);  //?
		}
	}
}

function anyOptionsRemaining(player = activePlayer) {
	sCardItems = document.getElementById(`the-scores-${player}`).children;
	noOfItems = sCardItems.length;

	for (let i = 0; i < noOfItems; i++) {
		if (sCardItems[i].textContent === '0' && i !== 7 && i !== 15 && i !== 16) {
			// Search for a zero (ie. an option not selected, but do not include the upper, lower & grand totals)
			return true;
		}
	}
	return false;
}

function showOptionsAndValidate(allDiceHeld = false) {
	rollTotals = getRollTotals();
	let countForStraight = 0;
	let rolledA2 = false,
		rolledA3 = false;

	if (allDiceHeld) {
		rollCount++;
	}

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

/*** 
 * 																*
 *   CALCULATE & UPDATE SCORES   	*
 * 																*
 */

function calculateScoreForNumbers(e) {
	let success = false;

	scoreId = `s${e.target.id}`;
	// Strip out the prefix to leave the number
	selection = e.target.id.substr(2);

	let newScore = 0;
	currentScore = document.getElementById(scoreId).textContent;

	if (selection > 0 && selection < 7) {
		if (currentScore === '0') {
			newScore = rollTotals[selection] * selection;
			// Update the score to the UI
			newScore === 0 ? (newScore = '-') : null;
			document.getElementById(scoreId).textContent = newScore;
			success = true;
		}
	}
	return success;
}

document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		rollTheDice();
		rollCount++;

		showOptionsAndValidate();

		if (rollCount % 2 === 0) {
			// Disable the roll button
			document.querySelector('.btn-roll').disabled = true;
			document.querySelector('.btn-roll').classList.toggle('disabled');
			// Disable dice group on second roll
			document.getElementById('dice-group').style.pointerEvents = 'none';

			setOptionsListTo('auto');
			showOptionsAndValidate();
			diceHeld = 0;
		}
	}
});

/*** 
 * 																*
 *   GET CHOICE FROM PLAYER   		*
 * 																*
 */

// Listen for click on score card
[ ...document.querySelectorAll('.score-card') ].forEach((item) => {
	item.addEventListener('click', (e) => {
		if (rollCount % 2 === 0) {
			// 2nd Roll
			let success1 = calculateScoreForNumbers(e);
			let success2 = calculateScoreForOthers(e);
			if (success1 || success2) {
				updateTotals(); //TODO
				nextPlayer();
			}
		}
	});
});

/*** 
 * 																*
 *   TO HOLD. OR NOT TO HOLD?  		*
 * 																*
 */

// Allow dice to be held or not
document.getElementById('dice-group').addEventListener('click', (e) => {
	diceImg = e.target.src.replace(/^.*[\\\/]/, '');
	if (diceImg.charAt(0) === 'h') {
		toggledDiceImg = diceImg.substr(1); // Change image to unheld
		diceHeld--;
	} else {
		toggledDiceImg = `h${diceImg}`; // Change image to held
		diceHeld++;
	}
	document.getElementById(e.target.id).src = `${DICE_DIR}${toggledDiceImg}`;
	document.getElementById(e.target.id).classList.toggle('held');

	// If 5 dice are held, then disable roll and get selection from player
	if (diceHeld === 5) {
		// Disable the roll button
		document.querySelector('.btn-roll').disabled = true;
		document.querySelector('.btn-roll').classList.toggle('disabled');
		// Disable dice group on second roll
		document.getElementById('dice-group').style.pointerEvents = 'none';
		showOptionsAndValidate(true); // All dice held = true to enable selection
		setOptionsListTo('auto');
		diceHeld = 0;
	}
});

function clearHighlightsAndPointerEvents(player = activePlayer) {
	sCardItems = document.getElementById(`s-card-${player}`).children;
	noOfItems = sCardItems.length;

	for (let i = 0; i < noOfItems; i++) {
		sCardItems[i].classList.remove('valid');
		sCardItems[i].style.pointerEvents = 'none';
	}
}

function nextPlayer() {
	document.querySelector('.btn-roll').disabled = false;
	document.querySelector('.btn-roll').classList.toggle('disabled');
	document.getElementById(`s-card-${activePlayer}`).style.pointerEvents = 'none';
	document.getElementById(`player-${activePlayer}`).classList.toggle('active');

	resetDice();
	clearHighlightsAndPointerEvents();

	activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
	document.getElementById(`player-${activePlayer}`).classList.toggle('active');
	setOptionsListTo('none');

	// TODO
	if (!anyOptionsRemaining(0)) {
		console.log('GAME OVER FOR YOU, PLAYER 1.');
	}
	if (!anyOptionsRemaining(1)) {
		console.log('GAME OVER FOR YOU, PLAYER 2.');
	}
}

function init() {
	activePlayer = 0;
	gamePlaying = true;
	(rollCount = 0), (diceHeld = 0);

	clearHighlightsAndPointerEvents(0);
	clearHighlightsAndPointerEvents(1);
	document.querySelector('.btn-roll').classList.remove('disabled');
	document.querySelector('.btn-roll').disabled = false;

	document.getElementById('player-0').textContent = 'Mike';
	document.getElementById('player-1').textContent = 'Jeff';
	document.getElementById('player-0').classList.remove('active');
	document.getElementById('player-1').classList.remove('active');
	document.getElementById('player-0').classList.toggle('active');

	document.getElementById('s-card-0').style.pointerEvents = 'none';
	document.getElementById('s-card-1').style.pointerEvents = 'none';
	updateTotals();
	resetDice();
	setOptionsListTo('none');
}
