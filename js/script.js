const wordText = document.querySelector(".word"),
    hintText = document.querySelector("#hint-txt"),
    curScore = document.querySelector(".scoreBox span"),
    curhighscore = document.querySelector(".highscoreBox span"),
    timeText = document.querySelector(".time b"),
    inputField = document.querySelector("input"),
    refreshBtn = document.querySelector(".refresh-word"),
    checkBtn = document.querySelector(".check-word");
    toastmsg=document.getElementById("snackbar");

curScore.innerHTML = 0;
let correctWord, timer, score = 0, curLength = 4,wordArray,highscore=0;
// let letters = new Map();
const url1 = 'https://random-word-api.herokuapp.com/word?length=';
const url2 = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if (maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        score = 0;
        curScore.innerHTML = score;
        highscore=0;
        curhighscore.innerHTML=highscore;
        curLength = 4;
        alert(`Time off! ${correctWord.toUpperCase()} was the correct word`);

        initGame();
    }, 1000);
}

initGame = async () => {
    if(!hintText.classList.contains("hide")){
        hintText.classList.toggle("hide"); 
    }   
    initTimer(30);
    let randomObj;
    // let showWord=1;
    try {
        const response = await fetch(url1 + curLength);
        const result = await response.json();
        // console.log(result);
        randomObj = result[0];
        // console.log(randomObj);
    } catch (error) {
        console.error(error);
        return "NULL";
    }
    console.log(randomObj);

    try {
        const response = await fetch(url2 + randomObj);
        const result = await response.json();
        console.log(result[0].meanings[0].definitions[0].definition);
        hintText.innerHTML = result[0].meanings[0].definitions[0].definition;
    } catch (error) {
        initGame();
    }
    const letters = new Map();
    wordArray = randomObj.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        letters.set(wordArray[i], 1);
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    // hintText.innerText = randomObj.hint;
    correctWord = randomObj.toLowerCase();;
    inputField.value = "";
    // inputField.setAttribute("maxlength", correctWord.length);
}
initGame();

const checkWord = async () => {
    
    let userWord = inputField.value.toLowerCase();
    if (userWord.length < correctWord.length){
        //  return alert("Please entre word longer than "+(correctWord.length-1) +"characters");
        //add toast
        toastmsg.innerHTML="Please entre word longer than "+(correctWord.length-1) +" characters";
        toastmsg.className = "show";
        setTimeout(function(){ toastmsg.className = toastmsg.className.replace("show", ""); }, 1500);
    }
    else if (userWord !== correctWord) {
        //not the specific word we are looking for

        //check it it uses the same letters

        let wordArr = userWord.split("");
        console.log(wordArray);
        let sameLett = true;
        for (let i = wordArr.length - 1; i > 0; i--) {
            if (wordArray.includes(wordArr[i]) == false) sameLett = false;

        }

        if (sameLett) {
            //check if it is a valid word
            let validity = true, definition;
            try {
                const response = await fetch(url2 + userWord);
                const result = await response.json();
                // console.log(result.title);
                if (result.title == "No Definitions Found") {
                    console.log("word not valid");
                    validity = false;
                }
                else {
                    definition = result.meanings[0].definitions[0].definition;
                }
                // console.log(result);
            } catch (error) {
                // console.log(error);
            }
            if (validity === true) {
                score = score + userWord.length;
                curScore.innerHTML = score;
                if(highscore<score){
                    highscore=score;
                    curhighscore.innerHTML=highscore;
                }
                curLength = userWord.length;
                console.log("You created a " + curLength + " long word!");
            }
            else {
                score = 0;
                curScore.innerHTML = score;
                curLength = 4;
                Swal.fire({
                    title: 'GAME OVER!',
                    text: (userWord+ "isnt a valid word"),
                    confirmButtonText: 'Restart',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      initGame();
                    }
                  })
            }
        }
        else{
            //invalid characters
            //toast notification saying wrong characters
            toastmsg.innerHTML="Use only the given characters";;
        toastmsg.className = "show";
        setTimeout(function(){ toastmsg.className = toastmsg.className.replace("show", ""); }, 1500);
        }
    }
    else {
        //exact word match
        score = score + userWord.length * 3;
        curScore.innerHTML = score;
        if(highscore<score){
            highscore=score;
            curhighscore.innerHTML=highscore;
        }
        // replace alert with new toast


        // var x = document.getElementById("snackbar");
        // let newtxt="Congrats!"+correctWord.toUpperCase()+" is the correct word";
        toastmsg.innerHTML="Congrats! "+correctWord.toUpperCase()+" is the correct word";;
        toastmsg.className = "show";
        setTimeout(function(){ toastmsg.className = toastmsg.className.replace("show", ""); }, 1500);

        initGame();
    }
}

initGame();

refreshBtn.addEventListener("click", ()=>{
    hintText.classList.toggle("hide");
});
checkBtn.addEventListener("click", checkWord);