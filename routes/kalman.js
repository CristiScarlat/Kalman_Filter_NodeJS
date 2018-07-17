var express = require('express');
var router = express.Router();
var fs = require('fs');



let kalmanParams = {R: 0.01, Q: 10, A: 0.9};
/*
R = Process noise
Q = Measurement noise
A = State vector


/* GET data. */
router.get('/', (req, res, next) => { 
		let rawSignalExp = [];
		let rawSignalLin = [];
		let rawSignalSin = [];

		//exponential function generator
		for(i=0;i<100;i++){
			rawSignalExp.push(Math.pow(0.8, i));
		}
		//sinusoidal function generator
		for(i=0;i<100;i++){
			rawSignalSin.push(Math.sin(2 * Math.PI * i/100 * 5));
		}
		//liniar function generator
		for(i=0;i<100;i++){
			rawSignalLin.push(i/100);
		}
		//Add noise to exonential function
		let noisySignalExp = rawSignalExp.map(function(v) {
			return v + Math.random();
		});
		//Add noise to liniar function
		let noisySignalLin = rawSignalLin.map(function(v) {
			return v + Math.random();
		});
		//Add noise to sin function
		let noisySignalSin = rawSignalSin.map(function(v) {
			return v + Math.random();
		});
		
		
		let filteredSignalExp = kalman(noisySignalExp, kalmanParams);
		
		let filteredSignalLin = kalman(noisySignalLin, kalmanParams);
		
		let filteredSignalSin = kalman(noisySignalSin, kalmanParams);

  res.send(JSON.stringify({
	  rawLin: rawSignalLin,
	  noisyLin: noisySignalLin,
	  filteredLin: filteredSignalLin,
	  rawExp: rawSignalExp,
	  noisyExp: noisySignalExp,
	  filteredExp: filteredSignalExp,
	  rawSin: rawSignalSin,
	  noisySin: noisySignalSin,
	  filteredSin: filteredSignalSin
	}));
});

kalman = (data, kalmanParams) => {		
	let R = kalmanParams.R;//expected noise
	let Q = kalmanParams.Q;//measured noise
	let A = kalmanParams.A;//state vector
	let y = NaN;
	let Err = NaN;
	let filtered = data.map(x => {
	if (isNaN(y)) {
		y = x;
		Err = Q;
	  } else {
		//Calculate previous state and previous error in estimate
		let prevX = A * y;
		let prevErr = ((A * Err) * A) + R;

		//calculate Kalman Gain
		let K = prevErr / (prevErr  + Q);

		//Calculate new error in estimate
		Err = prevErr - (K * prevErr);
		//Calculate current estimate
		y = prevX + K * (x -  prevX);	

		//return filtered data	
		return y;
	}});	
	return filtered;
}


/* POST parameters. */
router.post('/', (req, res, next) => { 
	console.log(req.body)
	kalmanParams = req.body;	
  res.sendStatus(200)
});



module.exports = router;