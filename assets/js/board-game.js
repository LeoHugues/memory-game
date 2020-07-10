import $ from 'jquery';
import 'animatesprite';

const PAIR_NUMBER = 18;

var isNewTry = true;
var numberPairFound = 0;
var selectedCardID = null;

initGame();

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
                    console.log('Wiiiiin');
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

// Fonction de création d'une nouvelle partie
function initGame() {
    generateBoardGame();
}

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