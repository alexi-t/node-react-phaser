import React, { Component } from 'react';
import Canvas from '../canvas/canvas.component';

class Noise extends Component {

    constructor() {
        super();
    }

    componentDidMount(){
        
    }

    componentDidUpdate() {
    }

    handleChange(e, prop) {
        let state = {
            seed: this.props.params.seed,
            octaveCount: this.props.params.octaveCount,
            frequency: this.props.params.frequency,
            amplitude: this.props.params.amplitude
        };
        state[prop] = e.target.value;
        this.props.updateParams(state);
    }

    render() {
        return (
            <div>
                <div>
                    <Canvas seed={this.props.params.seed} octaveCount={this.props.params.octaveCount} frequency={this.props.params.frequency} amplitude={this.props.params.amplitude} />
                </div>
                <div>
                    Octaves:<input type="text" value={this.props.params.octaveCount} onChange={(e) => this.handleChange(e, 'octaveCount')} /><br />
                    Frequency:<input type="text" value={this.props.params.frequency} onChange={(e) => this.handleChange(e, 'frequency')} /><br />
                    Amplitude:<input type="text" value={this.props.params.amplitude} onChange={(e) => this.handleChange(e, 'amplitude')} /><br />
                </div>
            </div>
        );
    }
}

export default Noise;