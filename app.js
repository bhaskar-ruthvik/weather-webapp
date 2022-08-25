const express = require("express");
const app = express();
const https=require("https");
const bodyParser = require("body-parser");

function getDay(day){
  switch(day){
    case 0:
      return "Sunday";
      break;
    case 1:
      return "Monday";
      break;
    case 2:
      return "Tuesday";
      break;
    case 3:
      return "Wednesday";
      break;
    case 4:
      return "Thursday";
      break;
    case 5:
      return "Friday";
      break;
    case 6:
      return "Saturday";
      break;
  }
}

function getMonth(month){
  switch(month){
    case 1:
      return "January";
      break;
    case 2:
      return "February";
      break;
    case 3:
      return "March";
      break;
    case 4:
      return "April";
      break;
    case 5:
      return "May";
      break;
    case 6:
      return "June";
      break;
    case 7:
      return "July";
      break;
    case 8:
      return "August";
      break;
    case 9:
      return "September";
      break;
    case 10:
      return "October";
      break;
    case 11:
      return "November";
      break;
    case 12:
      return "December";
      break;
  }
}




app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));


const today = new Date();
const hours = today.getHours();
const minutes = today.getMinutes();
let min;
if(today.getMinutes()<10){
  min = "0"+minutes;
}else{
  min = minutes;
}
const time = hours+":"+min;
const date1 = today.getDate();
const day = getDay(today.getDay());
const month = getMonth(today.getMonth());
const date =day+ ", "+date1 +" "+ month;
const err = "Sorry, please enter a valid location!"

app.get("/",function(req,res){


  let errcl="";
 res.render("main",{time:time,date:date,err:err,errcl:errcl});
})

app.post("/",function(req,res){
  const apiKey="028ac2f69f34263182e0c63c70b14b92";
  const units = "metric";
  const location = req.body.searchBox;

  const url = "https://api.openweathermap.org/data/2.5/weather?appid="+apiKey+"&q="+location+"&units="+units;
  https.get(url,function(response){
    console.log(response.statusCode);
    if(response.statusCode>399 && response.statusCode<450){
      errcl = "show";
      res.render("main",{time:time,date:date,err:err,errcl:errcl});
    }else{
    response.on("data",function(data){
    const weatherData = JSON.parse(data);
    const temp = weatherData.main.temp;
    const tempRounded =Math.floor(weatherData.main.temp) ;
    const tempDec = Math.round((temp - tempRounded)*100);
    const desc = weatherData.weather[0].description;
    const name= weatherData.name;
    const timezone = weatherData.timezone;
    const mintemp = weatherData.main.temp_min;
    const maxtemp = weatherData.main.temp_max;
    const feelslike = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const windspeed = weatherData.wind.speed;
    const id = weatherData.weather[0].id;
    let bgclass;
    if(id>199 && id<299){
      bgclass = "thunderstorm";
    }
    else if(id>=300 && id<399){
      bgclass = "drizzle";
    }
    else if(id>=500 && id<599){
      bgclass = "rain";
    }
    else if(id>=600 && id<699){
      bgclass = "snow";
    }
    else if(id>=700 && id<799){
      bgclass = "atmosphere";
    }
    else if(id==800){
      bgclass = "clear";
    }
    else{
      bgclass = "clouds";
    }


    res.render("weather",{temp:tempRounded,desc:desc,tempDec:tempDec,name:name,mintemp:mintemp,maxtemp:maxtemp,humidity:humidity,feelslike:feelslike,windspeed:windspeed,bgclass:bgclass});
  })}
  })
})


app.listen(3000,function(){
  console.log("Server has started at port 3000");
})
