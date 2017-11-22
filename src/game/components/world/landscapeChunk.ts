import { LandscapeProvider } from './landscapeProvider';
import { TextureSize, TerrainTypes, TerrainType, Colors } from '../../constants';
import * as Phaser from 'phaser-ce';

const CHUNK_SIZE: number = 8;

enum Corners {
    Empty = 0,
    N = 1 << 0,
    NE = 1 << 1,
    E = 1 << 2,
    SE = 1 << 3,
    S = 1 << 4,
    SW = 1 << 5,
    W = 1 << 6,
    NW = 1 << 7
}

const CornerCombinations: { [key: string]: Corners } = {
    ne: Corners.N | Corners.NE | Corners.E,
    se: Corners.E | Corners.SE | Corners.S,
    sw: Corners.S | Corners.SW | Corners.W,
    nw: Corners.W | Corners.NW | Corners.N,
    nwne: Corners.W | Corners.NW | Corners.N | Corners.NE,
    new: Corners.N | Corners.NE | Corners.E | Corners.SE | Corners.S | Corners.SW,
    nn: Corners.NW | Corners.N
};

export const TextureDirections: string[] = Object.keys(CornerCombinations);

export const ChunkSize = TextureSize * CHUNK_SIZE;

export class LandscapeChunk {

    private _dirty: boolean;
    private sprites: any[];

    constructor(public x: number, public y: number) {
        this._dirty = true;

        this.x = x * ChunkSize;
        this.y = y * ChunkSize;

        this.sprites = [];
    }

    get cellPos() {
        return { x: this.x / ChunkSize, y: this.y / ChunkSize };
    }

    get texturePos() {
        return { x: this.x / TextureSize, y: this.y / TextureSize };
    }

    get needRedraw() {
        return this._dirty;
    }

    getTexture(i: number, j: number, terrain: TerrainType[][]): string {
        let rootTexture = terrain[i][j].shortcut

        if (i == 0 || j == 0 || i + 1 == CHUNK_SIZE || j + 1 == CHUNK_SIZE)
            return rootTexture;

        let mapFn: (t: TerrainType) => string = t => t.shortcut;

        let map: { [key: string]: string } = {
            NW: mapFn(terrain[i - 1][j - 1]), N: mapFn(terrain[i - 1][j]), NE: mapFn(terrain[i - 1][j + 1]),
            W: mapFn(terrain[i][j - 1]), E: mapFn(terrain[i][j + 1]),
            SW: mapFn(terrain[i + 1][j - 1]), S: mapFn(terrain[i + 1][j]), SE: mapFn(terrain[i + 1][j + 1])
        };

        let corners: { [key: string]: number }

        let computeCornerCombination: (terrainTypeShortcut: string) => Corners = color => {
            let result: Corners = Corners.Empty;

            for (var mapCorner in map) {
                if (map.hasOwnProperty(mapCorner)) {
                    let cornerColor = map[mapCorner];
                    if (cornerColor == color) {
                        result |= Corners[mapCorner];
                    }
                }
            }

            return result;
        };

        for (var terrainType in TerrainTypes) {
            if (TerrainTypes.hasOwnProperty(terrainType)) {
                let terrain = TerrainTypes[terrainType];
                let terrainCombination = computeCornerCombination(terrain.shortcut);

                for (var combination in CornerCombinations) {
                    if (CornerCombinations.hasOwnProperty(combination)) {
                        if (terrainCombination == CornerCombinations[combination]) {
                            return `${rootTexture}${terrain.shortcut}${combination.toUpperCase()}`;
                        }
                    }
                }
            }
        }

        return rootTexture;
    }

    draw(game: Phaser.Game) {
        if (!this._dirty)
            return;

        var terrain = LandscapeProvider.getTerrainChunk(this.texturePos.x - 1, this.texturePos.y - 1, CHUNK_SIZE + 2, CHUNK_SIZE + 2);
        for (var i = 0; i < CHUNK_SIZE; i++) {
            for (var j = 0; j < CHUNK_SIZE; j++) {
                let texture = this.getTexture(i + 1, j + 1, terrain);
                this.sprites.push(game.add.sprite(this.x + j * TextureSize, this.y + i * TextureSize, game.cache.getBitmapData(texture)));
            }
        }
        this._dirty = false;
    }
}