/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * skunk class
 */
/* global Phaser, player, dialogue, tileSize */
'use strict';

//x is the location in column tiles, y is the location in row tiles.
var Skunk = function (game, x, y, skunkNum) {
    this.game = game;
    this.skunkNum = skunkNum;
    this.speed = 50;
    this.distanceToPlayer = 0;
    this.direction = "left";
    this.isIdle = true;
    this.sprite = this.game.add.sprite(tileSize * x, tileSize * y, 'creatures', 'skunk00.png');

    //gives object a p2 body and centers it's x/y anchor to 0.5.
    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true;

    //Create a rectangular hitbox around body
    this.sprite.body.clearShapes();
    this.sprite.body.addRectangle(24, 15, 0, 0);

    //Idle states
    this.sprite.animations.add('idleleft', ['skunk00.png']);
    this.sprite.animations.add('idleright', ['skunk05.png']);
    this.sprite.animations.add('idleup', ['skunk15.png']);
    this.sprite.animations.add('idledown', ['skunk10.png']);

    //Walking states
    this.sprite.animations.add("right", ["skunk05.png", "skunk06.png", "skunk07.png", "skunk08.png", "skunk09.png"], 7, true, false);
    this.sprite.animations.add("up", ["skunk15.png", "skunk16.png", "skunk17.png", "skunk18.png", "skunk19.png"], 7, true);
    this.sprite.animations.add("left", ["skunk00.png", "skunk01.png", "skunk02.png", "skunk03.png", "skunk04.png"], 7, true);
    this.sprite.animations.add("down", ["skunk10.png", "skunk11.png", "skunk12.png", "skunk13.png", "skunk14.png"], 7, true);
};

Skunk.prototype = Object.create(Phaser.Sprite.prototype);
Skunk.prototype.constructor = Skunk;

Skunk.prototype.chase = function () {
    var angle = Math.atan2(player.sprite.y - this.sprite.y, player.sprite.x - this.sprite.x);

    if (angle > -2.5 && angle < -0.5) {
        if (this.direction !== "up") {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
        this.direction = "up";
    }
    else if (angle > 2.5 || angle < -2.5) {
        if (this.direction !== "left") {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
        this.direction = "left";
    }
    else if (angle > -0.5 && angle < 0.5) {
        if (this.direction !== "right") {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
        this.direction = "right";
    }
    else if (angle > 0.5 && angle < 2.5) {
        if (this.direction !== "down") {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }
        this.direction = "down";
    }

    if (this.direction === "left") {
        this.sprite.animations.play('left');
    }
    else if (this.direction === "up") {
        this.sprite.animations.play('up');
    }
    else if (this.direction === "right") {
        this.sprite.animations.play('right');
    }
    else if (this.direction === "down") {
        this.sprite.animations.play('down');
    }

    this.sprite.body.force.x = Math.cos(angle) * this.speed;    // accelerateToObject 
    this.sprite.body.force.y = Math.sin(angle) * this.speed;
};

Skunk.prototype.attackPlayer = function () {
    player.loseLife();
};

Skunk.prototype.idle = function () {
    if (!this.isIdle) {
        if (this.direction === "left") {
            this.sprite.animations.play('idleleft');
        }
        else if (this.direction === "right") {
            this.sprite.animations.play('idleright');
        }
        else if (this.direction === "up") {
            this.sprite.animations.play('idleup');
        }
        else if (this.direction === "down") {
            this.sprite.animations.play('idledown');
        }

        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.isIdle = true;
    }
};

Skunk.prototype.update = function () {
    this.distanceToPlayer = lineDistance(this.sprite, player.sprite);
    if (this.distanceToPlayer <= 30 && player.sprite.alive) {
        this.attackPlayer();
    }
    else if (this.distanceToPlayer > 30 && this.distanceToPlayer < 250) {
        this.chase();
        this.isIdle = false;
    }
    else {
        this.idle();
    }
};
