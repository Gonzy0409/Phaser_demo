/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * Zone 1 where player starts the game at their house.
 */
/* global Phaser, player, BasicGame, tileSize, dialogue, spaceKey, bKey */
'use strict';

BasicGame.level1 = function (game) {
    this.game = game;
};

BasicGame.level1.prototype.preload = function () {
    BasicGame.lastLocation = localStorage.getItem('lastLocation');
    localStorage.setItem('lastLocation', 'level1');
    if (BasicGame.reset) {
        BasicGame.lives = 3;
    }
    if (BasicGame.wood > 5) {
        BasicGame.finished = true;
        localStorage.setItem('finished', true);
    }
};

BasicGame.level1.prototype.create = function () {
    //start the physics
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);

    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    //The pause button
    this.pause = this.game.input.keyboard.addKey(Phaser.Keyboard.H);
    this.pause.onDown.add(this.togglePause, this);

    //test whether device is an apple device
    this.idevice = (/(iP(hone|od|ad))/i.test(navigator.userAgent));

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
            rightButton.alpha = 0.3;
        });
        leftButton.events.onInputUp.add(function () {
            player.moveLeft = false;
            leftButton.alpha = 0.3;
        });
        upButton.events.onInputUp.add(function () {
            player.moveUp = false;
            upButton.alpha = 0.3;
        });
        downButton.events.onInputUp.add(function () {
            player.moveDown = false;
            downButton.alpha = 0.3;
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
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tilesheet', 'tiles', 8, 8);

    //create the layer based on the tile positions in the .tmx layer called 'collision'
    this.mapCollision = this.map.createLayer('collision');
    //create the layer based on the tile positions in the .tmx layer called 'main'
    this.background = this.map.createLayer('main');
    this.background.resizeWorld();
    //create the layer based on the tile positions in the .tmx layer called 'bottoms'
    this.midground = this.map.createLayer('bottoms');

    //block 1 is the tile used to mark collisions
    this.map.setCollision(1, true, 'collision');

    // Load NPCs 
    this.npcs = this.game.add.group();

    // The lines for the NPCs
    this.lines = {
        don: {
            1: '*Your cousin lost an axe in the woods.*You need that axe to harvest wood.*Be careful though!*There are dangerous animals.*Defend yourself with \'B\'.*If you need any help talk to me again.',
            2: '*Have you found your cousin\'s axe?*It\'s in the NORTH side of the woods.*You need it to cut down trees.*If you see any bears, Don\'t bother them!',
            3: '*You need to harvest the right trees.*They look different from the normal trees.*Stand next to the tree and INTERACT.',
            4: '*You got all the wood?*That\'s Great!*Take them back to my house*and I\'ll start on that cart.'
        }
    };

    //convert the tiles to physics bodies for collision
    this.physics.p2.convertTilemap(this.map, this.mapCollision);
    // Create uncle Don
    this.gramps = new Npc(this.game, 109, 33, 'grandfather.png', this.lines.don[BasicGame.checkpoint]);

    // Create the exit points
    this.exitPoints = this.game.add.group();

    // Exit point 1: to level 2
    this.exitPoint1 = this.game.add.sprite(tileSize * 119 + 7, tileSize * 40, 'objects', 'levelchange.png');
    this.exitPoint1.scale.setTo(1, tileSize * 9);
    this.exitPoint1.destination = 'level2';

    // Exit point 2: to next Page in forgotten trail
    this.exitPoint2 = this.game.add.sprite(tileSize * 23, tileSize * 30, 'objects', 'levelchange.png');
    this.exitPoint2.destination = 'win';

    // Add both exit points to a group
    this.exitPoints.add(this.exitPoint1);
    this.exitPoints.add(this.exitPoint2);

    //Create player
    this.createPlayer();

    this.npcs.add(player.sprite);
    this.npcs.add(this.gramps.sprite);

    this.foreground = this.map.createLayer('tops');
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
    this.text2 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 60, "MOVE: Use arrow keys or w,a,s,d", style);
    this.text2.kill();
    this.text3 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 20, "ARROWS: Press B to fire an Arrow.", style);
    this.text3.kill();
    if (!this.game.device.desktop) {
        this.text1 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 100, "", style);
        this.text1.kill();
        this.text4 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 20, "INTERACT: Press A next to person/object.", style);
        this.text4.kill();
        this.text6 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 125, "Tap anywhere to continue.", style);
        this.text6.kill();
    }
    else {
        this.text1 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 - 100, "RUN: Hold the shift key.", style);
        this.text1.kill();
        this.text4 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 20, "INTERACT: Press Spacebar next to person/object.", style);
        this.text4.kill();
        this.text6 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 125, "Press H to Resume", style);
        this.text6.kill();
    }
    this.text5 = this.game.add.text(BasicGame.w / 4, BasicGame.h / 2 + 80, "Interact with your Uncle for instructions.", style);
    this.text5.kill();

    this.liveSprites = this.game.add.group();
    for (var i = 0; i < BasicGame.lives; i++) { //i is the amount sprites to show; i.e lives
        this.liveSprites.create((22 * i), 0, 'objects', 'lifesprite.png'); // i used here to spread the sprites
    }
    this.woodText = this.game.add.text(tileSize * 12, 0, "Wood: " + BasicGame.wood, style);
    this.peltsText = this.game.add.text(tileSize * 26, 0, "Pelts: " + BasicGame.pelts, style);
    this.hud = this.game.add.sprite(0, 0);

    this.hud.fixedToCamera = true;
    //this.hud.addChild(this.text);
    this.hud.addChild(this.liveSprites);
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

