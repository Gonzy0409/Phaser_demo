/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * Preload phase, load all assets: images, json files, audio, texture atlas
 */
/* global BasicGame, Phaser */
'use strict';

BasicGame.Open = function (game) {
    this.game = game;
    BasicGame.lastLocation = localStorage.getItem('lastLocation');
};

BasicGame.Open.prototype = {
    preload: function () {

    },
    create: function () {
        // Create the opening screen.
        this.menu = this.game.add.sprite((BasicGame.w / 2), (BasicGame.h / 2), 'openscreen');
        this.menu.scale.set(2);
        this.menu.anchor.x = .5;
        this.menu.anchor.y = .5;
        // The style used in the text.
        this.style = {
            font: "25px Arial",
            fill: "#ffffff",
            align: "center"
        };

        this.ready = false;
        // The difficulty selection text.
        this.text1 = this.game.add.text(BasicGame.w / 4 + 50, BasicGame.h / 4, "Choose the difficulty of the game", this.style);

        // Create Button for easy mode.
        this.button1 = this.game.add.button(BasicGame.w / 2 - 250, BasicGame.h / 2, 'button', this.easyDifficulty, this, 0, 1, 2);
        this.button1.scale.set(2, 1.5);
        this.button1.smoothed = false;

        this.buttonText1 = this.game.add.bitmapText(BasicGame.w / 2 - 250, BasicGame.h / 2 + 7, 'textfont', "Easy", 16);
        this.buttonText1.x += (this.button1.width / 2) - (this.buttonText1.textWidth / 2);

        // Create Button for hard mode.
        this.button2 = this.game.add.button(BasicGame.w / 2 + 50, BasicGame.h / 2, 'button', this.hardDifficulty, this, 0, 1, 2);
        this.button2.scale.set(2, 1.5);
        this.button2.smoothed = false;

        this.buttonText2 = this.game.add.bitmapText(BasicGame.w / 2 + 50, BasicGame.h / 2 + 7, 'textfont', "Hard", 16);
        this.buttonText2.x += (this.button2.width / 2) - (this.buttonText2.textWidth / 2);
    },
    update: function () {
        if ((this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
                this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) ||
                this.game.input.activePointer.isDown) && this.ready) {
            this.game.state.start(BasicGame.lastLocation);
            //Start music in menu
            BasicGame.music = this.game.add.sound('soundtrack');
            BasicGame.music.volume = 0.5;
            BasicGame.music.play('', 0, 1, true);

            //load the skunk growl
            BasicGame.growl = this.game.add.audio('skunkgrowl');
            BasicGame.growl.volume = 0.5;

            //load bush1 sound
            BasicGame.bush1 = this.game.add.audio('bush1');
            BasicGame.bush1.volume = 0.5;

            //load bush2 sound
            BasicGame.bush2 = this.game.add.audio('bush2');
            BasicGame.bush2.volume = 0.5;

            //Add the sounds to wood chopping
            BasicGame.chop1 = this.game.add.sound('woodchop1');
            BasicGame.chop2 = this.game.add.sound('woodchop2');
            BasicGame.chop3 = this.game.add.sound('woodchop3');
            BasicGame.chop4 = this.game.add.sound('woodchop4');
        }
    },
    makeButton: function (difficulty, x, y) {

        var button = this.game.add.button(x, y, 'button', this.click, this, 0, 1, 2);
        button.scale.set(2, 1.5);
        button.smoothed = false;

        var text = this.game.add.bitmapText(x, y + 7, 'textfont', difficulty, 16);
        text.x += (button.width / 2) - (text.textWidth / 2);

    },
    easyDifficulty: function () {
        this.text1.destroy();
        this.buttonText1.destroy();
        this.buttonText2.destroy();
        this.button1.destroy();
        this.button2.destroy();
        this.createInstructions();
        BasicGame.difficulty = "easy";
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },
    hardDifficulty: function () {
        this.text1.destroy();
        this.buttonText1.destroy();
        this.buttonText2.destroy();
        this.button1.destroy();
        this.button2.destroy();
        this.createInstructions();
        BasicGame.difficulty = "hard";
        this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this);
    },
    startGame: function () {
        this.ready = true;
    },
    createInstructions: function () {
        if (this.game.device.desktop) {
            this.game.add.text(400, 285, "INTERACT: Press space bar near person/object", this.style);
            this.game.add.text(400, 310, "RUN: Hold shift key", this.style);
            this.game.add.text(400, 335, "MOVE: Use arrow keys or W,A,S,D ", this.style);

            this.game.add.text(400, 375, "Find your Uncle Don.", this.style);
            this.game.add.text(400, 400, "He will tell you what you need.", this.style);
            this.game.add.text(300, 430, "HIT THE SPACE BAR OR ENTER TO START GAME", this.style);
        }
        else {
            this.game.add.text(400, 355, "Find your Uncle Don.", this.style);
            this.game.add.text(400, 375, "He will tell you what you need.", this.style);
            this.game.add.text(400, 420, "Tap Screen to Start", this.style);
        }
    }
};