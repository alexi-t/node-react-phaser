import * as Phaser from 'phaser-ce';
import { LandscapeChunk, ChunkSize, TextureDirections } from './landscapeChunk';

export class LandscapeManager {
    private chunks: LandscapeChunk[] = [];

    renderVisible(camera: Phaser.Camera): void {
        let cellX = Math.floor(camera.view.centerX / ChunkSize);
        let cellY = Math.floor(camera.view.centerY / ChunkSize);

        let addedChunks: LandscapeChunk[] = [];

        let c: (x: number, y: number) => LandscapeChunk = (x, y) => {
            let chunk = this.getChunkAtGridCell(x, y);
            if (chunk == null) {
                chunk = new LandscapeChunk(x, y);
                addedChunks.push(chunk);
            }
            return chunk;
        };

        let chunkMatrix = {
            nw: c(cellX - 1, cellY - 1), n: c(cellX, cellY - 1), ne: c(cellX + 1, cellY + 1),
            w: c(cellX - 1, cellY), c: c(cellX, cellY), e: c(cellX + 1, cellY),
            sw: c(cellX - 1, cellY + 1), s: c(cellX, cellY + 1), se: c(cellX + 1, cellY + 1)
        };

        for (var i = 0; i < addedChunks.length; i++) {
            this.chunks.push(addedChunks[i]);
            addedChunks[i].draw(camera.game);
        }
    }

    private getChunkAtGridCell(x: number, y: number): LandscapeChunk | null {
        return this.chunks.filter(c => c.cellPos.x == x && c.cellPos.y == y).pop() || null;
    }
}