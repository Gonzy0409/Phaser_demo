/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * Dialog class used by NPCs
 */
/* global Phaser, BasicGame, tileSize */
'use strict';

/* Typing text based on the 'Kern of Duty' example from examples.phaser.io */

var Dialogue = function (game) {
    this.game = game;
    this.hidden = true; //hide dialogue box on creation
    this.sprite = null;
    this.index = 0;
    this.line = '';
    this.text = '';
    this.typing = false;
    this.speaker = null; //the sprite/npc currently speaking
};

Dialogue.prototype = {
    // Call Dialog.preload() inside the preload state of the game
    preload: function () {
        this.game.load.image('textbox', 'assets/img/spritesheets/textbox.png', tileSize, tileSize);
    },
    create: function () {
        this.sprite = this.game.add.sprite(0, 11 * 64, 'textbox');
        this.sprite.width += 140;
        this.sprite.alpha = 0;
        this.text = this.game.add.bitmapText(30, 7 * 64 + 30, 'textfont', '', 30);
    },
    show: function (speaker, content) {
        if (this.typing) {
            return;
        }
        this.speaker = speaker;
        this.content = content;
        this.typing = true;
        this.hidden = false;

        /* Position sprite below the current screen and make it visible */
        this.sprite.x = BasicGame.camera.x * BasicGame.w;
        this.sprite.y = BasicGame.camera.y * BasicGame.h + 11 * 64;

        this.text.x = BasicGame.camera.x * BasicGame.w + 30;
        this.text.y = BasicGame.camera.y * BasicGame.h + 7 * 64 + 30;

        this.sprite.alpha = 100;

        /* Slide Up the Dialogue Panel */
        var t = this.game.add.tween(this.sprite).to({x: BasicGame.camera.x * BasicGame.w, y: BasicGame.camera.y * BasicGame.h + 7 * 64}, 250);
        t.start();
        t.onComplete.add(function () {
            this.nextLine();
        }, this);
    },
    hide: function () {
        if (this.hidden === true) {
            return;
        }

        /* Reset to defaults*/
        this.text.setText('');
        this.line = '';
        this.index = 0;

        /* Slide Down the Dialogue Panel and make it invisible */
        var t = this.game.add.tween(this.sprite).to({x: BasicGame.camera.x * BasicGame.w, y: BasicGame.camera.y * BasicGame.h + 11 * 64}, 250);
        t.start();
        t.onComplete.add(function () {
            this.hidden = true;
            this.sprite.alpha = 0;
        }, this);
    },
    nextLine: function () {
        this.index++;

        if (this.index < this.content.length)
        {
            this.line = '';
            this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
        } else {
            this.typing = false;
            this.speaker = null;
            this.text.setText(this.line + ' *');
        }
    },
    updateLine: function () {
        if (this.line.length < this.content[this.index].length)
        {
            this.line = this.content[this.index].substr(0, this.line.length + 1);
            this.text.setText(this.line);
        }
        else
        {
            //  Wait 2 seconds then start a new line
            this.game.time.events.add(Phaser.Timer.SECOND*2, this.nextLine, this);
        }
    }
};
