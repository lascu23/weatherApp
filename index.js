import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express()

const apiKey = "-";
let lat, lon;

app.set('view engine', 'ejs'); 

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.render("index")
})

app.post('/getCity',async (req, res)=>{
    try{
        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${req.body.inputCity}&appid=${apiKey}`)
        lat = response.data[0].lat;
        lon = response.data[0].lon;
    }catch(error){
        console.error("Eroarea la preluarea datelor pentru lat si lon", error);
        res.render("index", {error1: "Please enter a city that exsists"})
    }

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        const data={
            city : response.data.name,
            temp : Math.round(response.data.main.temp),
            main : response.data.weather[0].main,
            wind : response.data.wind.speed,
            humidity : response.data.main.humidity
        }
        res.render("index", {data: data})
    }catch(error){
        console.error("Eroarea la preluarea datelor pentru vreme");
    }
})


app.listen(5000, ()=>{
    console.log("Listening to portm 5000.")
})
