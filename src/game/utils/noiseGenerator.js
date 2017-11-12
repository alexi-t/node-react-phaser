import tooloud from 'tooloud';

class NoiseGeneratorImpl {

    constructor() {
        this.noises = {};
    }

    ensureNoise(seed) {
        if (!this.noises.hasOwnProperty(seed)) {
            this.noises[seed] = tooloud.Perlin.create(seed);
        }
        return this.noises[seed];
    }

    generateNoise(seed, x, y, settings) {
        let noise = 0;

        let noiseFn = this.ensureNoise(seed);

        let octaveCount = settings.octaveCount;
        let frequency = settings.frequency;
        let amplitude = settings.amplitude;

        for (var i = 1; i <= octaveCount; i++) {
            let fx = x / (Math.pow(frequency, i));
            let fy = y / (Math.pow(frequency, i));
            noise += noiseFn.noise(fx, fy, 0) * amplitude / i;
        }

        return noise;
    }
}

export let NoiseGenerator = new NoiseGeneratorImpl();