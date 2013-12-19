var http = require('http');

//The url we want is: 'health.data.ny.gov/resource/child-and-adult-care-food-program-participation-beginning-2007.json?
var options = {
  host: 'health.data.ny.gov',
  path: '/resource/child-and-adult-care-food-program-participation-beginning-2007.json?'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
    console.log('chunk received...');
  });

  //the whole response has been recieved, so we just print it out here
  response.on('end', function () {
    console.log(str);
  });
}

http.request(options, callback).end();
