
const timePerGuess = 10;


function shakeGame(timeMs){
    const cont = document.getElementById('container')
    cont.className = cont.className + " shaking";
    setTimeout(() => {
        cont.className = cont.className.replace(" shaking","");
    }, timeMs);
};

function setTimerInterval(restartTimer){
    if(restartTimer){
        timer.style.height = "100%";
    }
    return setInterval(async () => {
        let height = timer.style.height;
        height = Number(height.slice(0,height.length-1));
        height -= 100/timePerGuess;
        timer.style.height = String(height) + "%"
        if(height <= -1){
            
            stopTimeInterval(1000);
            // Shake the board ass penalty
            // TODO add buzzer sound
            shakeGame(500);
            addScore(-10);
            goToNextRow();
            await hintLetters();
            // Alert user of time running out
            showAlert("<strong>Warning!</strong> The time ran out.");
        }

    }, 1000);
}

function showAlert(message){
    let localAlertTemplate = alertTemplate.cloneNode(true);
    // Fill the body of the alert
    localAlertTemplate.children[1].innerHTML = message;
    alertDiv.appendChild(localAlertTemplate);
    removeFirstAlert(localAlertTemplate);
}
function clearTimerIntervals(){
    //if(currentRestartTimeout){
    clearTimeout(currentRestartTimeout);
    //}
    clearInterval(currentTimerInterval);
}
function stopTimeInterval(restartAfterMs){
    clearTimerIntervals();  
    if(restartAfterMs >= 0){
        animationPlaying = true;
        currentRestartTimeout = setTimeout(() => {
            timer.style.height = "100%";
            clearTimerIntervals();
            if(canRestartTimer){
                currentTimerInterval = setTimerInterval(true);
            }
            animationPlaying = false;
        }, restartAfterMs);
    }
}



function makeAlertTemplate(){
    // Make an alert template
    let alertTemplate = document.createElement("DIV");
    alertTemplate.className = "alert alert-warning alert-dismissible";
    // Make the alert closeable
    let alertClose = document.createElement("A");
    alertClose.setAttribute("href","#");
    alertClose.setAttribute("class","close");
    alertClose.setAttribute("data-dismiss","alert");
    alertClose.setAttribute("aria-label","close");
    alertClose.innerHTML = "&times;";
    // The body of the alert
    let alertMessage = document.createElement("SPAN");
    alertTemplate.appendChild(alertClose);
    alertTemplate.appendChild(alertMessage);
    return alertTemplate;
}

var canRestartTimer = true
const board = document.getElementById("board");
const timer = document.getElementById("timer");
var currentTimerInterval = setTimerInterval(true);
var currentRestartTimeout;
var animationPlaying = false;
const score = document.getElementById("score");
const scoreValue = document.getElementById("score-value");
const alertDiv = document.getElementById("container-alerts");
const emptyWordRow = board.children[2].cloneNode(true);

const input = document.getElementById("word-input");

var correctWord =  'DUIVEL'//woorden[Math.floor(Math.random() * woorden.length)].toUpperCase();
var lettersGuessed = new Array(correctWord.length).fill('.');
lettersGuessed[0] = correctWord[0]

const alertTemplate = makeAlertTemplate();

// For working on css
clearTimerIntervals();

function createAudio(src) {
    snds = new Array(4);
    snds[0] = 1;
    
    for(let i=1; i < snds.length; i++){
        snd = document.createElement("audio");
        snd.src = src;
        snd.load();
        //snd.setAttribute("preload", "auto");
        //snd.setAttribute("controls", "none");
        //snd.style.display = "none";
        snd.onended = function(){
            console.log("audio ended"); 
            this.load();
        }
        snds[i] = snd;
    }

    return snds;
  } 

