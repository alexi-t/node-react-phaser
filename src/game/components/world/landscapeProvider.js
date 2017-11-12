import { NoiseGenerator } from '../../utils/noiseGenerator';
import { TerrainType } from '../../constants';

const noiseSettings = {
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

    constructor() {
        this.waterSeed = Math.random() * Number.MAX_SAFE_INTEGER;
        this.tempSeed = Math.random() * Number.MAX_SAFE_INTEGER;
        this.moistSeed = Math.random() * Number.MAX_SAFE_INTEGER;
    }

    getTerrainChunk(x, y, width, height) {
        let getTerrainAt =  (x, y) => {
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
                    return TerrainType.sand;
                }
                else
                    return TerrainType.water;
            }
            else {
                if (tempNoise > 0.5) {
                    if (moistNoise > 0.5) {
                        return TerrainType.swamp;
                    }
                    else {
                        return TerrainType.sand;
                    }
                } else {
                    if (moistNoise > 0.5) {
                        return TerrainType.ice;
                    }
                    else {
                        return TerrainType.grass;
                    }
                }
            }
        };

        let matrix = [];
        for (var i = y; i < y + height; i++) {
            let row = [];
            for (var j = x; j < x + width; j++) {
                row.push(getTerrainAt(j, i));
            }
            matrix.push(row);
        }

        return matrix;
    }
}

export let LandscapeProvider = new LandscapeProviderImpl();