import tooloud from 'tooloud';
import * as Phaser from 'phaser-ce';

const width = 128;
const height = 128;

class TextureGenerator {

    constructor(game) {
        this.game = game;
        this.perlin = tooloud.Perlin.create(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    generateForTerrainTypes(terrainTypes, directions) {
        let types = [];
        for (var terrainType in terrainTypes) {
            if (terrainTypes.hasOwnProperty(terrainType)) {
                var type = terrainTypes[terrainType];
                types.push(type);
                this._generateSolid(type);
            }
        }
        return;
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

    _generateSolid(terrain) {
        let bmd = this.game.add.bitmapData(width, height);
        let ctx = bmd.ctx;
        let color = terrain.color;
        ctx.fillStyle = `rgb(${color.r},${color.g}, ${color.b})`;
        ctx.fillRect(0, 0, width, height);
        this.game.cache.addBitmapData(`${terrain.shortcut}`, bmd);
        console.log('generated solid for ' + terrain.shortcut);
    }

    _blend(from, to, direction) {
        if (direction.length === 2) {
            this.game.cache.addBitmapData(
                `${from.shortcut}${to.shortcut}${direction.toUpperCase()}${from.shortcut}`
                , this._generateBlend(from, to, direction, from));
            this.game.cache.addBitmapData(
                `${from.shortcut}${to.shortcut}${direction.toUpperCase()}${to.shortcut}`
                , this._generateBlend(from, to, direction, to));
            console.log('generated ' + `${from.shortcut}${to.shortcut}${direction.toUpperCase()}${from.shortcut}`);
            console.log('generated ' + `${from.shortcut}${to.shortcut}${direction.toUpperCase()}${to.shortcut}`);
        }
        if (direction.length === 1) {
            this.game.cache.addBitmapData(
                `${from.shortcut}${to.shortcut}${direction.toUpperCase()}`
                , this._generateBlend(from, to, direction));
            console.log('generated ' + `${from.shortcut}${to.shortcut}${direction.toUpperCase()}`);
        }
    }

    _generateBlend(from, to, direction, mainTexture) {
        let bmd = this.game.add.bitmapData(width, height);
        let ctx = bmd.ctx;
        let imageData = new Uint8ClampedArray(4 * width * height);

        function ro(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

        let roFromStart = null;
        let roFromEnd = null;

        switch (direction.toLowerCase()) {
            case 'ne':
                roFromStart = (i, j) => ro(0, height, j, i);
                roFromEnd = (i, j) => ro(width, 0, j, i);
                break;
            case 'nw':
                roFromStart = (i, j) => ro(width, height, j, i);
                roFromEnd = (i, j) => ro(0, 0, j, i);
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

                let offset = mainTexture == to ? -96 : 63;

                if (mainTexture == null)
                    offset = 0;

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