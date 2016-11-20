/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * Bear class
 */
/* global Phaser, player, dialogue, tileSize */
'use strict';

//x is the location in column tiles, y is the location in row tiles.
var Bear = function (game, x, y) {
    this.game = game;
    this.isIdle = true;
    this.sprite = this.game.add.sprite(tileSize * x, tileSize * y, 'creatures', 'bear00.png');

    //gives object a p2 body and centers it's x/y anchor to 0.5.
    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true;
    this.sprite.body.kinematic = true; //immoveable

    //Create a rectangular hitbox around body
    this.sprite.body.clearShapes();
    this.sprite.body.addRectangle(24, 15, 0, 0);

    //Idle states
    this.sprite.animations.add('idle', ['bear01.png', 'bear03.png', 'bear04.png', 'bear03.png', 'bear04.png', 'bear03.png', 'bear04.png', 'bear03.png'], 1.5, true, false);
    this.sprite.animations.add('alert', ['bear00.png']);

    this.sprite.animations.play('idle');
};

Bear.prototype = Object.create(Phaser.Sprite.prototype);
Bear.prototype.constructor = Bear;

Bear.prototype.idle = function () {
    this.sprite.animations.play('idle');
};

Bear.prototype.alert = function () {
    this.sprite.animations.play('alert');
};

Bear.prototype.attackPlayer = function () {
    player.diedToBear = true;
    player.loseLife();
};

Bear.prototype.update = function () {
    this.distanceToPlayer = lineDistance(this.sprite, player.sprite);
    if (this.distanceToPlayer < 50 && player.sprite.alive) {
        this.attackPlayer();
    }
    else if (this.distanceToPlayer < 150) {
        this.alert();
    }
    else {
        this.idle();
    }
};