BasicGame.level1.prototype.update = function () {
    // Update the HUD
    this.woodText.setText("Wood: " + BasicGame.wood);
    this.peltsText.setText("Pelts: " + BasicGame.pelts);

    //Trigger Exit points
    this.exitPoints.forEach(function (exitPoint) {
        var b1 = exitPoint.getBounds();
        var bp = player.sprite.getBounds();
        if (Phaser.Rectangle.intersects(b1, bp)) {
            if (((exitPoint.destination !== 'win') && BasicGame.checkpoint > 1) || ((exitPoint.destination === 'win') && (BasicGame.finished))) {
                player.transfer = true;
                this.game.state.start(exitPoint.destination);
            }
        }
    }, this);

    //Talking to NPCs
    if ((spaceKey.isDown || player.interact) && dialogue.hidden) {
        if (BasicGame.haveAxe) {
            if (BasicGame.finished) {
                BasicGame.checkpoint = 4;
                localStorage.setItem('checkpoint', '4');
                this.updateCharacterLines();
                this.gramps.interact();
            }
            else {
                BasicGame.checkpoint = 3;
                localStorage.setItem('checkpoint', '3');
                this.updateCharacterLines();
                this.gramps.interact();
            }
        }
        else {
            if (this.gramps.interact()) {
                BasicGame.checkpoint = 2;
                localStorage.setItem('checkpoint', '2');
                this.updateCharacterLines();
            }
        }
    }
    if ((spaceKey.isDown || player.interact) && !dialogue.typing && !dialogue.hidden) {
        dialogue.hide();
    }

    // Update player
    player.update();

    // Sort player relative to grandpa based on y coordinate
    this.npcs.sort('y', Phaser.Group.SORT_ASCENDING);
};

BasicGame.level1.prototype.createPlayer = function () {
    // Initial Player Position by tile
    if (BasicGame.lastLocation === 'level1') {
        player.tilex = tileSize * 23;
        player.tiley = tileSize * 30;
        player.create('sam08.png', 'down');
    } else {
        player.tilex = tileSize * 118 - 2;
        player.tiley = tileSize * 41;
        player.create('sam04.png', 'left');
    }
};

BasicGame.level1.prototype.updateCharacterLines = function () {
    if (this.updating) {
        return;
    }
    this.updating = true;
    this.gramps.script = this.lines.don[BasicGame.checkpoint].split('*');
    this.gramps.spoke = false;
    this.updating = false;
};

BasicGame.level1.prototype.gofull = function () {
    if (this.game.scale.isFullScreen) {
        this.game.scale.stopFullScreen();
    }
    else {
        this.game.scale.startFullScreen(false);
    }
};

BasicGame.level1.prototype.togglePause = function () {
    this.game.paused = !this.game.paused;
    if (this.game.paused) {
        this.pause_screen.revive();
        this.text1.revive();
        this.text2.revive();
        this.text3.revive();
        this.text4.revive();
        this.text5.revive();
        this.text6.revive();
    }
    else {
        this.pause_screen.kill();
        this.text1.kill();
        this.text2.kill();
        this.text3.kill();
        this.text4.kill();
        this.text5.kill();
        this.text6.kill();
    }
};

BasicGame.level1.prototype.unpauseGame = function (event) {
    if (this.game.paused) {
        this.togglePause();
    }
};
