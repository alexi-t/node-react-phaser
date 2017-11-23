import 'pixi.js';
import 'p2';
import 'phaser';
import * as Phaser from 'phaser-ce';
import * as React from 'react';
import './game.css';
import { TerrainTypes } from '../../game/constants';
import TextureGenerator from '../../game/utils/textureGenerator';
import { LandscapeChunk, TextureDirections } from '../../game/components/world/landscapeChunk';
import { LandscapeManager } from '../../game/components/world/landscapeManager';
import { Map } from '../../game/components/world/map';

class GameComponent extends React.Component {
    componentDidMount() {
        let cursors: Phaser.CursorKeys;
        let landscapeManager: LandscapeManager = new LandscapeManager();
        let map = new Map();

        var game = new Phaser.Game(1000, 800, Phaser.WEBGL, 'gameView',
            {
                preload: preload,
                create: create,
                update: update,
                render: render2
            });

        function preload() {
        }

        function create() {
            game.stage.backgroundColor = '#fff';
            game.world.setBounds(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER);

            cursors = game.input.keyboard.createCursorKeys();

            let generator = new TextureGenerator(game);

            generator.generateForTerrainTypes(TerrainTypes, TextureDirections);

            (game.camera as any).bounds = null;
            game.camera.setPosition(0, 0);
            landscapeManager.renderVisible(game.camera);
            map.init(game);
        }

        function update() {
            let positionChanged = false;
            if (cursors.up.isDown) {
                game.camera.y -= 4;
                positionChanged = true;
            }
            else if (cursors.down.isDown) {
                game.camera.y += 4;
                positionChanged = true;
            }

            if (cursors.left.isDown) {
                game.camera.x -= 4;
                positionChanged = true;
            }
            else if (cursors.right.isDown) {
                game.camera.x += 4;
                positionChanged = true;
            }
            if (positionChanged)
            {
                landscapeManager.renderVisible(game.camera);
                map.update(game);
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