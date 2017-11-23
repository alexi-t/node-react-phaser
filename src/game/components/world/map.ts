import * as Phaser from 'phaser-ce';
import { LandscapeProvider } from './landscapeProvider';
import { GameService } from '../GameService';
import { TextureSize } from '../../constants';

let MAP_SIZE: number = 150;

export class Map implements GameService {

    private texture: Phaser.BitmapData;
    private mapStrite: Phaser.Sprite;

    private lastUpdateX: number | null = null;
    private lastUpdateY: number | null = null;

    private createTexture(game: Phaser.Game) {
        this.texture = game.add.bitmapData(150, 150, 'map', true);
    }

    preload(): void {

    }

    init(game: Phaser.Game): void {
        this.createTexture(game);
        this.update(game);
        this.mapStrite = game.add.sprite(0, 0, this.texture);
        this.mapStrite.z = 100000;
    }

    update(game: Phaser.Game): void {
        let x = Math.floor(game.camera.view.topLeft.x / TextureSize);
        let y = Math.floor(game.camera.view.topLeft.y / TextureSize);

        if (this.mapStrite != null) {
            this.mapStrite.x = game.camera.view.topLeft.x;
            this.mapStrite.y = game.camera.view.topLeft.y;
        }

        if (this.lastUpdateX == x && this.lastUpdateY == y) {
            return;
        }

        let width = Math.floor(game.camera.view.width / TextureSize);
        let height = Math.floor(game.camera.view.height / TextureSize);

        if (this.lastUpdateX == null && this.lastUpdateY == null) {
            let terrain = LandscapeProvider.getTerrainChunk(x - MAP_SIZE / 2, y - MAP_SIZE / 2, MAP_SIZE, MAP_SIZE);

            const data = new Uint8ClampedArray(4 * MAP_SIZE * MAP_SIZE);
            for (var i = 0; i < MAP_SIZE; i++) {
                for (var j = 0; j < MAP_SIZE; j++) {
                    let index = MAP_SIZE * i + j;
                    data[4 * index] = terrain[i][j].color.r;
                    data[4 * index + 1] = terrain[i][j].color.g;
                    data[4 * index + 2] = terrain[i][j].color.b;
                    data[4 * index + 3] = 255;
                }
            }
            this.texture.ctx.putImageData(new ImageData(data, MAP_SIZE, MAP_SIZE), 0, 0);
        } else {
            let imageData = this.texture.ctx.getImageData(0, 0, MAP_SIZE, MAP_SIZE);
            let oldData = imageData.data;
            let newXData = new Uint8ClampedArray(4 * MAP_SIZE * MAP_SIZE);

            let xOffset = x - (this.lastUpdateX || 0);
            let terrainXOffset = xOffset < 0 ?
                LandscapeProvider.getTerrainChunk(x - MAP_SIZE / 2, y - MAP_SIZE / 2, Math.abs(xOffset), MAP_SIZE) :
                LandscapeProvider.getTerrainChunk(x + MAP_SIZE / 2 - xOffset, y - MAP_SIZE / 2, xOffset, MAP_SIZE);
            for (var i = 0; i < MAP_SIZE; i++) {
                for (var j = 0; j < MAP_SIZE; j++) {
                    let index = MAP_SIZE * i + j;
                    if (xOffset > 0 && j >= MAP_SIZE - xOffset) {
                        let offsetJ = j - MAP_SIZE + xOffset;
                        newXData[4 * index] = terrainXOffset[i][offsetJ].color.r;
                        newXData[4 * index + 1] = terrainXOffset[i][offsetJ].color.g;
                        newXData[4 * index + 2] = terrainXOffset[i][offsetJ].color.b;
                    }
                    else if (xOffset < 0 && j < Math.abs(xOffset)) {
                        newXData[4 * index] = terrainXOffset[i][j].color.r;
                        newXData[4 * index + 1] = terrainXOffset[i][j].color.g;
                        newXData[4 * index + 2] = terrainXOffset[i][j].color.b;
                    } else {
                        let offsetIndex = index + xOffset;
                        newXData[4 * index] = oldData[4 * offsetIndex];
                        newXData[4 * index + 1] = oldData[4 * offsetIndex + 1];
                        newXData[4 * index + 2] = oldData[4 * offsetIndex + 2];
                    }
                    newXData[4 * index + 3] = 255;
                }
            }
            let yOffset = y - (this.lastUpdateY || 0);
            let terrainYOffset = yOffset < 0 ?
                LandscapeProvider.getTerrainChunk(x - MAP_SIZE / 2 + xOffset, y + MAP_SIZE / 2 + yOffset, MAP_SIZE, Math.abs(yOffset)) :
                LandscapeProvider.getTerrainChunk(x + MAP_SIZE / 2 + xOffset, y - MAP_SIZE / 2 + yOffset, MAP_SIZE, yOffset);

            let newYData = new Uint8ClampedArray(4 * MAP_SIZE * MAP_SIZE);
            for (var i = 0; i < MAP_SIZE; i++) {
                for (var j = 0; j < MAP_SIZE; j++) {
                    let index = MAP_SIZE * i + j;
                    if (yOffset < 0 && i >= MAP_SIZE + yOffset) {
                        let offsetI = i - MAP_SIZE - yOffset;
                        newYData[4 * index] = terrainYOffset[offsetI][j].color.r;
                        newYData[4 * index + 1] = terrainYOffset[offsetI][j].color.g;
                        newYData[4 * index + 2] = terrainYOffset[offsetI][j].color.b;
                    }
                    else if (yOffset > 0 && i < yOffset) {
                        newYData[4 * index] = terrainYOffset[i][j].color.r;
                        newYData[4 * index + 1] = terrainYOffset[i][j].color.g;
                        newYData[4 * index + 2] = terrainYOffset[i][j].color.b;
                    } else {
                        let offsetIndex = MAP_SIZE * (i - yOffset) + j;
                        newYData[4 * index] = newXData[4 * offsetIndex];
                        newYData[4 * index + 1] = newXData[4 * offsetIndex + 1];
                        newYData[4 * index + 2] = newXData[4 * offsetIndex + 2];
                    }
                    newYData[4 * index + 3] = 255;
                }
            }

            this.texture.ctx.putImageData(new ImageData(newYData, MAP_SIZE, MAP_SIZE), 0, 0);
        }

        this.texture.ctx.strokeStyle = "#f00";
        this.texture.ctx.strokeRect(MAP_SIZE / 2 - width / 2, MAP_SIZE / 2 - height / 2, width, height);
        this.texture.dirty = true;

        this.lastUpdateX = x;
        this.lastUpdateY = y;

    }
}