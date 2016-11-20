/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * Gopher Hole Class
 */
/* global Phaser, player, dialogue, tileSize, BasicGame, dialog */
'use strict';

//x is the location in column tiles, y is the location in row tiles.
var GopherHole = function (game, x, y) {
    this.game = game;

    // This object becomes an extension of the sprite object
    Phaser.Sprite.call(this, game, x, y, 'objects', 'gopher_hole00.png');
    
    //gives object a p2 body and centers it's x/y anchor to 0.5.
    this.game.physics.p2.enable(this);
    this.body.fixedRotation = true; //no rotations
    this.body.kinematic = true; //immovable

    //Create a rectangular hitbox around body
    this.body.clearShapes();
    this.body.addRectangle(8, 1, 0, -6);
};

GopherHole.prototype = Object.create(Phaser.Sprite.prototype);
GopherHole.prototype.constructor = GopherHole;

GopherHole.prototype.killPlayer = function () {
    player.diedToHole = true;
    player.loseLife();
};

//Since this is an extension of the sprite object, update will be called in the global update que.
GopherHole.prototype.update = function () {
    this.distanceToPlayer = lineDistance(this, player.sprite);
    if (this.distanceToPlayer < 30) {
        this.angle = Math.atan2(player.sprite.y - this.y, player.sprite.x - this.x);
        
        // Check for the angle since the distance between sprites depends on which side the player is on.
        if (this.angle > -2.5 && this.angle < -0.5) { // player above this
            if (this.distanceToPlayer < 25 && player.sprite.alive) {
                this.killPlayer();
            }
        }
        else if (this.angle > 2.5 || this.angle < -2.5) {//player left of this
            if (this.distanceToPlayer < 8 && player.sprite.alive) {
                this.killPlayer();
            }
        }
        else if (this.angle > -0.5 && this.angle < 0.5) {//player right of this
            if (this.distanceToPlayer < 8 && player.sprite.alive) {
                this.killPlayer();
            }
        }
        else if (this.angle > 0.5 && this.angle < 2.5) {//player below this
            if (this.distanceToPlayer < 1 && player.sprite.alive) {
                this.killPlayer();
            }
        }
    }
};