var restaurantWriter = require('./RestaurantDataWriter');

var json=[];

var test = {
    rname: "subway",
    price: "5.00"
}

restaurantWriter.writeData(test,json);

console.log(json);
