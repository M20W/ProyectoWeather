const apiKey = "3dc2b382557a468e26bf3b93993c9bb5";
let weatherArray = [];
let weatherNowArray = [];

document.getElementById("search").addEventListener("click", () => {
    displayWeather();
    clearUI();
});

document.getElementById("compare").addEventListener("click", () => {
    compareTemps(weatherNowArray);
});

document.getElementById("history").addEventListener("click", () => {
    weatherHistory(weatherArray);
});

document.getElementById("clear").addEventListener("click", () => {
    clearUI();
});

async function displayWeather() {          
    const cityName = document.getElementById("city").value;

    if (cityName === "" || cityName === undefined) {
        //messageUI("Ingresa la ciudad");    
        alert("Ingresa la ciudad"); 
        return;
    } else {        
        const countryCode = document.getElementById("countries").value;                                
        const city = await getWeather(cityName, countryCode);    
        const city2 = await getWeatherNow(cityName);           
        weatherNowArray.push(city2);               
        addWeatherUI(city);
        console.log(city);
        addWeatherUINow(city2);
        weatherArray.push(city);   
        console.log(city2);
    }
}

async function getWeather(city, country) {  
    try {                        
        const response = await fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&units=metric&appid=${apiKey}`);
        if (response.status ===404)  {        
        messageUI(`Asegúrate de haber ingresado los datos correctamente`);                                      
        return;
    }         
        return await response.json();        
    } catch (e) {            
        messageUI("Bad Connection! Try Again");        
    }                 
}

function weatherHistory (weatherArray) {      
    weatherArray.forEach((element) =>   {
        const weatherList = document.getElementById('history-container')
        const ele = document.createElement("div");
        ele.innerHTML = `
            <strong>Nombre de la ciudad: ${element.city.name}</strong>
            <br>      
        `, weatherList.appendChild(ele)    
    });

}

function addWeatherUI(weather) {    
    const weatherList = document.getElementById("weather-container");
    const el = document.createElement("div");
    el.innerHTML = `
    <div class = "title2"> 5 day forecast with a 3-hour step </div>
        <div class= "cityInfo">
            <strong> country: </strong> ${weather.city.country}
            <br> 
            <strong> name: </strong> ${weather.city.name}                                          
        </div>
    </div>
    `;
    weatherList.appendChild(el);

    (weather.list).forEach((element) =>   {
        const weatherHour = document.getElementById('weather-container2')
        const ele = document.createElement("div");
        ele.innerHTML = `
        <div class= "temps"> 
            <div class= "tempsHour">
                <div class= "date">  ${(element.dt_txt).slice(5,16)} </div>
                <div class= "iconss"> 
                    <img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png" class= "iconNormal"> 
                </div>
                <div class = "tempsInfo"> 
                    <strong> ${ Math.round( element.main.temp)}°C</strong> 
                    <div class="desc"> ${element.weather[0].description}</div> 
                </div>
            </div>  
        </div>        
                `, weatherHour.appendChild(ele)        
                //<strong>date: ${(element.dt_txt).slice(5,16)}</strong>
    });        

}

function clearUI() {
    document.getElementById("message").innerHTML = "";
    document.getElementById("weather-container").innerHTML = "";
    document.getElementById("weather-container2").innerHTML = "";
    document.getElementById("city").value = "";
    document.getElementById("countries").value = '0';
    document.getElementById("coldestCity").innerHTML = "";
    document.getElementById("history-container").innerHTML ="";
    document.getElementById("weatherNow").innerHTML= "";
}

function messageUI(message) { 
    const mes = document.getElementById('message');
    const element = document.createElement("div");    
    element.innerHTML = `<h3> ${message} </h3>`; 
    mes.appendChild(element);    
}   


function compareTemps(weatherNowArray) {  
    console.log(weatherNowArray);
    weatherNowArray.sort((a,b) => {
        return a.main.temp - b.main.temp;
    });      

    console.log(weatherNowArray[0]);
    const coldestCity = document.getElementById("coldestCity");
    const element = document.createElement("div");
    element.innerHTML = `
        <strong> Nombre de la ciudad: </strong> ${weatherNowArray[0].name}
        <br>
        <strong> Temp: </strong> ${weatherNowArray[0].main.temp} °C
    `;
    coldestCity.appendChild(element);
}

//La otra api normal

async function getWeatherNow (city) {
    try {
        messageUI('Cargando...')
        const response = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        if (response.status ===404)  {        
            messageUI("City Not Found");
            return;
        }         
        clearUI()
        return await response.json();
        } catch (e) {            
            messageUI("Bad Connection! Try Again");        
        }
}

// async function displayWeatherNow() {
          
//     const cityName = document.getElementById("city").value;
//     const city = await getWeatherNow(cityName);           
//     addWeatherUINow(city);
//     console.log(city);
// }

function addWeatherUINow(weather) {

    let unix = weather.sys.sunrise;
    let sunrise = new Date (unix * 1000) + "";
    let unix2 = weather.sys.sunset;
    let sunset = new Date (unix2 * 1000) + "";

    document.getElementById('weatherNow').innerHTML = "";
    const weatherNow = document.getElementById('weatherNow');
    const eleme = document.createElement("div");
    eleme.innerHTML = `

    <div class= "tempNow">  
        <div class = "iconNow">
        <img class="icon-principal" src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">    
        </div>           
        <div class= "temp"> ${ Math.round( weather.main.temp)}°C</div>         
        <div class = "desc"> ${weather.weather[0].description} </div>
        <hr>
        ${weather.name}
        <br> 
        <div class="miniContainers">
        
        <div class="box"> 
        <strong> feels like: </strong> ${weather.main.feels_like}        
        </div>          

        <div class = "box">
        <strong> temp max: </strong> ${weather.main.temp_max}
        </div>

        <div class= "box"> 
        <strong> temp min: </strong> ${weather.main.temp_min}
        </div>

        <div class="box">
        <strong> humidity: </strong> ${weather.main.humidity}%
        </div>

        <div class="box">        
        <strong> sunrise: </strong> ${sunrise.slice(15, 24)}
        </div>

        <div class="box">
        <strong> sunset: </strong> ${sunset.slice(15,24)}
        </div>

        </div>
        <button id="clear" class="clear">Limpiar</button>

        </div>
        `;
        weatherNow.appendChild(eleme);
    }

