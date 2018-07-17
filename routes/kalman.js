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
	let Err = kalmanParams.Q;
	let R = kalmanParams.R;
	let Q = kalmanParams.Q;
	let A = kalmanParams.A;
	let y = NaN;
	let filtered = data.map(x => {
	if (isNaN(y)) {
		y = x;
		Err = Q;
	  } else {
		//compute pred or estimating
		let predX = A * y;
		let predErr = ((A * Err) * A) + R;

		//compute Kalman gain
		let K = predErr / (predErr  + Q);

		// Correction
		Err = predErr - (K * predErr);
		y = predX + K * (x -  predX);	

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