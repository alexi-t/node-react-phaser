import * as Phaser from 'phaser-ce';

export interface GameService {
    preload(): void;
    init(game: Phaser.Game): void;
    update(game: Phaser.Game): void;
}