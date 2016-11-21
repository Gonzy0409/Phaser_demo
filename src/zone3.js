/*
 * @author Gonzalo Serrano <sergon0409@gmail.com>
 * 
 * @Overview
 * Zone 3: the north part of the forest
 */
/* global Phaser, player, BasicGame, tileSize, dialogue, spaceKey, bKey */
'use strict';

BasicGame.level3 = function (game) {
    this.game = game;
};

BasicGame.level3.prototype.preload = function () {
    BasicGame.lastLocation = localStorage.getItem('lastLocation');
    localStorage.setItem('lastLocation', 'level3');
    this.playerx = parseInt(localStorage.getItem('playerX'));

    this.skunkLoc = [{
            x: 10,
            y: 20
        }, {
            x: 110,
            y: 20
        }];
};

BasicGame.level3.prototype.create = function () {
    //start the physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    //The pause button
    this.pause = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.pause.onDown.add(this.togglePause, this);

    //test whether device is an apple device
    this.idevice = (/(iPhone|iPod|iPad)/i.test(navigator.userAgent));

    //handle mobile input
    if (!this.game.device.desktop) {
        //the buttons
        var rightButton = this.game.add.button(95, BasicGame.h - 119, 'rightButton', null, this),
                leftButton = this.game.add.button(0, BasicGame.h - 119, 'leftButton', null, this),
                upButton = this.game.add.button(48, BasicGame.h - 150, 'upButton', null, this),
                downButton = this.game.add.button(48, BasicGame.h - 84, 'downButton', null, this),
                aButton = this.game.add.button(BasicGame.w - 58, BasicGame.h - 58, 'aButton', null, this),
                bButton = this.game.add.button(BasicGame.w - 58, BasicGame.h - 106, 'bButton', null, this),
                helpButton = this.game.add.button(BasicGame.w - 100, 0, 'helpButton', null, this);
        if (!this.idevice) {
            var fullScrnBtn = this.game.add.button(BasicGame.w - 58, 0, 'fullScreen', null, this);
        }

        // set the alpha of the buttons to transparent
        rightButton.alpha = 0.3;
        leftButton.alpha = 0.3;
        upButton.alpha = 0.3;
        downButton.alpha = 0.3;

        // Add an event to unpause if game is paused.
        this.game.input.onDown.add(this.unpauseGame, this);

        //toggle movement on button down
        rightButton.events.onInputDown.add(function () {
            player.moveRight = true;
            rightButton.alpha = 1;
        });
        leftButton.events.onInputDown.add(function () {
            player.moveLeft = true;
            leftButton.alpha = 1;
        });
        upButton.events.onInputDown.add(function () {
            player.moveUp = true;
            upButton.alpha = 1;
        });
        downButton.events.onInputDown.add(function () {
            player.moveDown = true;
            downButton.alpha = 1;
        });
        aButton.events.onInputDown.add(function () {
            player.talk = true;
            player.interact = true;
            aButton.alpha = 0.2;
        });
        bButton.events.onInputDown.add(function () {
            player.fire = true;
            bButton.alpha = 0.2;
        });
        helpButton.events.onInputDown.add(function () {
            this.togglePause();
        }, this);
        if (!this.idevice) {
            fullScrnBtn.events.onInputDown.add(this.gofull, this);
        }

        //disable movement when button is let up
        rightButton.events.onInputUp.add(function () {
            player.moveRight = false;
            rightButton.alpha = 0.2;
        });
        leftButton.events.onInputUp.add(function () {
            player.moveLeft = false;
            leftButton.alpha = 0.2;
        });
        upButton.events.onInputUp.add(function () {
            player.moveUp = false;
            upButton.alpha = 0.2;
        });
        downButton.events.onInputUp.add(function () {
            player.moveDown = false;
            downButton.alpha = 0.2;
        });
        aButton.events.onInputUp.add(function () {
            player.interact = false;
            aButton.alpha = 1;
        });
        bButton.events.onInputUp.add(function () {
            player.fire = false;
            bButton.alpha = 1;
        });
    }

    //Create the world
    this.map = this.game.add.tilemap('level3');
    this.map.addTilesetImage('tilesheet', 'tiles', 8, 8);

    //create the layer based on the tile positions in the .tmx layer called 'collision'
    this.mapCollision = this.map.createLayer('collision');
    //create the layer based on the tile positions in the .tmx layer called 'main'
    this.background = this.map.createLayer('main');
    this.background.resizeWorld();
    //create the layer based on the tile positions in the .tmx layer called 'lowerforest'
    this.midground = this.map.createLayer('lowerforest');

    //block 0 is the tile used to mark collisions
    this.map.setCollision(1, true, 'collision');

    //convert the tiles to physics bodies for collision
    this.physics.p2.convertTilemap(this.map, this.mapCollision);

    //Create the skunks
    this.skunks = [];
    for (var i = 0; i < 2; i++) {
        if (BasicGame.skunkSpawns[i + 1]) {
            this.skunks[i] = new Skunk(this.game, this.skunkLoc[i].x, this.skunkLoc[i].y, i + 1);
        }
    }

    // Create the exit points
    this.exitPoints = this.game.add.group();

    // Exit point 1: to Level 2
    this.exitPoint1 = this.game.add.sprite(tileSize * 56, tileSize * 79, 'objects', 'levelchange.png');
    this.exitPoint1.scale.setTo(tileSize * 36, 1);
    this.exitPoint1.destination = 'level2';

    this.exitPoints.add(this.exitPoint1);

    // set up arrows
    BasicGame.arrowTime = 0; //the time that arrows are allowed to be alive

    // add the container of arrows
    BasicGame.arrows = this.game.add.sprite(0, 0, 'objects', 'projectile_x.png');
    BasicGame.arrows.outOfBoundsKill = true;
    BasicGame.arrows.checkWorldBounds = true;
    this.game.physics.p2.enable(BasicGame.arrows);
    BasicGame.arrows.body.clearShapes();
    BasicGame.arrows.body.addRectangle(18, 5, 0, 0);
    BasicGame.arrows.kill();

    this.createPlayer();

    // Create trees
    this.tree1 = new Tree(this.game, 110, 10, 0, BasicGame.treeSpawns[0]);
    this.tree2 = new Tree(this.game, 9, 10, 1, BasicGame.treeSpawns[1]);
    if (BasicGame.treeSpawns[0] <= 0) {
        this.tree1.harvested = true;
        this.tree1.sprite.animations.play('chopped');
        this.tree1.sprite.body.kinematic = false;
        this.tree1.sprite.body.clearShapes();
        this.tree1.sprite.body.addRectangle(20, 10, 0, 0);
        this.tree1.sprite.body.y += 24;
        this.tree1.sprite.body.kinematic = true;
    }
    if (BasicGame.treeSpawns[1] <= 0) {
        this.tree2.harvested = true;
        this.tree2.sprite.animations.play('chopped');
        this.tree2.sprite.body.kinematic = false;
        this.tree2.sprite.body.clearShapes();
        this.tree2.sprite.body.addRectangle(20, 10, 0, 0);
        this.tree2.sprite.body.y += 24;
        this.tree2.sprite.body.kinematic = true;
    }

    // Create the tree stump
    this.stump = this.game.add.sprite(tileSize * 110, tileSize * 60, 'objects', 'treestump.png');
    this.game.physics.p2.enable(this.stump);
    this.stump.body.kinematic = true; //immovable
    //set stump body
    this.stump.body.clearShapes();
    this.stump.body.addRectangle(20, 1, 0, 0);

    // Create overlap group
    this.overlapGroup = this.game.add.group();
    this.overlapGroup.add(player.sprite);
    this.overlapGroup.add(this.tree1.sprite);
    this.overlapGroup.add(this.tree2.sprite);
    this.overlapGroup.add(this.stump);
    this.overlapGroup.add(BasicGame.arrows);

    // Create idle axe pick up Item.
    if (!BasicGame.haveAxe) {
        this.axe = this.game.add.sprite(tileSize * 108, tileSize * 58 - 1, 'objects', 'idle_axe.png');
    }

    // Add the final tile layer on top of player.
    this.foreground = this.map.createLayer('forest');
    this.foreground2 = this.map.createLayer('topforest');
    dialogue.create();

    //The HUD keeping track of lives and collectibles
    var style = {
        font: "25px Arial",
        fill: "#ffffff",
        align: "center"
    };
    this.pause_label = this.game.add.text(BasicGame.w - 100, 0, "H:Help", style);
    this.pause_screen = this.game.add.sprite(BasicGame.w / 2, BasicGame.h / 2, 'pause');
    this.pause_screen.anchor.setTo(0.5, 0.5);
    this.pause_screen.kill();
    if (!this.game.device.desktop) {
        this.text1 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 100, "", style);
        this.text1.kill();
        this.text7 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 125, "Tap anywhere to continue.", style);
        this.text7.kill();
    }
    else {
        this.text1 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 100, "RUN: Hold the shift key.", style);
        this.text1.kill();
        this.text7 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 125, "Press H to Resume", style);
        this.text7.kill();
    }
    this.text2 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 60, "MOVE: Use arrow keys or w,a,s,d", style);
    this.text2.kill();
    this.text3 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 20, "ARROWS: Press B to fire an Arrow.", style);
    this.text3.kill();
    this.text4 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 20, "Harvest: Stand next to tree and INTERACT.", style);
    this.text4.kill();
    this.text5 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 50, "The tree will fall after 4 chops.", style);
    this.text5.kill();
    this.text6 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 85, "Don\'t let the skunks catch you!", style);
    this.text6.kill();

    BasicGame.liveSprites = null;
    BasicGame.liveSprites = this.game.add.group();
    for (var i = 0; i < BasicGame.lives; i++) { //i is the amount sprites to show; i.e lives
        BasicGame.liveSprites.create((22 * i), 0, 'objects', 'lifesprite.png'); // i used here to spread the sprites
    }
    this.woodText = this.game.add.text(tileSize * 12, 0, "Wood: " + BasicGame.wood, style);
    this.peltsText = this.game.add.text(tileSize * 26, 0, "Pelts: " + BasicGame.pelts, style);
    this.hud = this.game.add.sprite(0, 0);

    this.hud.fixedToCamera = true;
    this.hud.addChild(BasicGame.liveSprites);
    this.hud.addChild(this.woodText);
    this.hud.addChild(this.peltsText);
    this.hud.addChild(this.pause_label);
    if (!this.game.device.desktop) {
        this.pause_label.kill();
        this.hud.addChild(rightButton);
        this.hud.addChild(leftButton);
        this.hud.addChild(upButton);
        this.hud.addChild(downButton);
        this.hud.addChild(aButton);
        this.hud.addChild(bButton);
        this.hud.addChild(helpButton);
        if (!this.idevice) {
            this.hud.addChild(fullScrnBtn);
        }
    }
    this.hud.cameraOffset.x = 10;
    this.hud.cameraOffset.y = 10;
};

