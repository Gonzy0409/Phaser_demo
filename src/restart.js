/*
 * @author Gonzalo Serrano <sergon0409@gmail.com>
 * 
 * @Overview
 * Restart is used when the player falls into the river
 * The time does not reset, but the score does
 * presenting a form of replay ability
 */
/* global BasicGame, game, SCREEN_HEIGHT, SCREEN_WIDTH, Phaser */

BasicGame.restart = function (game) {
    this.game = game;
};

BasicGame.restart.prototype = {
    preload: function () {

    },
    create: function () {
        var style = {
            font: "25px Arial",
            fill: "#ffffff",
            align: "center"
        };
        this.game.stage.backgroundColor = '#000000';
        var menu = this.game.add.sprite((BasicGame.w / 2), (BasicGame.h / 2), 'skunklose');
        this.text1 = this.game.add.text(BasicGame.w / 2 - 100, 70, "You ran out of energy!", style);
        this.text2 = this.game.add.text(BasicGame.w / 2 - 150, 90, "You must try again the next day.", style);
        this.text3 = this.game.add.text(BasicGame.w / 2 - 150, BasicGame.h / 2 + 200, "Press Enter or Return to Restart.", style);
        menu.anchor.x = .5;
        menu.anchor.y = .5;
    },
    update: function () {
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) || this.game.input.activePointer.isDown) {
            BasicGame.reset = true;
            this.game.state.start('level1');
        }
    }
};

