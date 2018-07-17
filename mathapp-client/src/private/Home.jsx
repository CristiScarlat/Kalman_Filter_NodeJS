import React, { Component } from 'react';
import { withRouter } from 'react-router';
import './Home.css';
import {Line} from 'react-chartjs-2';

const LINIAR = "lin";
const EXPONENTIAL = "expo";
const SINUSOIDAL = "sin";
const RAW = "raw";
const NOISY = "noisy";
const FILTERED = "filtered";

class Home extends Component {
    constructor(props){
        super(props)
        this.state = {
            rawSignalExp: {},
            noisySignalExp: {},
            filteredSignalExp: {},
            dataToPlot: {
                labels: [],
                datasets: [
                            {
                            label: 'raw signal',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(75,192,192,1)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(75,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: []
                            },
                            {
                            label: 'noise',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(255,192,192,1)',
                            borderColor: 'rgba(255,192,192,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(255,192,192,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: []
                            },
                            {
                            label: 'Kalman',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: 'rgba(255,0,0,1)',
                            borderColor: 'rgba(255,0,0,1)',
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: 'rgba(255,0,0,1)',
                            pointBackgroundColor: '#fff',
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                            pointHoverBorderColor: 'rgba(220,220,220,1)',
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: []
                            }]
                         },

                data: {},
                auto: false,
               functionType: LINIAR,
                kalmanParams: {R: 0.01, Q: 10, A: 1, B: 1},
                raw: true,
                noisy: false,
                filtered: false
          
        }
}

componentDidMount() { 
    this.getRawNoisyFilteredData();
};


getRawNoisyFilteredData = () => {
    fetch('/kalman')           
    .then(res=> {
		return res.json();
	})
	.then(data => {
        this.setState({data})
        this.plotData();
	})       
    .catch(err => {
		console.log("error fetching ==>", err)
	})
}

plotData = () => {
    console.log(this.state.functionType, this.state.data)
    let temp = this.state.dataToPlot;
    switch(this.state.functionType) {
        case LINIAR:
        temp.datasets[0].data = this.state.raw ? this.state.data.rawLin : [];
        temp.datasets[1].data = this.state.noisy ? this.state.data.noisyLin : [];
        temp.datasets[2].data = this.state.filtered ? this.state.data.filteredLin : [];
        temp.labels = [];
        break;
        case EXPONENTIAL:
        temp.datasets[0].data = this.state.raw ? this.state.data.rawExp : [];
        temp.datasets[1].data = this.state.noisy ? this.state.data.noisyExp : [];
        temp.datasets[2].data = this.state.filtered ? this.state.data.filteredExp : [];
        temp.labels = [];
        break;
        case SINUSOIDAL:
        temp.datasets[0].data = this.state.raw ? this.state.data.rawSin : [];
        temp.datasets[1].data = this.state.noisy ? this.state.data.noisySin : [];
        temp.datasets[2].data = this.state.filtered ? this.state.data.filteredSin : [];
        temp.labels = [];
        break;
    }
    
    for(let i=0;i<100;i++){
        temp.labels.push(i);
    }
    this.setState({
        dataToPlot: temp
    })
}

handleAutoRefresh = () => {
    this.setState({auto: !this.state.auto}, () => {
        if(this.state.auto){
            this.getRawNoisyFilteredData();
            this.refresh = setInterval(() => {
                this.getRawNoisyFilteredData();
            }, 1000)
        } else {
            clearInterval(this.refresh);
        }
    })  
}

handleFilterParameters = (e) => {
	console.log(e.target.id);
	let parameterName = e.target.id;
	let parameterValue = e.target.value;
	let temp = this.state.kalmanParams;
	temp[parameterName] = Number(parameterValue)
	console.log(temp);
	this.setState({
		kalmanParams: temp
	})
}

handleSubmitParams = () => {
	fetch('/kalman', {
    method: 'post',
    body: JSON.stringify(this.state.kalmanParams),
	headers: {
    "Content-Type": "application/json"
  }
  })
  .then(response => {
    console.log(response);
    this.getRawNoisyFilteredData();
  })
}

handleFunctionSelector = (e) => {
    this.setState({
        functionType: e.target.id
    })
    this.getRawNoisyFilteredData();
}

handleFunctionDisplay = (e) => {
    switch(e.target.id){
        case RAW:
        this.setState({raw: !this.state.raw})
        break;
        case NOISY: 
        this.setState({noisy: !this.state.noisy})
        break;
        case FILTERED: 
        this.setState({filtered: !this.state.filtered})
        break;
    }
    this.getRawNoisyFilteredData();
}


render() {
        return(
            <div className="app-wrapper">               
            <div className="header">
                   Kalman filter at work !!
            </div>           
             <div className="body-wrapper">  
				<div className="ploter">
					<Line data={this.state.dataToPlot} height={200}/>
                
				</div>               
				<div className="controls">
                <div className="devider"/>
                <div className="parameters">Filter parameters</div>
                <div className="subdevider"/>
					<div className="slidecontainer">
						<label htmlFor="R">R(InterSystem Noise) = {this.state.kalmanParams.R}</label>
						<input type="range" min="0" max="1" step="0.01" value={this.state.kalmanParams.R} className="slider" id="R" onChange={this.handleFilterParameters}/>
						<label htmlFor="Q">Q(Measured Noise) = {this.state.kalmanParams.Q}</label>
						<input type="range" min="0" max="100" step="0.1" value={this.state.kalmanParams.Q} className="slider" id="Q" onChange={this.handleFilterParameters}/>
						<label htmlFor="A">A(State Vector) = {this.state.kalmanParams.A}</label>
						<input type="range" min="0" max="1" step="0.01" value={this.state.kalmanParams.A} className="slider" id="A" onChange={this.handleFilterParameters}/>
						{/* <label htmlFor="B">B = {this.state.kalmanParams.B}</label>
						<input type="range" min="0" max="100" step="0.01" value={this.state.kalmanParams.B} className="slider" id="B" onChange={this.handleFilterParameters}/> */}
					</div>
                    <div>
					<button className="button" onClick={this.handleSubmitParams}>Submit Parameters</button>
                    </div>
                    <div className="devider"/>
                    <div className="parameters">Function generator</div>
                    <div className="subdevider"/>
                    <div className="function-selector">
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionSelector(e)}} id='lin'>Liniar</button>
                        </div>
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionSelector(e)}} id='expo'>Exponential</button>
                        </div>
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionSelector(e)}} id='sin'>Sinus</button>
                        </div>
                    </div>
                    <div className="devider"/>
                    <div className="parameters">Select to display</div>
                    <div className="subdevider"/>
                    <div className="function-selector">
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionDisplay(e)}} id='raw'>Raw</button>
                        </div>
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionDisplay(e)}} id='noisy'>Noisy</button>
                        </div>
                        <div>
                            <button className="button" onClick={(e) => {this.handleFunctionDisplay(e)}} id='filtered'>Filtered</button>
                        </div>
                        <div>
                        <button className="button" onClick={this.handleAutoRefresh} id='refresh'>{!this.state.auto ? 'Play auto refresh' : 'Stop auto refresh'}</button>
                    </div>
                    </div>
                    <div className="devider"/>
				</div>                
            </div>  
            </div>
        )
    }
}

export default withRouter(Home);