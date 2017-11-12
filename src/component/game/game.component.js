import 'pixi.js';
import 'p2';
import 'phaser';
import * as Phaser from 'phaser-ce';
import React, { Component } from 'react';
import './game.css';
import tooloud from 'tooloud';
import { TerrainType } from '../../game/constants';
import TextureGenerator from '../../game/utils/textureGenerator';

class GameComponent extends Component {
    componentDidMount() {
        var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'gameView',
            {
                preload: preload,
                create: create,
                render: render2
            });

        function preload() {
        }

        function create() {
            game.stage.backgroundColor = '#fff';

            let generator = new TextureGenerator(game);

            generator.generateForTerrainTypes(TerrainType, ['NE', 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E']);

            //	Now let's make some sprites using this texture, one every second
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.add.sprite(500, 300 - 128, game.cache.getBitmapData('gsNEs'));
            game.add.sprite(500 - 128, 300 - 128, game.cache.getBitmapData('gsNEg'));
            game.add.sprite(500, 300, game.cache.getBitmapData('gsNEg'));

            game.add.sprite(500 - 256, 300 - 128, game.cache.getBitmapData('gsNWg'));
            game.add.sprite(500 - 384, 300 - 128, game.cache.getBitmapData('gsNWs'));
            game.add.sprite(500 - 384, 300, game.cache.getBitmapData('gsNWg'));

            game.add.sprite(500 - 128, 300 - 256, game.cache.getBitmapData('gsNEs'));
            game.add.sprite(500 - 256, 300 - 256, game.cache.getBitmapData('gsNWs'));

            game.add.sprite(500 + 128, 300, game.cache.getBitmapData('gsNEs'));
            game.add.sprite(500 + 128, 300 + 128, game.cache.getBitmapData('gsE'));
            game.add.sprite(500 + 128, 300 + 256, game.cache.getBitmapData('gsSEs'));

            game.add.sprite(500, 300 + 256, game.cache.getBitmapData('gsSEg'));
            game.add.sprite(500, 300 + 384, game.cache.getBitmapData('gsSEs'));
            game.add.sprite(500 - 128, 300 + 384, game.cache.getBitmapData('gsSEg'));

            game.add.sprite(500 - 256, 300 + 256, game.cache.getBitmapData('gsSWg'));
            game.add.sprite(500 - 384, 300 + 256, game.cache.getBitmapData('gsSWs'));
            game.add.sprite(500 - 384, 300 + 128, game.cache.getBitmapData('gsSWg'));
        }

        function render2() {
        }
    }

    render() {
        return (
            <div id="gameView"></div>
        );
    }
}

export default GameComponent;