import 'pixi.js';
import 'p2';
import 'phaser';
import * as Phaser from 'phaser-ce';
import React, { Component } from 'react';
import './game.css';
import tooloud from 'tooloud';
import { TerrainType } from '../../game/constants';
import TextureGenerator from '../../game/utils/textureGenerator';
import LandscapeChunk from '../../game/components/world/landscapeChunk';

class GameComponent extends Component {
    componentDidMount() {
        var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'gameView',
            {
                preload: preload,
                create: create,
                update: update,
                render: render2
            });

        function preload() {
        }

        var cursors = null;

        function create() {
            game.stage.backgroundColor = '#fff';
            game.world.setBounds(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            cursors = game.input.keyboard.createCursorKeys();

            let generator = new TextureGenerator(game);

            generator.generateForTerrainTypes(TerrainType, ['NE', 'N', 'NW', 'W', 'SW', 'S', 'SE', 'E']);

            let chunk = new LandscapeChunk(-2, -2);

            chunk.draw(game);

            game.camera.bounds = null;
            game.camera.setPosition(0, 0);
        }

        function update() {
            if (cursors.up.isDown) {
                game.camera.y -= 4;
            }
            else if (cursors.down.isDown) {
                game.camera.y += 4;
            }

            if (cursors.left.isDown) {
                game.camera.x -= 4;
            }
            else if (cursors.right.isDown) {
                game.camera.x += 4;
            }
        }

        function render2() {
            game.debug.cameraInfo(game.camera, 32, 32);
        }
    }

    render() {
        return (
            <div id="gameView"></div>
        );
    }
}

export default GameComponent;