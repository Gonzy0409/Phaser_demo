/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 * 
 * @Overview
 * Player class
 */
/* global Phaser, BasicGame, tileSize, dialogue */
'use strict';

var wKey, aKey, sKey, dKey, bKey, shiftKey;

var Player = function (game) {
    this.game = game;
    this.sprite = null;
    this.transfer = false;
    this.alive = true;
    this.tilex = 0; //the x tile on the tilemap
    this.tiley = 0; //the y tile on the tilemap
    this.lives = 3; //the amount of lives the player has.
    this.harvesting = false; //flag to have player harvest trees
    this.harvestTime = 0; //the time to track before a threshold to stop harvesting animations
    this.chopSound = 1; //the chop sound to play
    this.diedToBear = false;
    this.diedToSkunk = false;
    // create a signal for player death
    this.game.time.events.onPlayerDeath = new Phaser.Signal();
};

Player.prototype = {
    preload: function () {
        // Call Player.preload() inside the preload state of the game
        this.game.load.atlasJSONHash('characters', 'assets/img/spritesheets/characters.png', 'assets/img/spritesheets/characters.json');
    },
    create: function (startPosition, direction) {
        this.transfer = false;
        //the arrow keys
        this.cursor = this.game.input.keyboard.createCursorKeys();

        //Setup WASD and extra keys
        wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B);
        shiftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

        this.sprite = this.game.add.sprite(this.tilex, this.tiley, 'characters', startPosition);

        this.sprite.anchor.setTo(0.5, 0.5);
        this.game.physics.p2.enable(this.sprite); // set up player physics
        this.sprite.body.fixedRotation = true; // no rotation

        //Create a rectangular hitbox around players body
        this.sprite.body.clearShapes();
        this.sprite.body.addRectangle(20, 20, -1, 7);

        this.sprite.direction = direction;

        //Idle states
        this.sprite.animations.add('idledown', ['sam00.png']);
        this.sprite.animations.add('idleleft', ['sam04.png']);
        this.sprite.animations.add('idleright', ['sam08.png']);
        this.sprite.animations.add('idleup', ['sam12.png']);

        //Walking states
        this.sprite.animations.add("right", ["sam09.png", "sam10.png", "sam11.png", "sam08.png"], 7, true, false);
        this.sprite.animations.add("down", ["sam01.png", "sam02.png", "sam03.png", "sam00.png"], 7, true, false);
        this.sprite.animations.add("up", ["sam13.png", "sam14.png", "sam15.png", "sam12.png"], 7, true, false);
        this.sprite.animations.add("left", ["sam05.png", "sam06.png", "sam07.png", "sam04.png"], 7, true, false);

        //Running states
        this.sprite.animations.add("runright", ["sam09.png", "sam10.png", "sam11.png", "sam08.png"], 15, true, false);
        this.sprite.animations.add("rundown", ["sam01.png", "sam02.png", "sam03.png", "sam00.png"], 15, true, false);
        this.sprite.animations.add("runup", ["sam13.png", "sam14.png", "sam15.png", "sam12.png"], 15, true, false);
        this.sprite.animations.add("runleft", ["sam05.png", "sam06.png", "sam07.png", "sam04.png"], 15, true, false);

        //Harvesting states
        this.sprite.animations.add("chopright", ["sam_chop16.png", "sam_chop17.png", "sam_chop18.png", "sam_chop19.png",
            "sam_chop20.png", "sam_chop21.png", "sam_chop22.png", "sam_chop16.png"], 8, false, false);

        this.sprite.animations.add("chopdown", ["sam_chop00.png", "sam_chop01.png", "sam_chop02.png", "sam_chop03.png",
            "sam_chop04.png", "sam_chop05.png", "sam_chop06.png", "sam_chop00.png"], 8, false, false);

        this.sprite.animations.add("chopup", ["sam_chop08.png", "sam_chop09.png", "sam_chop10.png", "sam_chop11.png",
            "sam_chop12.png", "sam_chop13.png", "sam_chop14.png", "sam_chop08.png"], 8, false, false);

        this.sprite.animations.add("chopleft", ["sam_chop24.png", "sam_chop25.png", "sam_chop26.png", "sam_chop27.png",
            "sam_chop28.png", "sam_chop29.png", "sam_chop30.png", "sam_chop24.png"], 8, false, false);
    },
    update: function () {
        if (!this.harvesting) {
            this.movements();
        }
        else {
            this.harvestTime += 1;
            if (this.harvestTime > 50) {
                this.harvesting = false;
            }
        }
    },
    movements: function () {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;

        var speed = (shiftKey.isDown || this.run) ? 275 : 100;

        //Don't move when the dialogue box is visible
        if ((dialogue.hidden) && (this.cursor.left.isDown || aKey.isDown || this.moveLeft)) {
            this.sprite.body.velocity.x = -speed;
            this.sprite.direction = 'left';
            this.sprite.animations.play('left');
        }
        else if ((dialogue.hidden) && (this.cursor.right.isDown || dKey.isDown || this.moveRight)) {
            this.sprite.body.velocity.x = speed;
            this.sprite.direction = 'right';
            this.sprite.animations.play('right');
        }
        else if ((dialogue.hidden) && (this.cursor.up.isDown || wKey.isDown || this.moveUp)) {
            this.sprite.body.velocity.y = -speed;
            this.sprite.direction = 'up';
            this.sprite.animations.play('up');
        }
        else if ((dialogue.hidden) && (this.cursor.down.isDown || sKey.isDown || this.moveDown)) {
            this.sprite.body.velocity.y = speed;
            this.sprite.direction = 'down';
            this.sprite.animations.play('down');
        }
        else {
            if (this.sprite.direction === 'up') {
                this.sprite.animations.play('idleup');
            }
            else if (this.sprite.direction === 'down') {
                this.sprite.animations.play('idledown');
            }
            else if (this.sprite.direction === 'right') {
                this.sprite.animations.play('idleright');
            }
            else if (this.sprite.direction === 'left') {
                this.sprite.animations.play('idleleft');
            }
        }
    },
    harvest: function () {
        if (this.harvesting) {
            return;
        }
        this.harvestTime = 0;
        this.harvesting = true;
        switch (this.sprite.direction) {
            case 'left':
                this.sprite.animations.play('chopleft');
                break;
            case 'right':
                this.sprite.animations.play('chopright');
                break;
            case 'up':
                this.sprite.animations.play('chopup');
                break;
            case 'down':
                this.sprite.animations.play('chopdown');
                break;
            default:
                break;
        }
        this.game.time.events.add(Phaser.Timer.SECOND, function () {
            this.harvesting = false;
        }, this);
    },
    loseLife: function () {
        BasicGame.lives--;
        this.sprite.kill();
        //dispatch a single signal that player has died
        this.game.time.events.onPlayerDeath.dispatch(this);
    }
};

