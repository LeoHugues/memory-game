import $ from 'jquery';


const PAIR_NUMBER = 18;

const TIME_LIMIT = 300;
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 60;
const ALERT_THRESHOLD = 30;
const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};

let playerId = null;
let isNewTry = true;
let numberPairFound = 0;
let selectedCardID = null;

let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

initGame();

// Fonction de création d'une nouvelle partie
function initGame() {
    getRegisterForm();
    generateBoardGame();
}

// <====================== EVENEMENT ==========================>
$( ".card" ).on('click', function (e) {
    e.preventDefault();
    var card = $(this);

    // On verifie que l'élément est cliquable
    if (!card.hasClass('unbinded')) {
        // Si c'est la première carte du nouvel essai
        if (isNewTry) {
            turnCard(card.attr('id'));
            selectedCardID = card.attr('id');
            isNewTry = false;
        } else {
            // Si la paire est valide
            if(card.data('pair') === $('#' + selectedCardID).data('pair')) {
                numberPairFound++;
                turnCard(card.attr('id'));
                console.log('nouvelle pair découverte');
                if (numberPairFound === PAIR_NUMBER) {
                    postScore(timePassed);
                    $('#modal-content').html('<h1>Gagné</h1><span>Score : '+ timePassed +'</span>');
                    $('#modal').show();
                    console.log('Wiiiiin');
                    clearInterval(timerInterval);
                }
            } else {
                // J'affiche la carte qui viens d'être séléctionné
                turnCard(card.attr('id'));

                // Je laisse un delais avant de retourner les deux cartes face caché
                setTimeout(() => {
                    turnCard(card.attr('id'));
                    turnCard(selectedCardID);
                }, 1000);

                console.log('essaie encore !');
            }

            isNewTry = true;
        }
    }
});

let handleSubmitForm = function (e) {
    e.preventDefault();
    let form_data = $('.subscribe-form').serialize(); //Encode form elements for submission
    $.ajax({
        url: "/register",
        type: 'POST',
        data: form_data
    }).done(function(response) { //
        playerId = response.id;
        $('#modal').hide();
        startTimer();
        console.log('ça passe !');
    }).fail(()=>{
        console.log('ERROR ON SUBMIT');
    });
}

// <===========================================================>



// <====================== AJAX ===============================>

function getRegisterForm() {
    $.ajax({
        url: '/register',
        method: 'GET',
        dataType: 'html'
    })
        .done((res)=>{
            $('#modal-content').html(res);
            $('#register-form').on('submit', handleSubmitForm);
            $('#modal').show();
        })
        .fail(()=>{
            console.log('error');
        })
}

function postScore(score) {

    $.ajax({
        url: "/score/" + playerId,
        type: 'POST',
        data: {'time': score}
    }).done(function(response) { //
        console.log('score enregistré');
    }).fail(()=>{
        console.log('ERROR ON SUBMIT');
    });
}
// <===========================================================>


// <====================== TIMER ==========================>


$("#timer").html(`
<div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${formatTime(
    timeLeft
)}</span>
</div>
`);

function onTimesUp() {
    clearInterval(timerInterval);
    $('#modal-content').html('<h1>Perdu !</h1>')
    $('#modal').show();
}

function startTimer() {
    timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        $("#base-timer-label").html(formatTime(
            timeLeft
        ));
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
            onTimesUp();
        }
    }, 1000);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
    const { alert, warning, info } = COLOR_CODES;
    if (timeLeft <= alert.threshold) {
        $("#base-timer-path-remaining").removeClass(warning.color).addClass(alert.color);
    } else if (timeLeft <= warning.threshold) {
        $("#base-timer-path-remaining").removeClass(info.color).addClass(warning.color);
    }
}

function calculateTimeFraction() {
    const rawTimeFraction = timeLeft / TIME_LIMIT;
    return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
    const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
    ).toFixed(0)} 283`;
    $("#base-timer-path-remaining").attr("stroke-dasharray", circleDasharray);
}

// <===========================================================>


// Retourne une carte face ouverte si face caché et face caché si face ouverte
function turnCard(idCard) {
    var card = $('#' + idCard);
    if (card.hasClass('recto')) {
        card.removeClass('recto').addClass('back').removeClass('unbinded');
    } else if (card.hasClass('back')) {
        card.removeClass('back').addClass('recto').addClass('unbinded');
    }
}

function generateBoardGame() {
    // Je réccupère ma div contenant mon plateau de carte
    var memoryBoard = $('#board-game');

    // Je supprime le contenu de la div avant de composer mon nouveau plateau
    memoryBoard.empty();

    // Pour chaque paire de carte
    for (var i = 0; i < PAIR_NUMBER; i++)
    {
        // Je crée une div associé à une carte
        var card = document.createElement('div');
        card.id = 'pair' + i;
        card.className = 'card block col col-lg-2 back';
        card.dataset.pair = i;

        // Et sa paire
        var cardbis = document.createElement('div');
        cardbis.id = 'pairbis' + i;
        cardbis.className = 'card block col col-lg-2 back';
        cardbis.dataset.pair = i;

        // Je les ajoute ensuite à mon plateau
        memoryBoard.append(card);
        memoryBoard.append(cardbis);

        // Je défini ici le bon offeset qui me permettra d'afficher le bon fruit associer à chaque paire de carte
        var spriteOffset = i * 100;
        $('#pair'+i).css('background-position','0px ' + spriteOffset + 'px');
        $('#pairbis'+i).css('background-position','0px ' + spriteOffset + 'px');
    }

    // Je reccupère ensuite mon plateau de carte et le mélange
    var parent = $("#board-game");
    var divs = parent.children();
    while (divs.length) {
        parent.append(divs.splice(Math.floor(Math.random() * divs.length), 1)[0]);
    }
}