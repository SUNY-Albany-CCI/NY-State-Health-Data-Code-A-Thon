// HealthDataNYProcessor.js
//
// Utilities and callbacks to parse and process data from health.data.ny.gov using SODA API. 
// creates a callback that build the data and then calls a postProcessor 

var JSONArray=[];

module.exports = {

makeCallback: function(postProcess, dataOut)
{
	console.log('make callback');
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

		if (postProcess!=null)
		{
			jsonstr=postProcess(jsonstr);
		}
 	  	// console.log(JSON.stringify(jsonstr,null,2));
		if (dataOut!=null) {
 	    	dataOut(jsonstr);
		}

 	 	});
	}
	return callback;
},

makeArrayCallback: function(postProcess, dataOut, n)
{
	console.log('make callback');
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

			if (postProcess!=null)
			{
				jsonstr=postProcess(jsonstr);
			}

			JSONArray.push(jsonstr);
				console.log(jsonstr.length);
				console.log(JSONArray.length);
				console.log(n);

			if (JSONArray.length == n)
			{
				for (var j=0;j<JSONArray[0].length;j++)
				{
					for (var i=0;i<JSONArray.length;i++)
					{
						console.log('test '+j+" "+i);
						console.log(JSONArray[i][j].percentage_rate);
					}
					console.log('');
				}
	
			}
		});

		
	}

	return callback;
},

// process data by county
processCountyData: function(jsonstr)
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
    
},

dataToConsole: function(data)
{
	console.log(data);
}


} // end of exports

// utility to sort an array by an integer key
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = parseInt( a[key] ); var y = parseInt(b[key]);
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });}

