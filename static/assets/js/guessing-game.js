var shuffledPairs = [];
var pairs = [];
var matchedItems = [];
var fieldCount = 0;

var isFirstClick = true;
var firstIdClicked = null;
var firstIdIndex = -1;
var cardsDoNotMatch = false;

let minute = 0;
let second = 0;
let millisecond = 0;

let cron;

function start() {
    cron = setInterval(() => {
        timer();
    }, 10);
}

function reset() {
    minute = 0;
    second = 0;
    millisecond = 0;
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
    document.getElementById('millisecond').innerText = '000';

    shuffledPairs = [];
    pairs = [];
    matchedItems = [];

    isFirstClick = true;
    firstIdClicked = null;
    firstIdIndex = -1;
    cardsDoNotMatch = false;

    document.getElementById('submitResultButtonContainer').innerHTML = '';
}

function stop() {
    clearInterval(cron);
}

function timer() {
    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second++;
    }
    if (second == 60) {
        second = 0;
        minute++;
    }
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
    document.getElementById('millisecond').innerText = returnData(millisecond);
}

function returnData(input) {
    return input > 10 ? input : `0${input}`;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getUnUsed(arrayToCheck, isNullFlag) {
    while (true) {
        let pos = getRandomInt(arrayToCheck.length);

        if (!isNullFlag) {
            if (arrayToCheck[pos] === null) {
                continue;
            }
        } else {
            if (arrayToCheck[pos] !== null) {
                continue;
            }
        }

        return pos;
    }
}

function createShuffledPairs(fieldsToGenerate) {

    let tempList = [];

    let pairsToUse = fieldsToGenerate / 2;

    for (let i = 0; i < pairsToUse; i++) {
        let posIndex = getUnUsed(pairs, false);
        tempList.push(pairs[posIndex]);
        pairs[posIndex] = null;
    }

    for (let n = 0; n < fieldsToGenerate; n++) {
        shuffledPairs.push(null);
    }

    //place pairs in shuffledPairs Array
    for (let n = 0; n < pairsToUse; n++) {

        let posIndex = getUnUsed(shuffledPairs, true);

        shuffledPairs[posIndex] = tempList[n];

        let nextPosIndex = getUnUsed(shuffledPairs, true);

        let secondPartOfThePair = {'pic': tempList[n].pic, 'inform': tempList[n].inform, 'showImage': false}

        shuffledPairs[nextPosIndex] = secondPartOfThePair;
    }
}

function markAsUnclicked(btn) {
    btn.style.backgroundImage = 'url(\'/static/assets/back2.png\')';
    btn.innerHTML = '';
}

function area() {

    reset();

    let pictures = ['/static/assets/arctic.png', '/static/assets/black.png',
        '/static/assets/blue.png', '/static/assets/gray.png',
        '/static/assets/green.png', '/static/assets/hot_pink.png',
        '/static/assets/kelly.png', '/static/assets/lavender.png',
        '/static/assets/lilac.png', '/static/assets/maroon.png',
        '/static/assets/mint.png', '/static/assets/navy.png',
        '/static/assets/olive.png', '/static/assets/orange.png',
        '/static/assets/pewter.png', '/static/assets/red.png',
        '/static/assets/rust.png', '/static/assets/teal.png',
        '/static/assets/vanilla.png', '/static/assets/violet.png',
        '/static/assets/white.png', '/static/assets/yellow.png'];
    let inform = ['Arctic', 'Black',
        'Blue', 'Gray',
        'Green', 'Hot pink',
        'Kelly', 'Lavender',
        'Lilac', 'Maroon',
        'Mint', 'Navy',
        'Olive', 'Orange',
        'Pewter', 'Red',
        'Rust', 'Teal',
        'Vanilla', 'Violet',
        'White', 'Yellow'];

    for (let i = 0; i < pictures.length; i++) {
        let pair = {'pic': pictures[i], 'inform': inform[i], 'showImage': true}
        pairs.push(pair);
    }

    let count = document.querySelector('#size').value;
    let table = document.createElement('form');

    fieldCount = count * count;

    if (count % 2 !== 0) {
        --fieldCount;
    }

    createShuffledPairs(fieldCount);

    let i = 0;

    start();

    for (let x = 0; x < count; x++) {

        let row = document.createElement('div');
        row.className = 'row';

        for (let y = 0; y < count; y++) {

            if (i === fieldCount) {
                break;
            }

            let button = document.createElement('div');
            button.id = 'button_' + i;
            button.className = 'card';

            markAsUnclicked(button);

            row.appendChild(button);

            button.onclick = function () {

                if(cardsDoNotMatch) {
                    return;
                }

                let res = button.id.split('_');

                let id = parseInt(res[1]);

                if(matchedItems.indexOf(id) > -1) {
                    return;
                }

                if (shuffledPairs[id].showImage) {
                    button.style.backgroundImage = 'url(\'' + shuffledPairs[id].pic + '\')';
                } else {
                    button.style.backgroundImage = null;
                    button.style.backgroundColor = 'rgba(243,239,225,0.84)';

                    let buttonText = document.createElement('span');
                    buttonText.className = 'card-name';
                    buttonText.innerText = shuffledPairs[id].inform;

                    button.innerHTML = '';

                    button.appendChild(buttonText);
                }

                if (isFirstClick) {
                    firstIdClicked = button.id;
                    firstIdIndex = id;
                    isFirstClick = false;
                } else {

                    //Need to create only two-click policy

                    isFirstClick = true;

                    if (shuffledPairs[id].inform !== shuffledPairs[firstIdIndex].inform) {
                        isFirstClick = true;
                        cardsDoNotMatch = true;

                        setTimeout(function () {
                            markAsUnclicked(document.getElementById(firstIdClicked));
                            markAsUnclicked(document.getElementById(button.id));

                            firstIdClicked = null;
                            cardsDoNotMatch = false;
                            firstIdIndex = -1;

                        }, 2000);
                    } else {
                        matchedItems.push(id);
                        matchedItems.push(firstIdClicked);

                        if(fieldCount == matchedItems.length) {
                            stop();

                            const registerButton = document.createElement('button');
                            registerButton.innerHTML = 'Register result';
                            registerButton.type = 'submit';

                            document.getElementById('submitResultButtonContainer').appendChild(registerButton);

                        }
                    }
                }
            }

            //Need to create game-ender pop-up message and command that stops all action and restores to start state

            //If pressed 'Generate area' it restarts the whole process, let's shuffledPairs.inform fork again

            i++;

        }

        table.appendChild(row);
    }

    table.style.backgroundColor = 'white';

    document.getElementById('tableParent').innerHTML = '';

    document.getElementById('tableParent').appendChild(table);

}