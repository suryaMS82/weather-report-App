
var express= require('express');
var morgan= require('morgan');
var request= require('request-promise');
var bodyparser= require('body-parser');
var mongoose= require('mongoose');
var Blog= require('./models/city.js');

var app=express();

var dburl= 'mongodb+srv://suryaMS:surya123@nodejsapp.az5se.mongodb.net/node-app?retryWrites=true&w=majority' ;
mongoose.connect(dburl ,{ useNewUrlParser: true , useUnifiedTopology: true })
.then((result)=> app.listen(5000))
.catch((err)=> console.log(err));

app.set('view engine','ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(morgan('dev'));
var  key= "8490c85e41e594005e8930c625d76b61";
//var city='bengaluru';

async function weather_info(cities){
    var weather_data=[];
    for(var city_obj of cities){
        var city= city_obj.city ;
    var url= `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    var body_rep= await request(url);
    var data= JSON.parse(body_rep);
        weather={
            city:city,
            temperature:data.main.temp,
            description:data.weather[0].description,
            icon:data.weather[0].icon,
            humidity:data.main.humidity,
            sealevel:data.main.sea_level
        };
        weather_data.push(weather);
}
    return weather_data ;
};

app.get('/',(req,res)=> {
    Blog.find({},(err,cities)=>{
        weather_info(cities).then((result)=> {
            var weather_data={ weather_data : result};
            
            
           // res.sendFile(__dirname+'/index.html');
            res.render("index",{weather_data});
        })
    })
});  


app.post('/',(req,res)=> {
    var cityname=new Blog(req.body) ;
    cityname.save()
     .then((result)=> {
        res.redirect('/');  
     })
     .catch((err)=> {
         console.log(err);
     });
    console.log(cityname);
});