var audio = new Array(
    createAudio('data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEA0AcAAKAPAAACABAAZGF0YZABAAAAAKV5rUtvtfCFo/43ecVMjLaIhUX9xXjcTau3JIXo+0948E7NuMSEivrWdwJQ8LlohC35WncSURa7DoTQ99l2IFI9vLmDc/ZWdipTZ71ngxf1z3UzVJK+GYO780V1OVXAv86CX/K3dD1W78CHggTxJnQ+VyDCRIKp75FzPFhTwwWCTu75cjhZiMTJgfTsXnIyWr7FkIGb679xKFv3xlyBQuodcRxcMMgrgeroeHAOXWzJ/oCS589v/V2pytSAO+Ykb+le58uvgOXkdW7SXyjNjYCQ48JtuGBpzm6AO+INbZxhrM9UgOjgVGx8YvHQPYCV35hrWmM20imAQ97ZajVkftMagPPcF2oNZcbUDoCj21Jp4mUQ1gaAVNqKaLVmW9cCgAfZv2eEZ6fYAYC61/FmUGj02QWAb9YfZhlpQtsMgCXVS2XfaZLcFoDc03Rkomri3SWAldKaY2JrNN83gE7RvWIebIbgTYAK0N1h2GzZ4WaAxs76YI5tLuODgITNFGBBboPkpIBEzCxf8W7Y5cmA'),
    createAudio('data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEA0AcAAKAPAAACABAAZGF0YZABAAAAAGEQg98RMCbBm0zmpiFkfZIZdT6FZn4KgGx/N4MaeI+O62hVod1STrpiN9fXRxgB+Jb3sRhx18M387kvUwyhKWldjj94H4N2fw6AVH5dhe10tZLeYzSnREyEwa0v69/2D2wANO/mIIvPOD8Os2dZnJu7bbyK4HqJgfl/n4CxfAyIP3FTl2Jedq1XRf/Iwicj6JMH1gjl5vYo28dnRn+sPF+altVxnIf5fICA73+9gYR6P4sTbWacflgStB4+uNCsH3bwKP83EbLe2TBqwEhNTKanZA2ScHUChYd+BIBWf2iDznf0jm5o56E4UgO7nzak2HMX2fi+9oUZpNaGOD+501N8oKNp+o2JePCCin8WgDF+nIWUdCaTVmPQp5ZLQcLkLr3gHw9EAV7utiHDzvQ/YrIBWhabKm5mihx7aIH/f7WAf3xYiNlw0JfQXRuuoUTDyfUm+Oi7Bq4JEebCKRrHG0fbq8xfIJY3clOHJ31tgOZ/4oFEepiLoWzunOFXwbRgPYHR2h5M8VD+DRLi3aAx'),
    createAudio("data:audio/wav;base64,UklGRuwAAABXQVZFZm10IBAAAAABAAEA0AcAAKAPAAACABAAZGF0YcgAAAAAAASTVnII9SyZ2XYk6hagfXpq37SnOX3s1PmvCn/AytS463/4wDXC3H+ntwvM237erkPW7HyvpsngEXonn4rrUXZWmHL2sXFIkmsBO2wIjWIM+mWiiEEX+F4chfUhRFd9gmks607LgIk2/UUJgENAjDw4gINJqDJXgTlSZShlg1Ra1h1ehsVhDxM8in5oJAj4jnJuKv2IlJZzNfLjmuB3Wuf9oUh7rdzHqch9Q9I1slt/L8g0u/9/hL61xLF/VbWmznJ+sqz02A==")
    );




function selectWordInputField(){
    input.select();
}
selectWordInputField();
function checkLetters(lettersTry, lettersCorrect){
    /* Loop over the word 2 times:
     first for correct letter on correct place (these letters should be ignored in second loop)
     second for correct letter on wrong place
     */
    //var lettersTry = [...wordTry]
    //var lettersCorrect = [...wordCorrect]
    var lettersResult = new Array(lettersCorrect.length).fill(0);
    var lettersCorrectRemaining = new Array();
    var IndexTryRemaining = new Array();
    lettersTry.forEach((letter, i) => {
        console.log(letter,lettersCorrect[i])
        if (letter == lettersCorrect[i]){
            lettersResult[i] = 1;
            // Store the correct letters to show as hint
            lettersGuessed[i] = letter;
        } else {
            IndexTryRemaining.push(i);
            lettersCorrectRemaining.push(lettersCorrect[i])
        }
    });
    for (i of IndexTryRemaining){ //Loop over the letters from the tried word that had not an exact match
        for (var c = 0; c < lettersCorrectRemaining.length; c++){ // Same for letters of correct word
            let letterCor = lettersCorrectRemaining[c];
            if (letterCor == lettersTry[i]){
                // 2 means correct letter wrong placing
                lettersResult[i] = 2;
                // Delete the letter from available for marking: each letter can only be referenced in the answer once
                lettersCorrectRemaining.splice(c,1) 
                //console.log(letterCor, lettersCorrectRemaining);
                break; // Found so skip inner for loop
                
            }
        }
    }
    //console.log(lettersResult);
    return lettersResult;
}

function putWordInRow(letters, resultLetters, wordRow, playSounds, animationSpeed){
    let i = 0;
    return new Promise(resolve => {
        //const animatePromise = new Promise();
        const animateLetters = setInterval(() => {
            if (playSounds){
                audio[resultLetters[i]][audio[resultLetters[i]][0]].play();
                audio[resultLetters[i]][0] += 1;
                if (audio[resultLetters[i]][0] >= audio[resultLetters[i]].length){
                    audio[resultLetters[i]][0] = 1;
                }
            }
            setTimeout(() =>{
                let node = document.createElement('DIV');
                node.innerHTML = letters[i];
                if (resultLetters[i] == 1){
                    node.className = 'correct-letter';
                } else if (resultLetters[i] == 2){
                    node.className = 'almost-letter';
                } 
                // delete old elements (hints)
                wordRow.children[i].innerHTML = "";
                //insert new elements
                wordRow.children[i].appendChild(node);
                i++;
                if(i >= letters.length){
                    clearInterval(animateLetters);
                    resolve();
                }
            }, animationSpeed/2);
            
            
        }, animationSpeed);
    });

/*     letters.forEach((letter,i) => {
        //console.log(i,letter);
        let node = document.createElement('DIV');
        node.innerHTML = letter;
        if (resultLetters[i] == 1){
            node.className = 'correct-letter';
        } else if (resultLetters[i] == 2){
            node.className = 'almost-letter';
        }
        // delete old elements (hints)
        wordRow.children[i].innerHTML = "";
        //insert new elements
        wordRow.children[i].appendChild(node);
    }); */
}

