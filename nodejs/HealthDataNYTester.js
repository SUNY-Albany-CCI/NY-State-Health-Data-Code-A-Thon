var http = require('http');

var healthDataNYProcessor = require('./HealthDataNYProcessor');

// declare some of options structures representing SODA requests
var options = {
  host: 'health.data.ny.gov',
 // Diabetes death rate 100000
    path: '/resource/u98s-c3hg.json'
};

var adultsOverweight ={
  host: 'health.data.ny.gov',
  path: '/resource/xnc3-23vm.json'
};

var dontExercise ={
  host: 'health.data.ny.gov',
  path: '/resource/vy66-whxp.json'
};

callback = healthDataNYProcessor.makeCallback(healthDataNYProcessor.processCountyData, healthDataNYProcessor.dataToConsole);

console.log('testconsolelog');
http.request(options, callback).end();

callback = healthDataNYProcessor.makeCallback(healthDataNYProcessor.processCountyData, null);

console.log('test with null output');
http.request(options, callback).end();

callback = healthDataNYProcessor.makeCallback(null, healthDataNYProcessor.dataToConsole);

console.log('test Adults Overweight');
http.request(adultsOverweight, callback).end();

console.log('test multiple requests');
// loop sending an http request for each of the options
var optionsArray=[options, adultsOverweight, dontExercise];

for (i=0;i<optionsArray.length;i++)
{
	console.log("creating callback");
	callback = healthDataNYProcessor.makeArrayCallback(healthDataNYProcessor.processCountyData, null, optionsArray.length, healthDataNYProcessor.processArrayData);
	http.request(optionsArray[i], callback).end();
}
