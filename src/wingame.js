/*
 * @author Gonzalo Serrano <sergon0409@gmail.com>
 * 
 * @Overview
 * The win state of the game
 */

/* global BasicGame, game, SCREEN_HEIGHT, SCREEN_WIDTH, Phaser */

BasicGame.win = function (game) {
    this.game = game;
};

BasicGame.win.prototype = {
    preload: function () {

    },
    create: function () {
        var style = {
            font: "25px Arial",
            fill: "#ffffff",
            align: "center"
        };

        this.game.stage.backgroundColor = '#000000';
        this.menu = this.game.add.sprite((BasicGame.w / 2), (BasicGame.h / 2), 'win');
        this.text = this.game.add.text(BasicGame.w / 2 - 150, BasicGame.h / 2 + 200, "Press Enter or Return to Continue.", style);
        this.menu.anchor.x = .5;
        this.menu.anchor.y = .5;
    },
    update: function () {
        localStorage.removeItem('haveAxe');
        localStorage.removeItem('checkpoint');
        localStorage.removeItem('finished');
        localStorage.removeItem('lives');
        localStorage.removeItem('playerX');
        localStorage.removeItem('playerY');
        localStorage.removeItem('pelts');
        localStorage.removeItem('wood');
        localStorage.removeItem('skunkSpawns');
        localStorage.removeItem('treeSpawns');

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.activePointer.isDown) {
            setTimeout(function(){window.location.href='./index.html';}, 200);
        }
    }
};