BasicGame.level3.prototype.update = function () {
    // Update the HUD
    this.woodText.setText("Wood: " + BasicGame.wood);
    this.peltsText.setText("Pelts: " + BasicGame.pelts);

    //Check for lives
    this.game.time.events.onPlayerDeath.addOnce(this.loseLife, this);
    if (BasicGame.lives <= 0) {
        this.game.state.start('restart');
    }

    //fire the arrow
    if ((dialogue.hidden) && (bKey.isDown || player.fire) && !player.harvesting) {
        this.fire();
    }

    //Trigger Exit points
    this.exitPoints.forEach(function (ep) {
        var b1 = ep.getBounds();
        var bp = player.sprite.getBounds();
        if (Phaser.Rectangle.intersects(b1, bp)) {
            localStorage.setItem('playerX', player.sprite.x);
            localStorage.setItem('playerY', player.sprite.y);
            player.transfer = true;
            this.game.time.events.onPlayerDeath.removeAll();
            this.game.state.start(ep.destination);
        }
    }, this);

    //Check interaction with trees
    if ((spaceKey.isDown || player.interact) && dialogue.hidden) {
        if (!this.tree1.harvested) {
            this.tree1.interact();
        }
        if (!this.tree2.harvested) {
            this.tree2.interact();
        }
    }
    if ((spaceKey.isDown || player.interact) && !dialogue.typing && !dialogue.hidden) {
        dialogue.hide();
    }

    //Check if axe has been obtained
    if (!BasicGame.haveAxe && Phaser.Rectangle.intersects(this.axe.getBounds(), player.sprite.getBounds())) {
        this.axe.destroy();
        BasicGame.haveAxe = true;
        localStorage.setItem('haveAxe', true);
        BasicGame.checkpoint = 3;
        localStorage.setItem('checkpoint', BasicGame.checkpoint);
    }

    // Update player
    player.update();

    // Update the skunks
    for (var i = 0; i < this.skunks.length; i++) {
        if (this.skunks[i]) {
            this.skunks[i].update();

            // Check if arrow overlaps a skunk
            if (BasicGame.skunkSpawns[this.skunks[i].skunkNum] && Phaser.Rectangle.intersects(BasicGame.arrows.getBounds(), this.skunks[i].sprite.getBounds())) {
                BasicGame.skunkSpawns[this.skunks[i].skunkNum] = false;
                localStorage.setItem('skunkSpawns', JSON.stringify(BasicGame.skunkSpawns));
                BasicGame.arrows.kill();
                this.skunks[i].sprite.destroy();
                this.skunks[i] = null;
                BasicGame.pelts++;
                localStorage.setItem('pelts', BasicGame.pelts);
            }
        }
    }

    // Sort player relative to grandpa based on y coordinate
    this.overlapGroup.sort('y', Phaser.Group.SORT_ASCENDING);
};

