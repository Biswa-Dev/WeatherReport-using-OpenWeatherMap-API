const express = require("express"); //including the installed express module
const http = require("http"); //including the native http module
require('dotenv').config();

//after installation of body-parser we need to require it in our app.js
const bodyParser = require("body-parser");

const app = express();
//use body-parser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){ //when client makes a get request to our server
    //res.send("The server is up and running...");

    //as a result of get request by client with our website url
    //we have to send them the index.html file
    res.sendFile(__dirname + "/index.html");
});

//when user submit the form make a post req
app.post("/",function(req,res){
    //now we need to use body parse to parse the body content
    //console.log(req.body.cityName);

    var city = req.body.cityName;
    var unit = "metric";
    var apiKey = process.env.API_KEY;
    var url = process.env.URL + city + "&units=" + unit + "&appid=" + apiKey;
    //the url for getting the weather related data required from the external server
    //includes path weather and some parameters and appid

    //now we need to make a get request to the external sever using http native module
    http.get(url,function(response){
        //console.log(response);
        //console.log(response.statusCode);//200

        //now we are going to use on method of response to get the data
        response.on("data",function(data){
            console.log(data);//you we will see data in hexadecimal form

            //now we need to convert the hexadecimal data into actual js obhect using JSON.parse() method
            const weatherReport = JSON.parse(data);
            console.log(weatherReport);

            //opposite of JSON.parse() is JSON.stringify()
            //console.log(JSON.stringify(data));

            //now to obtain a specific data from the weatherReport object
            //we have to use the dot notation and have to mention the path
            //we can use the help of JSON viewer awesome to get the path
            const temp = weatherReport.main.temp;
            const weatherDescription = weatherReport.weather[0].description;
            const icon = weatherReport.weather[0].icon;
            const imgURL = "http://openweathermap.org/img/wn/"+ icon +"@4x.png";

            //now we have to send the weather data as response to the client browser
            res.write("<h1>The temperature in " + city + " is " + temp + " degree Celcius</h1>");
            res.write("<p>The weather is currently " + weatherDescription + "</p>");
            res.write("<img src=" + imgURL +">");
            res.end();
        });
    });
});

app.listen(3000,function(req,res){
    console.log("Server is running on port 3000.");
});