async function hintLetters(){
    // hint in board game
    await putWordInRow(lettersGuessed, new Array(lettersGuessed.Length).fill(0), board.children[currentWordRow], false, 100);
    // hint in input field
    if (input.value == ""){
        input.setAttribute("placeholder", lettersGuessed.join(" "));
    }

}
function fadeDiv(fadeTarget){
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.01;
        } else {
            clearInterval(fadeEffect);
            fadeTarget.parentElement.removeChild(fadeTarget);
        }
    }, 20);
}
function removeFirstAlert(fadeTarget){
    //var fadeTarget = alertDiv.children[0];// document.getElementById("target");
    setTimeout(() => {
        fadeDiv(fadeTarget);
    }, 3000);
}

function addScore(scoreToAdd){
    scoreValue.innerHTML = Number(scoreValue.innerHTML) + scoreToAdd;
    let localScoreAddition = document.createElement("DIV");
    if (scoreToAdd >= 0){
        localScoreAddition.style.color = 'var(--green)'
        localScoreAddition.innerHTML = "+" + String(scoreToAdd);
    } else {
        localScoreAddition.style.color = 'var(--red)'
        localScoreAddition.innerHTML = String(scoreToAdd);
    }
    localScoreAddition.innerHTML = '<h1>' + localScoreAddition.innerHTML + '</h1>'
    localScoreAddition.className = "score-alert"
    
    score.appendChild(localScoreAddition)
    let i = 0;
    let scoreAlertInterval = setInterval(() => {
        i += 1;
        localScoreAddition.style.top =  '-' + String(i) +'px';
        if (!localScoreAddition.style.opacity) {
            localScoreAddition.style.opacity = 1;
        }
        if (localScoreAddition.style.opacity > 0) {
            localScoreAddition.style.opacity -= 0.01;
        } else {
            clearInterval(scoreAlertInterval);
            score.removeChild(localScoreAddition);
        }
    }, 10);
}

function checkValidityInput(inputText){
    let penaltyscore = -5;
    if (inputText.length < correctWord.length){
        showAlert("<strong>Error!</strong> The word you tried has to <strong>few</strong> letters.");
        shakeGame(250);
        addScore(penaltyscore);
        return false;
    } else if (inputText.length > correctWord.length){
        showAlert("<strong>Error!</strong> The word you tried has to <strong>many</strong> letters.");
        shakeGame(250);
        addScore(penaltyscore);
        return false;
    } else if (woorden.includes(inputText.toLowerCase()) == false){
        showAlert("<strong>Error!</strong> The word you tried is <strong>unknown</strong>.");
        shakeGame(250);
        addScore(penaltyscore);
        return false;
    }
    return true;
}

function goToNextRow(){
    currentWordRow += 1;
    // if (currentWordRow >= board.children.length - 1){
    //     board.removeChild(board.firstChild)
    //     board.appendChild(emptyWordRow.cloneNode(true));
    //     //currentWordRow -= 1;
    // }
    // input.scrollIntoView(false, 20);
    
}

//initialize the first row
var currentWordRow = 0;
setTimeout(hintLetters, 500);

async function tryWord(){
    if(animationPlaying){
        setTimeout(() =>{
            tryWord();
        },100);
        return;
    }
    // "pause" timer
    clearInterval(currentTimerInterval);
        
    const inputText = input.value;
       
    if (checkValidityInput(inputText)){
        canRestartTimer = false;
        // stop timer
        clearInterval(currentTimerInterval);
        stopTimeInterval(-1);
        //Add score
        addScore(Number(timer.style.height.slice(0,timer.style.height.length-1)));
        // Reset input field
        input.value = "";
        selectWordInputField();
        const wordRow1 = currentWordRow;
        goToNextRow();
        const wordRow2 = currentWordRow;

        const letters = [...inputText.toUpperCase().slice(0,6)];
        const wordRow = board.children[wordRow1];
        //console.log(board);
        //console.log(board.children);
        //console.log(board.children.length);
        const resultLetters = checkLetters(letters, [...correctWord]);
        await putWordInRow(letters, resultLetters, wordRow, true, 200);

        // Word is guessed
        if (resultLetters.every( (val) => val === 1 )){
            alert("You have guessed the word. Wel Done!");// Refresh to play a new word.")
        }

        //Word not guessed and last row
        if(currentWordRow == board.children.length){
            alert("Helaas pindakaas! Het woord is niet geraden.")
        }

        // only hint if the player has not already inputed a next word
        if (currentWordRow <= wordRow2){
            await hintLetters();
        }
        // restart timer
        canRestartTimer = true;
        currentTimerInterval = setTimerInterval(true);
    } else{
        // unpause timer
        currentTimerInterval = setTimerInterval(false);
    }
    
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      // code for enter
      tryWord();
    }
});
