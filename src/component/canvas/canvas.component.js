import React, { Component } from 'react';
import tooloud from 'tooloud';

class CanvasComponent extends Component {

    constructor(props) {
        super(props);
        console.log('canvas created');
    }

    componentDidUpdate() {
        this.updateCanvas();
    }

    componentDidMount() {
        this.noiseFn = tooloud.Perlin.create(this.props.seed);   
        this.updateCanvas();
    }

    calculateNoise(x, y, octaveCount, frequency, amplitude) {
        let noise = 0;

        for (var i = 1; i <= octaveCount; i++) {
            let fx = x / (Math.pow(frequency, i));
            let fy = y / (Math.pow(frequency, i));
            noise += this.noiseFn.noise(fx, fy, 0) * amplitude / i;
        }

        return noise;
    }

    updateCanvas() {
        const width = 300;
        const height = 300;

        const ctx = this.refs.canvas.getContext('2d');

        const data = new Uint8ClampedArray(4 * width * height);

        let index = 0;

        for (var i = 0; i < width; i++) {
            for (var j = 0; j < height; j++) {
                let noise = this.calculateNoise(i, j, this.props.octaveCount, this.props.frequency, this.props.amplitude);
                data[4 * index] = 0;
                data[4 * index + 1] = 0;
                data[4 * index + 2] = 0;
                data[4 * index + 3] = (0.5 + noise * 0.5) * 255;
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

export default CanvasComponent;
