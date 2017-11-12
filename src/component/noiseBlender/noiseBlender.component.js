import React, { Component } from 'react';
import tooloud from 'tooloud';

class NoiseBlenderComponent extends Component {

    constructor(props) {
        super(props);
        console.log('canvas created');
        this.noiseFn = tooloud.Perlin.create(Math.random());
    }

    componentDidUpdate() {
        if (this.props.water != null
            && this.props.temp != null
            && this.props.moist != null)
            this.updateCanvas();
    }

    componentDidMount() {
        if (this.props.water != null
            && this.props.temp != null
            && this.props.moist != null)
            this.updateCanvas();
    }

    calculateNoise(x, y, params, noiseFn) {
        let noise = 0;

        let octaveCount = params.octaveCount;
        let frequency = params.frequency;
        let amplitude = params.amplitude;

        for (var i = 1; i <= octaveCount; i++) {
            let fx = x / (Math.pow(frequency, i));
            let fy = y / (Math.pow(frequency, i));
            noise += noiseFn.noise(fx, fy, 0) * amplitude / i;
        }

        return noise;
    }

    setupNoise() {
        if (!this.waterNoise) {
            this.waterNoise = tooloud.Perlin.create(this.props.water.seed);
        }
        if (!this.tempNoise) {
            this.tempNoise = tooloud.Perlin.create(this.props.temp.seed);
        }
        if (!this.moistNoise) {
            this.moistNoise = tooloud.Perlin.create(this.props.moist.seed);
        }
    }

    updateCanvas() {
        const width = 300;
        const height = 300;

        const ctx = this.refs.canvas.getContext('2d');

        const data = new Uint8ClampedArray(4 * width * height);

        let index = 0;

        let colors = {
            water: {
                r: 66,
                g: 173,
                b: 244
            },
            sand: {
                r: 244,
                g: 229,
                b: 66
            },
            grass: {
                r: 110,
                g: 183,
                b: 71
            },
            swamp: {
                r: 87,
                g: 168,
                b: 126
            },
            ice: {
                r: 155,
                g: 250,
                b: 255
            }
        };

        this.setupNoise();

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                let waterNoise = this.calculateNoise(i, j, this.props.water, this.waterNoise);
                let tempNoise = this.calculateNoise(i, j, this.props.temp, this.tempNoise);
                let moistNoise = this.calculateNoise(i, j, this.props.moist, this.moistNoise);

                let color = null;
                if (waterNoise < -0.5) {
                    if (waterNoise > -0.55) {
                        color = colors.sand;
                    }
                    else
                        color = colors.water;
                }
                else {
                    if (tempNoise > 0.5) {
                        if (moistNoise > 0.5) {
                            color = colors.swamp;
                        }
                        else {
                            color = colors.sand;
                        }
                    } else {
                        if (moistNoise > 0.5) {
                            color = colors.ice;
                        }
                        else {
                            color = colors.grass;
                        }
                    }
                }

                data[4 * index] = color.r;
                data[4 * index + 1] = color.g;
                data[4 * index + 2] = color.b;
                data[4 * index + 3] = 255;
                index++;
            }
        }

        const imageData = new ImageData(data, width, height);

        ctx.putImageData(imageData, 0, 0);
    }

    render() {
        return (
            <canvas ref="canvas" width="300" height="300" />
        );
    }
}

export default NoiseBlenderComponent;
