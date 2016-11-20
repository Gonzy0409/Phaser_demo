/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * The win state of the game
 * redirects to the next page upon updating the database
 */

/* global BasicGame, game, SCREEN_HEIGHT, SCREEN_WIDTH, Phaser */

var data;
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

        data = GetGameState();
    },
    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.activePointer.isDown) {
            data.skunk_pelts = BasicGame.pelts;
            UpdateGameState(function () {
                setTimeout("window.location.href='../page14.html'", 200);
            });
        }
    }
};
