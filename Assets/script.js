
//Links functionality to html ids

var scores = document.querySelector("#scores");
var timer = document.querySelector("#timer");
var container = document.querySelector("#container");
var title = document.querySelector("#title");
var content = document.querySelector("#content");
var start = document.querySelector("#start");
var answer = document.querySelector("#answer");

//variables
var questionList = [];
var optionList = [];
var currentQues = 0;
var score = 0;
var timeLeft = 41;
var isQuizOngoing = false;
var leaderboard = [];
var initials = "";
var isClearingAnswer = false;
var clearingAnswerCode = 0;
var isCorrect = false;

// Timer
function runTimer() {
    var clock = setInterval(function () {
        timeLeft--;
        timer.textContent = `Time: ${timeLeft}`;
        if (timeLeft === 0) {
            clearInterval(clock);
            if (title.textContent !== "Time's Up!") {
                endOfQuiz();
            }
        }
    }, 1000)
}




// Structures questions
class Question {
    constructor(question, options, answer) {
        this.question = question;
        this.options = options;
        this.answer = answer;
    }
}

//Questions

var options1 = ["1. <div>", "2. <scripts>", "3. <html>", "4. <script>"];
var question1 = new Question("Inside which HTML element do we put the JavaScript?", options1, "4. <script>");
questionList.push(question1);

var options2 = ["1. addEventListener()", "2. concat()", "3. boolean", "4. preventDefault()"];
var question2 = new Question("What stops the default behaviour of a webpage?", options2, "4. preventDefault()");
questionList.push(question2);

var options3 = ["1. declaring scope", "2. declaring variable", "3. declaring function", "4. declaring constant"];
var question3 = new Question("What is var keyword used for?", options3, "2. declaring variable");
questionList.push(question3);

var options4 = ["1. footer", "2. body", "3. concept", "4. aside"];
var question4 = new Question("Which of these is not an HTML tag?", options4, "3. concept");
questionList.push(question4);



//Button functionality
start.addEventListener("click", questionLoop);
scores.addEventListener("click", showScores);


// Makes starting ui invisible
function questionLoop() {
    runTimer();
    isQuizOngoing = true;
    start.setAttribute("style", "display: none");
    content.setAttribute("style", "display: none");
    var numOfOptions = questionList[0].options.length;
    for (var i = 0; i < numOfOptions; i++) {
        var option = document.createElement("button");
        container.appendChild(option);
        optionList.push(option);
        option.setAttribute("id", `button${i + 1}`);
    }
    nextQuestion();
}



//displays questions

function nextQuestion(event) {
    writeAnswer(event);
    if (currentQues < questionList.length) {
        changeQuestion();
    } else {
        endOfQuiz();
    }
}

//keeps track of score and notifies if answer is correct or incorrect, removes time if answer inccorect

function writeAnswer(event) {
    if (event !== undefined) {
        if (event.currentTarget.textContent === questionList[currentQues - 1].answer) {
            isCorrect = true;
            answer.textContent = "Correct";
            answer.setAttribute("style", "color: green");
            score += 10;
        } else {
            isCorrect = false;
            answer.textContent = "Incorrect";
            answer.setAttribute("style", "color: red");
            if (timeLeft > 10) {
                timeLeft -= 10;
            } else {
                timeLeft = 1;
            }
            timer.setAttribute("style", "color: red");
            setTimeout(function () {
                timer.setAttribute("style", "color: black");
            }, 1000);
        }
        clearAnswer();
    }
}


function clearAnswer() {
    if (isClearingAnswer) {
        isClearingAnswer = false;
        clearTimeout(clearingAnswerCode);
        clearAnswer();
    } else {
        isClearingAnswer = true;
        clearingAnswerCode = setTimeout(function () {
            answer.textContent = "";
            isClearingAnswer = false;
        }, 3000);
    }
}


function changeQuestion() {
    title.textContent = questionList[currentQues].question;
    for (var i = 0; i < questionList[currentQues].options.length; i++) {
        optionList[i].textContent = questionList[currentQues].options[i];
        optionList[i].addEventListener("click", nextQuestion);
    }
    currentQues++;
}