BasicGame.level3.prototype.loseLife = function () {
    BasicGame.liveSprites.getFirstAlive().kill();
    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.createPlayer, this);
};


BasicGame.level3.prototype.createPlayer = function () {
    // Initial Player Position by tile
    if ((BasicGame.lastLocation === 'level2') || (BasicGame.lastLocation === 'level3')) {
        player.tilex = this.playerx;
        player.tiley = tileSize * 76 - 2;
        if (player.transfer || player.sprite === null) {
            player.create('sam08.png', 'up');
        }
        else {
            player.sprite.reset(player.tilex, player.tiley);
        }
    }
};

BasicGame.level3.prototype.fire = function () {
    if (this.game.time.now > BasicGame.arrowTime) {
        this.game.time.events.add(Phaser.Timer.SECOND, function () {
            BasicGame.arrows.kill();
        }, this);

        //  And fire it
        switch (player.sprite.direction) {
            case 'left':
                BasicGame.arrows.reset(player.sprite.x - 20, player.sprite.y);
                BasicGame.arrows.body.angle = 180;
                BasicGame.arrows.body.velocity.x = -400;
                BasicGame.arrows.body.velocity.y = 0;
                break;
            case 'right':
                BasicGame.arrows.reset(player.sprite.x + 18, player.sprite.y);
                BasicGame.arrows.body.angle = 0;
                BasicGame.arrows.body.velocity.x = 400;
                BasicGame.arrows.body.velocity.y = 0;
                break;
            case 'up':
                BasicGame.arrows.reset(player.sprite.x, player.sprite.y - 20);
                BasicGame.arrows.body.angle = -90;
                BasicGame.arrows.body.velocity.x = 0;
                BasicGame.arrows.body.velocity.y = -400;
                break;
            case 'down':
                BasicGame.arrows.reset(player.sprite.x, player.sprite.y + 25);
                BasicGame.arrows.body.angle = 90;
                BasicGame.arrows.body.velocity.x = 0;
                BasicGame.arrows.body.velocity.y = 400;
                break;
            default:
                break;
        }

        BasicGame.arrowTime = this.game.time.now + 1000;
    }
};

BasicGame.level3.prototype.gofull = function () {
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    }
    else {
        this.game.scale.startFullScreen(false);
    }
};

BasicGame.level3.prototype.togglePause = function () {
    this.game.paused = !this.game.paused;
    if (this.game.paused) {
        this.pause_screen.revive();
        this.text1.revive();
        this.text2.revive();
        this.text3.revive();
        this.text4.revive();
        this.text5.revive();
        this.text6.revive();
        this.text7.revive();
    }
    else {
        this.pause_screen.kill();
        this.text1.kill();
        this.text2.kill();
        this.text3.kill();
        this.text4.kill();
        this.text5.kill();
        this.text6.kill();
        this.text7.kill();
    }
};

BasicGame.level3.prototype.unpauseGame = function (event) {
    if (this.game.paused) {
        this.togglePause();
    }
};
