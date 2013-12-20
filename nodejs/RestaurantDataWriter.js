// Writes restaurant data to JSON format

module.exports = {

writeData: function(params, json)
{
	json.push({name: params.rname, 
			price: params.price});
}

}
