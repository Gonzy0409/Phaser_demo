/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * Boot phase, load the assets needed for preloader
 */
/* global Phaser */
'use strict';

var flipScreen;
var tileSize = 8,
        _rows = 80,
        _cols = 120,
        player,
        dialogue,
        spaceKey;

var BasicGame = {
    //game width and height is based on the .tmx properties
    w: tileSize * _cols,
    h: tileSize * _rows,
    lastLocation: 'level1', //keep track of last location player was in
    level: 1, //keep track of the level
    lives: 3, //The lives the player has
    camera: {
        x: 0,
        y: 0
    }
};

//Setup Local Storage
//Use last location to set player in specific location in zone depending on where they come from.
if (localStorage.getItem('lastLocation') === null) {
    BasicGame.lastLocation = 'level1';
    localStorage.setItem('lastLocation', 'level1');
}

//keep track of whether player has axe across zones.
if (localStorage.getItem('haveAxe') === null) {
    BasicGame.haveAxe = false;
    localStorage.setItem('haveAxe', false);
}
else {
    BasicGame.haveAxe = JSON.parse(localStorage.getItem('haveAxe'));
}

//keep track of what the player has achieved across zones.
if (localStorage.getItem('checkpoint') === null) {
    BasicGame.checkpoint = 1;
    localStorage.setItem('checkpoint', '1');
}
else {
    BasicGame.checkpoint = JSON.parse(localStorage.getItem('checkpoint'));
}

//keep track of whether the player has finished the game across zones.
if (localStorage.getItem('finished') === null) {
    BasicGame.finished = false;
    localStorage.setItem('finished', false);
}
else {
    BasicGame.finished = JSON.parse(localStorage.getItem('finished'));
}

//keep track of the player lives
if (localStorage.getItem('lives') === null) {
    BasicGame.lives = 3;
    localStorage.setItem('lives', BasicGame.lives);
}
else {
    BasicGame.lives = JSON.parse(localStorage.getItem('lives'));
}
//keep track of where the player's last x position was.
if (localStorage.getItem('playerX') === null) {
    localStorage.setItem('playerX', 0);
}

//keep track of where the player's last y position was.
if (localStorage.getItem('playerY') === null) {
    localStorage.setItem('playerY', 0);
}

//keep track of how many pelts the player has.
if (localStorage.getItem('pelts') === null) {
    BasicGame.pelts = 0;
    localStorage.setItem('pelts', 0);
}
else {
    BasicGame.pelts = JSON.parse(localStorage.getItem('pelts'));
}

//keep track of how much wood the player has collected.
if (localStorage.getItem('wood') === null) {
    BasicGame.wood = 0;
    localStorage.setItem('wood', 0);
}
else {
    BasicGame.wood = JSON.parse(localStorage.getItem('wood'));
}

//set up the skunk tracker false:dead true:alive
if (localStorage.getItem('skunkSpawns') === null) {
    BasicGame.skunkSpawns = [true, true, true, true, true, true, true];
    localStorage.setItem('skunkSpawns', JSON.stringify(BasicGame.skunkSpawns));
}
else {
    BasicGame.skunkSpawns = JSON.parse(localStorage.getItem('skunkSpawns'));
}

//set up the tree tracker 4 is the number of axe swings to chop down tree
if (localStorage.getItem('treeSpawns') === null) {
    /* The amount of chopping needed for each tree
     * The number is decremented on each swing of player axe and recorded
     * If player leaves and returns they don't have to swing at tree 4 times again.
     */
    BasicGame.treeSpawns = [4, 4, 4, 4, 4, 4];
    localStorage.setItem('treeSpawns', JSON.stringify(BasicGame.treeSpawns));
}
else {
    BasicGame.treeSpawns = JSON.parse(localStorage.getItem('treeSpawns'));
}

BasicGame.Boot = function (game) {
    this.game = game;
};

BasicGame.Boot.prototype = {
    preload: function () {
        //preload the loadscreen image
        this.game.load.image('loading', 'assets/img/preloader/loading.png');
        this.game.load.image('load_progress_bar_dark', 'assets/img/preloader/progress_bar_bg.png');
        this.game.load.image('load_progress_bar', 'assets/img/preloader/progress_bar_fg.png');
        this.game.load.image('orientation', 'assets/img/spritesheets/orientation.png');
    },
    create: function () {
        if (!this.game.device.desktop) {
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.setMinMax(480, 260, 1024, 768);
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.forceOrientation(true, false);
            this.game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
            this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        }
        this.game.stage.smoothed = false;
        this.game.state.start('preload');
    },
    enterIncorrectOrientation: function () {
        flipScreen = this.game.add.sprite((BasicGame.w / 2), (BasicGame.h / 2), 'orientation');
        flipScreen.fixedToCamera = true;
        flipScreen.anchor.x = .5;
        flipScreen.anchor.y = .5;
        BasicGame.orientated = false;
        this.game.paused = true;

    },
    leaveIncorrectOrientation: function () {
        flipScreen.kill();
        BasicGame.orientated = true;
        this.game.paused = false;
    }
};