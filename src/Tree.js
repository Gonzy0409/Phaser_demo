/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * Tree Class
 */
/* global Phaser, player, dialogue, tileSize, BasicGame, dialog */
'use strict';

//x is the location in column tiles, y is the location in row tiles.
var Tree = function (game, x, y, treeNum, treeLife) {
    this.game = game;
    this.harvested = false; //switch to true when player has harvested tree and switch animation to stump.
    this.treeNum = treeNum; //used to update the specific tree in storage
    this.treeLife = treeLife; //used to determine which chopping sound to play
    this.line = "*You don't have an axe.*Instead you punch the tree.*Kapow!*OUCH!";
    this.script = this.line.split('*');
    this.sprite = this.game.add.sprite(tileSize * x, tileSize * y, 'objects', 'harvest_tree.png');

    this.sprite.anchor.setTo(0.5, 0.5);
    //gives object a p2 body and centers it's x/y anchor to 0.5.
    this.game.physics.p2.enable(this.sprite);
    this.sprite.body.fixedRotation = true; //no rotations
    this.sprite.body.kinematic = true; //immovable

    //Create a rectangular hitbox around body
    this.sprite.body.clearShapes();
    this.sprite.body.addRectangle(20, 10, 0, 20);

    //Idle states
    this.sprite.animations.add('chopped', ['treestump.png']);

};

Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.interact = function () {
    this.distance = lineDistance(player.sprite, this.sprite);
    if (BasicGame.haveAxe && this.distance < 30 && !player.harvesting) {
        //if player is within distance and interacts, play chopping sound and reduce life of tree.
        player.harvest();
        this.game.time.events.add(Phaser.Timer.SECOND, this.harvest, this);
        return true;
    }
    else if (this.distance < 30 && !player.harvesting) {
        this.punchTree();
        return true;
    }
    else {
        return false;
    }
};

Tree.prototype.punchTree = function () {
    dialogue.show(this, this.script);
};

Tree.prototype.harvest = function () {
    if (this.treeLife === 4) {
        BasicGame.chop1.play('', 0, 1, false);
    }
    if (this.treeLife === 3) {
        BasicGame.chop2.play('', 0, 1, false);
    }
    if (this.treeLife === 2) {
        BasicGame.chop3.play('', 0, 1, false);
    }
    if (this.treeLife === 1) {
        BasicGame.chop4.play('', 0, 1, false);
    }
    this.loseLife();
};

Tree.prototype.loseLife = function () {
    this.treeLife--;
    if (this.treeLife <= 0) {
        this.harvested = true;
        BasicGame.wood++;
        localStorage.setItem('wood', BasicGame.wood);
        this.sprite.animations.play('chopped');
        this.sprite.body.kinematic = false;
        this.sprite.body.clearShapes();
        this.sprite.body.addRectangle(20, 10, 0, 0);
        this.sprite.body.y += 24;
        this.sprite.body.kinematic = true;
    }
    if (localStorage.getItem('treeSpawns') === null) {
        return;
    }
    else {
        BasicGame.treeSpawns[this.treeNum] = this.treeLife;
        localStorage.setItem('treeSpawns', JSON.stringify(BasicGame.treeSpawns));
    }
};
