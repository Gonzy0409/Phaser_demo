/*
 * @author          Gonzalo Serrano <gonzalo@7generationgames.com>
 * @copyright       2015 7 Generation Games
 *
 * @Overview
 * Game to help uncle Don get wood for cart
 */
/* global BasicGame, Phaser */

window.onload = function () {
    var game = new Phaser.Game(BasicGame.w, BasicGame.h, Phaser.CANVAS);
    //create game states
    game.state.add('boot', BasicGame.Boot);
    game.state.add('preload', BasicGame.Preload);
    game.state.add('openscreen', BasicGame.Open);
    game.state.add('win', BasicGame.win);
    game.state.add('lose', BasicGame.lose);
    game.state.add('restart', BasicGame.restart);
    game.state.add('level1', BasicGame.level1);
    game.state.add('level2', BasicGame.level2);
    game.state.add('level3', BasicGame.level3);
    game.state.add('level4', BasicGame.level4);
    game.state.add('level5', BasicGame.level5);
    //start boot game state 
    //procedure is boot -> preload -> openscreen -> game -> win/lose/restart -> next page
    game.state.start('boot');
};