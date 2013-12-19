// this example shows a possible approach to parsing "county based" data from health.data.ny.gov
//   a) makes a SODA request then parses out counties (data also can contain regions) 
//   b) makes multiple SODA requests then combines the data

var http = require('http');

var JSONArray=[];
var processedArray=[];

// declare a couple of options structures representing SODA requests
var options = {
  host: 'health.data.ny.gov',
 // Diabetes death rate 100000
    path: '/resource/u98s-c3hg.json'
};

var options2 = {
  host: 'health.data.ny.gov',
   // 5 fruits and vegtables 
   path: '/resource/4gfk-hyzi.json'
};

var optionsArray=[options, options2];

// utility to sort an array by an integer key
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = parseInt( a[key] ); var y = parseInt(b[key]);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });}


// callback to build data
callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
    console.log('chunk received...');
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    var jsonstr = JSON.parse(str);

    console.log(JSON.stringify(jsonstr,null,2));

	processCountyData(jsonstr);
   
  });
}

// callback that stores the JSON response waiting for multiple http requests to finish
storeJSON = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
    console.log('chunk received...');
  });

  //the whole response has been recieved
  response.on('end', function () {
	var jsonstr=JSON.parse(str);
    
	// add to the JSONArray
    JSONArray.push(jsonstr);
	// add to the processedArray
	processedArray.push(processCountyData(jsonstr));

    // check to see if all are done (Compare length with final expected length Todo: Is this thread safe??)
    if (JSONArray.length == optionsArray.length)
	{		
		for (var j=0;j<processedArray[0].length;j++)
		{
			for (var i=0;i<processedArray.length;i++)
			{
				console.log(processedArray[i][j]);
			}

			console.log('');
		}		
	}
  });
}

// process JSON 
function processCountyData(jsonstr)
{
	sortByKey(jsonstr, "county_code");

	var simple=[];

	for(var i = 0; i < jsonstr.length; i++) 
	{
		if( parseInt(jsonstr[i].county_code) <= 63) // delete index
		{
			simple.push({county_code: jsonstr[i].county_code, 
				percentage_rate: jsonstr[i].percentage_rate});
  		}
	}
    
    return simple;
}

//http.request(options, callback).end();

// loop sending an http request for each of the options
for (i=0;i<optionsArray.length;i++)
{
	http.request(optionsArray[i], storeJSON).end();
}

