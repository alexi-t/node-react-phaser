import { NoiseGenerator, INoiseSettings } from '../../utils/noiseGenerator';
import { TerrainTypes, TerrainType } from '../../constants';

const noiseSettings: { [key: string]: INoiseSettings } = {
    water: {
        octaveCount: 5,
        frequency: 150,
        amplitude: 3
    },
    temp: {
        octaveCount: 2,
        frequency: 40,
        amplitude: 3
    },
    moist: {
        octaveCount: 4,
        frequency: 20,
        amplitude: 2
    }
};

class LandscapeProviderImpl {
    private waterSeed: number;
    private tempSeed: number;
    private moistSeed: number;

    constructor() {
        this.waterSeed = Math.random() * Number.MAX_SAFE_INTEGER;
        this.tempSeed = Math.random() * Number.MAX_SAFE_INTEGER;
        this.moistSeed = Math.random() * Number.MAX_SAFE_INTEGER;
    }

    private getTerrainAt(x: number, y: number): TerrainType {
        let waterNoise = NoiseGenerator.generateNoise(
            this.waterSeed, x, y,
            noiseSettings.water);
        let tempNoise = NoiseGenerator.generateNoise(
            this.tempSeed, x, y,
            noiseSettings.temp);
        let moistNoise = NoiseGenerator.generateNoise(
            this.moistSeed, x, y,
            noiseSettings.moist);

        if (waterNoise < -0.5) {
            if (waterNoise > -0.55) {
                return TerrainTypes.sand;
            }
            else
                return TerrainTypes.water;
        }
        else {
            if (tempNoise > 0.5) {
                if (moistNoise > 0.5) {
                    return TerrainTypes.swamp;
                }
                else {
                    return TerrainTypes.sand;
                }
            } else {
                if (moistNoise > 0.5) {
                    return TerrainTypes.ice;
                }
                else {
                    return TerrainTypes.grass;
                }
            }
        }
    }

    getTerrainChunk(x: number, y: number, width: number, height: number): TerrainType[][] {
        let matrix: TerrainType[][] = [];
        for (var i = y; i < y + height; i++) {
            let row: TerrainType[] = [];
            for (var j = x; j < x + width; j++) {
                row.push(this.getTerrainAt(j, i));
            }
            matrix.push(row);
        }

        return matrix;
    }
}

export let LandscapeProvider = new LandscapeProviderImpl();