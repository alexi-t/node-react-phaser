import { LandscapeProvider } from './landscapeProvider';
import { BlockSize } from '../../constants';
import * as Phaser from 'phaser-ce';

const CHUNK_SIZE: number = 32;

class LandscapeChunk {

    private _dirty: boolean;
    private sprites: any[];

    constructor(public x: number, public y: number) {
        this._dirty = true;

        this.sprites = [];
    }

    get topLeft() {
        return { x: this.x, y: this.y };
    }

    get bottomRight() {
        return { x: this.x + CHUNK_SIZE, y: this.y + CHUNK_SIZE };
    }

    get needRedraw() {
        return this._dirty;
    }

    draw(game: Phaser.Game) {
        var terrain = LandscapeProvider.getTerrainChunk(this.x, this.y, CHUNK_SIZE, CHUNK_SIZE);
        for (var i = 0; i < CHUNK_SIZE; i++) {
            for (var j = 0; j < CHUNK_SIZE; j++) {
                let texture = terrain[i][j].shortcut;
                this.sprites.push(game.add.sprite((j + this.x) * BlockSize, (i + this.y) * BlockSize, game.cache.getBitmapData(texture)));
            }
        }
        this._dirty = false;
    }
}

export default LandscapeChunk;