import tooloud from 'tooloud';
import * as Phaser from 'phaser-ce';

import { TerrainType } from '../constants'

const width: number = 128;
const height: number = 128;

class TextureGenerator {
    private perlin: any;

    constructor(private game: Phaser.Game) {
        this.perlin = tooloud.Perlin.create(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    generateForTerrainTypes(terrainTypes: { [key: string]: TerrainType }, directions: string[]): void {
        let types = [];
        for (var terrainType in terrainTypes) {
            if (terrainTypes.hasOwnProperty(terrainType)) {
                var type = terrainTypes[terrainType];
                types.push(type);
                this._generateSolid(type);
            }
        }

        for (var i = 0; i < types.length; i++) {
            for (var j = 0; j < types.length; j++) {
                if (i == j)
                    continue;

                for (var k = 0; k < directions.length; k++) {
                    var direction = directions[k];
                    this._blend(types[i], types[j], direction);
                }
            }
        }
    }

    _generateSolid(terrain: TerrainType) {
        let bmd = this.game.add.bitmapData(width, height);
        let ctx = bmd.ctx;
        let color = terrain.color;
        ctx.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        ctx.fillRect(0, 0, width, height);
        this.game.cache.addBitmapData(`${terrain.shortcut}`, bmd);
        console.log('generated solid for ' + terrain.shortcut);
    }

    _blend(from: TerrainType, to: TerrainType, direction: string) {
        this.game.cache.addBitmapData(
            `${from.shortcut}${to.shortcut}${direction.toUpperCase()}`
            , this._generateBlend(from, to, direction));
        console.log('generated ' + `${from.shortcut}${to.shortcut}${direction.toUpperCase()}`);
    }

    _generateBlend(from: TerrainType, to: TerrainType, direction: string) {
        let bmd = this.game.add.bitmapData(width, height);
        let ctx = bmd.ctx;
        let imageData = new Uint8ClampedArray(4 * width * height);

        function ro(x1: number, y1: number, x2: number, y2: number): number {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        function m(x1: number, y1: number, x2: number, y2: number): number {
            return Math.abs(x2 - x1) + Math.abs(y2 - y1);
        }

        let roFromStart: (i: number, j: number) => number = (i, j) => 0;
        let roFromEnd: (i: number, j: number) => number = (i, j) => 0;

        switch (direction.toLowerCase()) {
            case 'ne':
                roFromStart = (i, j) => ro(0, height, j, i);
                roFromEnd = (i, j) => ro(width, 0, j, i);
                break;
            case 'new':
                roFromStart = (i, j) => m(-width / 2, height / 2, j, i);
                roFromEnd = (i, j) => m(width / 2, height / 2, j, i);
                break;
            case 'nw':
                roFromStart = (i, j) => ro(width, height, j, i);
                roFromEnd = (i, j) => ro(0, 0, j, i);
                break;
            case 'nwne':
                roFromStart = (i, j) => m(width / 2, height * 3 / 2, j, i);
                roFromEnd = (i, j) => m(0, 0, j, i);
                break;
            case 'sw':
                roFromStart = (i, j) => ro(width, 0, j, i);
                roFromEnd = (i, j) => ro(0, height, j, i);
                break;
            case 'se':
                roFromStart = (i, j) => ro(0, 0, j, i);
                roFromEnd = (i, j) => ro(width, height, j, i);
                break;
            case 'n':
                roFromStart = (i, j) => ro(width / 2, height, j, i);
                roFromEnd = (i, j) => ro(width / 2, 0, j, i);
                break;
            case 'nn':
                roFromStart = (i, j) => m(width / 2, height, j, i);
                roFromEnd = (i, j) => m(-width / 4, 0, j, i);
                break;
            case 'e':
                roFromStart = (i, j) => ro(0, height / 2, j, i);
                roFromEnd = (i, j) => ro(width, height / 2, j, i);
                break;
            case 'w':
                roFromStart = (i, j) => ro(width, height / 2, j, i);
                roFromEnd = (i, j) => ro(0, height / 2, j, i);
                break;
            case 's':
                roFromStart = (i, j) => ro(width / 2, 0, j, i);
                roFromEnd = (i, j) => ro(width / 2, height, j, i);
                break;
        }

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                let base = i * width + j;

                let color = null;

                let lengthFromStart = roFromStart(i, j);
                let lengthFromEnd = roFromEnd(i, j);

                let noiseValue = this.perlin.noise(i / 4, j / 4, 0) * 100;

                let offset = 93;

                if (lengthFromStart < lengthFromEnd + noiseValue + offset) {
                    color = from.color;
                } else {
                    color = to.color;
                }

                imageData[4 * base] = color.r;
                imageData[4 * base + 1] = color.g;
                imageData[4 * base + 2] = color.b;
                imageData[4 * base + 3] = 255;
            }
        }

        let image = new ImageData(imageData, width, height);

        ctx.putImageData(image, 0, 0);

        return bmd;
    }
}

export default TextureGenerator;