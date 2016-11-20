/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * NPC class
 */
/* global Phaser, player, dialogue, tileSize */
'use strict';

function lineDistance(point1, point2) {
    var x = 0;
    var y = 0;
    x = Math.abs(point1.x - point2.x);
    x *= x;
    y = Math.abs(point1.y - point2.y);
    y *= y;
    return Math.sqrt(x + y);
}

//x is the columns and y is the rows
var Npc = function (game, x, y, name, script) {
    this.game = game;
    this.sprite = this.game.add.sprite(tileSize * x, tileSize * y, 'characters', name);
    this.sprite.anchor.setTo(0.5, 0.5);

    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.kinematic = true; //immovable
    this.sprite.body.clearShapes();
    this.sprite.body.addRectangle(16, 1, 0, 10);

    this.script = script.split('*');
    this.spoke = false;

};

Npc.prototype = Object.create(Phaser.Sprite.prototype);

Npc.prototype.interact = function () {
    if (lineDistance(player.sprite, this.sprite) < 30) {
        //If already talked to, only repeat the last line
        if (this.spoke === false) {
            dialogue.show(this, this.script);
            this.spoke = true;
        } else {
            dialogue.show(this, new Array('', this.script[this.script.length - 1]));
        }
        return true;
    } else {
        return false;
    }
};
Npc.prototype.constructor = Npc;

