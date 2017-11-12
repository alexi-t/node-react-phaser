import React, { Component } from 'react';
import logo from './logo.svg';
import Canvas from './component/canvas/canvas.component';
import Noise from './component/noise/noise.component';
import NoiseBlender from './component/noiseBlender/noiseBlender.component';
import Game from './component/game/game.component'
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      noiseParams: {
        water: {
          octaveCount: 5,
          frequency: 150,
          amplitude: 3,
          seed:Math.random()*Number.MAX_SAFE_INTEGER
        },
        temp: {
          octaveCount: 2,
          frequency: 40,
          amplitude: 3,
          seed:Math.random()*Number.MAX_SAFE_INTEGER
        },
        moist: {
          octaveCount: 4,
          frequency: 20,
          amplitude: 2,
          seed:Math.random()*Number.MAX_SAFE_INTEGER
        }
      }
    };
  }

  handleChange(params, prop) {
    let state = this.state;
    state.noiseParams[prop] = params;
    this.setState(state);
    console.log('state updated ' + JSON.stringify(state));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        </header>
        <Game/>
        <div className="noise-list">
          <Noise params={this.state.noiseParams.water} updateParams={(params) => this.handleChange(params, "water")} />
          <Noise params={this.state.noiseParams.temp} updateParams={(params) => this.handleChange(params, "temp")} />
          <Noise params={this.state.noiseParams.moist} updateParams={(params) => this.handleChange(params, "moist")} />
        </div>
        <div>
          <NoiseBlender water={this.state.noiseParams.water} temp={this.state.noiseParams.temp} moist={this.state.noiseParams.moist} />
        </div>
      </div>
    );
  }
}

export default App;