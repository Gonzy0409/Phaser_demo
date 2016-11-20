/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * Show the game over screen.
 */
/* global BasicGame, game, SCREEN_HEIGHT, SCREEN_WIDTH, Phaser */

BasicGame.lose = function (game) {
    this.game = game;
};

BasicGame.lose.prototype = {
    preload: function () {

    },
    create: function () {
        this.game.stage.backgroundColor = '#000000';var menu = this.game.add.sprite((SCREEN_WIDTH / 2), (SCREEN_HEIGHT / 2), 'lose');
        menu.anchor.x = 0.5;
        menu.anchor.y = 0.5;
    },
    update: function () {
        //To Do: ask what should be done here regarding resetting the game.
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.pointer1.isDown) {
            setTimeout("window.location.href='index.html'",200);
        }
    }
};