//clear display, end and score
function clearOptions() {
    for (var i = 0; i < optionList.length; i++) {
        optionList[i].remove();
    }
    optionList = [];
}

function endOfQuiz() {
    title.textContent = "Your Results!";
    timeLeft = 1;
    clearOptions();
    clearAnswer();
    content.setAttribute("style", "display: visible");
    content.textContent = `Your final score is ${score}`;
    inputFields();
}


//Enter intials for highscore board, and submission form for highscore
function inputFields() {
    var initialsForm = document.createElement("form");
    container.appendChild(initialsForm);
    initialsForm.setAttribute("id", "form");
    var label = document.createElement("label");
    initialsForm.appendChild(label);
    label.textContent = "Enter initials: "
    var input = document.createElement("input")
    initialsForm.appendChild(input);
    input.setAttribute("id", "initials");
    var submit = document.createElement("button");
    initialsForm.appendChild(submit);
    submit.setAttribute("id", "submit");
    submit.textContent = "Submit";

    title.setAttribute("style", "align-self: start")
    content.setAttribute("style", "align-self: start; font-size: 150%");


    input.addEventListener("keydown", stopReload);
    submit.addEventListener("click", addScore);

}

// Prevents page reload
function stopReload(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
}

// Prevents page reload
// saves score
function addScore(event) {
    if (event !== undefined) {
        event.preventDefault();
    }
    var id = document.getElementById("initials");
    if (id.value.length > 3 || id.value.length === 0) {
        invalidInput();
        return;
    }
    isQuizOngoing = false;
    document.getElementById("form").remove();
    saveScore(id);
}

// local storage of scores
function saveScore(id) {
    if (localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.push(`${score} ${id.value}`);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    showScores();
}

// error message for initials over 3
function invalidInput() {
    answer.textContent = "Initials must be entered and three characters or less";
    answer.setAttribute("style", "color: black");
    clearAnswer();
    var submit = document.getElementById("submit");
    submit.addEventListener("click", addScore);
}

// Highscore checker
function showScores() {
    if (!isQuizOngoing) {
        title.textContent = "High Scores";
        start.setAttribute("style", "display: none");
        writeScores();
        createEndButtons();
    } else if (title.textContent === "All Done.") {
        answer.textContent = "Please enter initials first";
        answer.setAttribute("style", "color: black");
        clearAnswer();
    } else {
        answer.textContent = "Cannot view until quiz is over";
        answer.setAttribute("style", "color: black");
        clearAnswer();
    }
}

// leaderboard
function writeScores() {
    content.textContent = "";
    content.setAttribute("style", "white-space: pre-wrap; font-size: 150%");
    if (localStorage.getItem("leaderboard") !== null) {
        leaderboard = JSON.parse(localStorage.getItem("leaderboard"));
    }
    leaderboard.sort();
    leaderboard.reverse();
    var limit = 11;
    if (limit > leaderboard.length) {
        limit = leaderboard.length;
    }
    for (var i = 0; i < limit; i++) {
        content.textContent += leaderboard[i] + '\n';
    }
}

// creates buttons to restart and clear score
function createEndButtons() {
    if (!document.getElementById("restart")) {
        var restartVar = document.createElement("button");
        container.appendChild(restartVar);
        restartVar.textContent = "Go Back";
        restartVar.setAttribute("id", "restart");

        var clearScoresVar = document.createElement("button");
        container.appendChild(clearScoresVar);
        clearScoresVar.textContent = "Clear High Scores";
        clearScoresVar.setAttribute("id", "clearScores");

        restartVar.addEventListener("click", restart);
        clearScoresVar.addEventListener("click", clearScores)
    }
}


//resetsgame
function restart() {
    window.location.reload();
}

// Clears local storage 
function clearScores() {
    localStorage.clear();
    content.textContent = "";
    leaderboard = [];
}
