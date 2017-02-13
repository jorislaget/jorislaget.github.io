function loadGame() {

    //static variables
    var DIM_X = 60;
    var DIM_Y = 60;

    var DIR_NONE = 'none';

    var KEY_UP = 38;     // Code ASCII des flèches
    var KEY_RIGHT = 39;
    var KEY_BOTTOM = 40;
    var KEY_LEFT = 37;

    //attribute variables
    var rupee = new Audio('rupee.wav');
    var dying = new Audio('dying.wav');
    rupee.volume = 0.5;
    dying.volume = 0.5;

    var board = document.querySelector('.board');
    var score = document.querySelector('.score span');
    var cases = [];
    var speed = 100;
    var tick = null;

    var player = {
        body: [
            { positionX: 1, positionY: 2 },
            { positionX: 2, positionY: 2 },
            { positionX: 3, positionY: 2 },
            { positionX: 4, positionY: 2 }
        ],

        lastDirection: DIR_NONE,

        score: 0,

        head : function() {
            return this.body[this.body.length - 1];
        },

        moveOnDirection: function(oneDirection) {
            if (checkForEnding() || oneDirection == DIR_NONE) return;

            var head = this.head();
            var newHead = { positionX: head.positionX, positionY: head.positionY };

            switch (oneDirection) {
                case KEY_UP:
                    newHead.positionY--;
                    break;

                case KEY_RIGHT:
                    newHead.positionX++;
                    break;

                case KEY_BOTTOM:
                    newHead.positionY++;
                    break;

                case KEY_LEFT:
                    newHead.positionX--;
                    break;
            }

            this.body.push(newHead);

            if (!checkForFruit()) {
                var tail = this.body[0];
                cases[tail.positionY][tail.positionX].classList.remove('player');
                this.body.shift();
            } else {
                cases[newHead.positionY][newHead.positionX].classList.remove('fruit');
                player.score += 5;
                rupee.play();
                createFruit();
            }

            document.querySelector('.tail').classList.remove('tail');
            document.querySelector('.btail').classList.remove('btail');
            document.querySelector('.head').classList.remove('head');

            updatePlayerPosition();
        }
    };

    function checkForEnding() {
        var headCrashed = false;
        var head = player.head();

        for (var i in player.body) {
            if (i == player.body.length - 1) break;
            var c = player.body[i];

            if (c.positionY == head.positionY && c.positionX == head.positionX) {
                headCrashed = true;
            }
        };

        if (!isMoveOk(player, player.lastDirection) || headCrashed) {
            clearInterval(tick);
            board.innerHTML = '<div class="message"><span>Perdu !<br><button class="play">Rejouer !</button></span></div>';
            document.querySelector('.play').addEventListener("click", initGame);
            dying.play();

            return true;
        } else {
            return false;
        }
    };

    function listenToEvent(e) {
        switch (e.keyCode) {
            case KEY_UP:
                if (player.lastDirection != KEY_BOTTOM) {
                    player.lastDirection = KEY_UP;
                }
                break;

            case KEY_RIGHT:
                if (player.lastDirection != KEY_LEFT) {
                    player.lastDirection = KEY_RIGHT;
                }
                break;

            case KEY_BOTTOM:
                if (player.lastDirection != KEY_UP) {
                    player.lastDirection = KEY_BOTTOM;
                }
                break;

            case KEY_LEFT:
                if (player.lastDirection != KEY_RIGHT && player.lastDirection != DIR_NONE) {
                    player.lastDirection = KEY_LEFT;
                }
                break;
        }
    };

    function isMoveOk(player, oneDirection) {
        var canMove = true;
        var head = player.head();

        switch (oneDirection) {
            case KEY_UP:
                if (head.positionY == 0) {
                    canMove = false;
                }
                break;

            case KEY_RIGHT:
                if (head.positionX == DIM_X - 1) {
                    canMove = false;
                }
                break;

            case KEY_BOTTOM:
                if (head.positionY == DIM_Y - 1) {
                    canMove = false;
                }
                break;

            case KEY_LEFT:
                if (head.positionX == 0) {
                    canMove = false;
                }
                break;
        }

        return canMove;
    };

    function onTick() {
        player.moveOnDirection(player.lastDirection);
    };

    function checkForFruit() {
        var head = player.head();
        return cases[head.positionY][head.positionX].classList.contains('fruit');
    };

    function createFruit() {
        var canCreate = true;
        var x = Math.floor((Math.random() * DIM_X));
        var y = Math.floor((Math.random() * DIM_Y));

        player.body.forEach(function(c) {
            if (c.positionY == y && c.positionX == x) {
                canCreate = false;
            }
        });

        if (canCreate) {
            cases[y][x].classList.add('fruit');
        } else {
            createFruit();
        }
    }

    function updatePlayerPosition() {
        var tail = player.body[0];
        var btail = player.body[1];
        var head = player.head();

        player.body.forEach(function(c) {
            cases[c.positionY][c.positionX].classList.add('player');
        });

        cases[tail.positionY][tail.positionX].classList.add('tail');
        cases[btail.positionY][btail.positionX].classList.add('btail');
        cases[head.positionY][head.positionX].classList.add('head');

        cases[head.positionY][head.positionX].classList.remove('up');
        cases[head.positionY][head.positionX].classList.remove('right');
        cases[head.positionY][head.positionX].classList.remove('bottom');
        cases[head.positionY][head.positionX].classList.remove('left');
        switch (player.lastDirection) {
            case KEY_UP:
                cases[head.positionY][head.positionX].classList.add('up');
                break;

            case KEY_RIGHT:
                cases[head.positionY][head.positionX].classList.add('right');
                break;

            case KEY_BOTTOM:
                cases[head.positionY][head.positionX].classList.add('bottom');
                break;

            case KEY_LEFT:
                cases[head.positionY][head.positionX].classList.add('left');
                break;
        }

        score.innerHTML = player.score;
    };

    function createBoard() {
        board.innerHTML = '';
        cases = new Array(DIM_Y);

        for (var y = 0; y < DIM_Y; y++) {
            cases[y] = new Array(DIM_X);

            for (var x = 0; x < DIM_X; x++) {
                var c = document.createElement('div');
                c.classList.add('case');

                board.appendChild(c);
                cases[y][x] = c;
            }
        }
    };

    function initGame() {
        console.log("Chargement du jeu");

        cases = [];
        player.body = [
            { positionX: 1, positionY: 2 },
            { positionX: 2, positionY: 2 },
            { positionX: 3, positionY: 2 },
            { positionX: 4, positionY: 2 }
        ];
        player.lastDirection = DIR_NONE;
        player.score = 0;

        createBoard();
        updatePlayerPosition();
        createFruit();

        // Ici: associer la fonction listenToEvent à un événement
        //      "touche (flèche) enfoncée"
        document.addEventListener("keydown", listenToEvent);

        // Ici: déclencher une fonction onTick à intervalles
        //      réguliers (ex: 0.1 seconde)
        tick = setInterval(onTick, speed);
    };

    document.querySelector('.easy').addEventListener('click', function() {
        speed = 100;
        initGame();
    });

    document.querySelector('.normal').addEventListener('click', function() {
        speed = 50;
        initGame();
    });

    document.querySelector('.hard').addEventListener('click', function() {
        speed = 25;
        initGame();
    });

    document.querySelector('.retard').addEventListener('click', function() {
        speed = 5;
        initGame();
    });

}; // Fin de loadGame

// Ici: associer la fonction loadGame à
//      la fin du chargement de la page HTML

document.addEventListener("DOMContentLoaded", function(event) {
    loadGame();
});

var bg = 1;
var sens = true;
setInterval(function() {
    if (sens) {
        var old = 'bg' + (bg - 1);
    } else {
        var old = 'bg' + (bg + 1);
    }
    document.querySelector('body').classList.remove(old);

    if (bg == 5) {
        bg = 4;
        sens = false;
    } else if (bg == -50) {
        bg = 1;
        sens = true;
    }

    var nw = 'bg' + bg;
    document.querySelector('body').classList.add(nw);

    if (sens) {
        bg++;
    } else {
        bg--;
    }
}, 100);