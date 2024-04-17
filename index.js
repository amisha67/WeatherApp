const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessButton=document.querySelector("[data-grantAccess]");
const grantAccesscontainer=document.querySelector(".grantLocationContainer");
const loadingScreen=document.querySelector(".loading-Container");
const userInfoContainer=document.querySelector(".user-info-container");
const searchForm=document.querySelector("[data-searchForm]");
const errorTab=document.querySelector(".error-container");
const errormsg=document.querySelector("[data-errorText]");
const errorimg=document.querySelector("[data-errorImg]");
const errorretry=document.querySelector("[data-errorRetry]");

// kesa variable ka need h ab?
let currentTab=userTab;//dafault user weather select kr diye
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; 
currentTab.classList.add("current-tab");

getfromSessionStorage();// ek kaam aur pending h


// switching between screens
function switchTab(clickedTab){
    if(clickedTab!==currentTab){
        currentTab.classList.remove("current-tab");//ye uske piche ka clr h
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            //kya ye search tab active h? agr nhi to acitve kro
            userInfoContainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchForm.classList.add("active");//
        }
        else{
            // agr search active h to change krne k baad to your p hi jaogi
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // your m aane k baad to ask kru location ya weather display kru
            // aur check kru for local coord if saved location or not
            getfromSessionStorage();
        }
    }
    // jis tab m h ussi ko tap kiye to frk nhi prna chahiye jo ki frk n prega kyuki change to hona nhi h
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

function  getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        // agr local coord nhi h
        grantAccesscontainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // make grantconatainer invisible
    grantAccesscontainer.classList.remove("active");
    // make loader invisible
    loadingScreen.classList.add("active");
    // API call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        console.log("1");
        const data=await response.json();
        console.log("2");
        loadingScreen.classList.remove("active");
        console.log("3");
        userInfoContainer.classList.add("active");
        console.log("4");
        renderWeatherInfo(data);
        console.log("5");
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("not fetched location");
        errorTab.classList.add("active");
        errorimg.style.display="none";
        errormsg.innerText=`Error:${err?.message}`;
        errorretry.addEventListener("click",fetchUserWeatherInfo);
    } 
}

function renderWeatherInfo(weatherInfo){//show krna h main box ko
    // firstly we have to fetch the elements
    const cityName= document.querySelector("[data-cityname]");
    const countryIcon= document.querySelector("[data-countryIcon]");
    const desc= document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-clouds]");

    // fetch value from  


    // ??ye response kese laya chrome m daal k fetched api ka

    // optional chaining opr kya hota h:nested json chaining m kisi property ko access krne k liye use hota h
    // it will give undefines if that property doent exist 

    cityName.innerText=weatherInfo?.name;
    console.log("name");
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    // cdn type m flag present hota h uska link daalna hoga 1:34
    console.log("name2");
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    // kyuki weather ek array element h aur uske phle element m desc content pra hua h
    console.log("name3");
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    console.log("name4");
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    console.log("name5");
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    console.log("name6");
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    console.log("name7");
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
    console.log("name8");
}

const messageText=document.querySelector("[data-Textt]");
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition,errorHandl);
    }
    else{
        // alert show kro prev class m hua tha
        grantAccessButton.style.display="none";
        messageText.innerText="geolocation not supported";

    }
}

function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.getItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
        return;
    else
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");
    errorTab.classList.remove("active");
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data=await response.json();
        if(!data.sys){
            throw data;
        }
        // ye break kr diyaaaaaaaaaaaaaa
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        console.log("errorr");
        errorTab.classList.add("active");
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errormsg.innerText="city not found";
        errorretry.style.display="none";
    }
}

// Error wala part idhr h
function errorHandl(error){
    switch (error.code) {
        case error.PERMISSION_DENIED:
          messageText.innerText = "You denied the request for Geolocation  .";
          console.log("geoloc");
          break;
        case error.POSITION_UNAVAILABLE:
          messageText.innerText = "Location information is unavailable.";
          console.log("unavail");
          break;
        case error.TIMEOUT:
          messageText.innerText = "The request to get user location timed out.";
          console.log("timeout");
          break;
        case error.UNKNOWN_ERROR:
          messageText.innerText = "An unknown error occurred.";
          console.log("unk");
          break;
    }
}




















// const API_KEY = "d1845658f92b31c64bd94f06f7188c9c"; 

// function renderWeatherInfo(data){
    
//         let newPara= document.createElement('p');
//         newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;

//         document.body.appendChild(newPara);
// }

// async function fetchWeatherDetails(){
//     try{
//         // let latitude=15.333;
//         // let longitude=74.0833;

//         let city="kolkata";

//         const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    
//         const data = await response.json();
//         // console.log("Weather data:-> "+ data); wrong syntax
//         console.log("Weather data:-> ", data);

//         // 33:34
//         renderWeatherInfo(data);
//     }catch(err){
//         // handle error
//         console.log("error found",err);
//     }
    
// }

// // async function getCustomWeatherDetail(){
// //     // glt horha
// //     try{
// //         let latitude=15.4312;
// //         let longitude=18.3422;

// //         let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?
// //                             lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
// //         let data= await result.json();

// //         console.log(data);
// //         renderWeatherInfo(data);

// //     }catch(err){
// //         console.log("error found",err);
// //     }
    
// // }

// // postman search