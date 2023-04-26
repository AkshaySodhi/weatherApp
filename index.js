// Writing js
// fetching all required field to add behaviour
const main = document.querySelector(".box-1");
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grantLocation-container");
const parameterContainer = document.querySelector("[data-parameter]");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".userInfo-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const body = document.body;
const convertBtn = document.querySelector(".convert");
const mapElem = document.querySelector("#map");
const map = L.map("map").setView([10, 1], 13);
const viewBtn = document.querySelector(".view");
const heads = document.querySelector("h1");
const pars = document.querySelectorAll("p");
const footer = document.querySelector("footer");
const refLon = 88;
const googleStreet = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleHybrid = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const googleTerrain = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
const openStreet = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
  }
);
let curL = 0;
let currLayer = openStreet;
const views = [
  googleStreet,
  googleSat,
  googleTerrain,
  googleHybrid,
  openStreet,
];
const feedbackBtn = document.querySelector(".feedbackBtn");
let date;
let time;
let feel;
let cel,
  ms,
  cnt = true;

currLayer.addTo(map);

// Initially needed Variable

let oldTab = userTab;
const API_KEY = "4f5a3be1ba6c8da648ec0273e78e8e2f";
oldTab.classList.add("current-tab");

// load hote hi browser me weather dikhane ke liye function call
getfromSessionStorage();

// ager coords session storage me present honge pahle se to ye weather dikha dega
// other wise above function grant location wali tab ko dikhayega

// creating function for tab switching
function switchTab(newTab) {
  if (newTab != oldTab) {
    // console.log('hii-3');

    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    // console.log('hii-4');
    oldTab.classList.add("current-tab");

    // ager search tab invisible hai then make it visible

    if (!searchForm.classList.contains("active")) {
      // first deactivate both userinfo and grant container
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("acitve");

      // Now add search contaner to make it visible
      searchForm.classList.add("active");
    } else {
      // means mai phle search wale tab pr tha , ab user tab visible krna hai
      searchForm.classList.remove("active");
      userContainer.classList.remove("active");
      // ab mai your weather tab me aa gya hu , to weather bhi display krna padega ,
      // so lets check local storage first
      //for coordinates, if we have saved there

      getfromSessionStorage();
    }
  }
}

convertBtn.addEventListener("click", () => {
  const far = (cel * (9 / 5) + 32).toFixed(2);
  if (cnt) {
    document.querySelector("[data-temp]").innerText = `${far}°F`;

    cnt = false;
  } else {
    document.querySelector("[data-temp]").innerText = `${cel}°C`;

    cnt = true;
  }
});
userTab.addEventListener("click", () => {
  // passing clicked tab as parameter
  // console.log('hii');
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  // passing clicked tab as parameter
  switchTab(searchTab);
});

// check kro kya pahle se coordinates pde hai

function getfromSessionStorage() {
  const localCoords = sessionStorage.getItem("user-coordinates");

  // ager local coordinates nhi pde hai to grant access container ko active kr do
  if (!localCoords) {
    // this means local coords are absent
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoords);
    // in coords ko eak function me pass kr do jo ense api call kr le
    fetchWeatherInfo(coordinates);
  }
}

// creating function to get weather details for passed coordinater

async function fetchWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;

  // ager coordinates mil gye hai to grantaccess container ko invisible bna do
  grantAccessContainer.classList.remove("active");
  // jb tak en coors se info fetch krne ke liye api call hogi tab tak make loader visible
  loadingScreen.classList.add("active");

  // API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    // data aane ke baad sabse phle loading screen ko gayab kro
    loadingScreen.classList.remove("active");
    // And data ko show krne ke liye user info container ko active kro
    userInfoContainer.classList.add("active");
    // Ab es data me se useful weather info ko one by one render krenge
    renderWeatherInfo(data);
  } catch (err) {
    //Error aate hi pahle loading screen ko band kro
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  date = new Date().getHours();
  searchInput.value = "";
  // sabse pahle html element ke attribute select kr lo jisme data bhejna hia
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloud]");
  const { lat, lon } = weatherInfo.coord;
  const coords = [lat, lon];
  const condition = weatherInfo.weather[0].main;

  //   console.log(weatherInfo);
  //   const condition = weatherInfo.weather[0].main;
  //   const placeDate = Math.abs(date + ((lon - refLon) * 4) / 60).toFixed(0);
  //   if (
  //     (placeDate >= 0 && placeDate <= 6) ||
  //     (placeDate >= 20 && placeDate <= 24)
  //   ) {
  //     time = "night";
  //   } else if (placeDate >= 6 && placeDate <= 17) {
  //     time = "day";
  //   } else {
  //     time = "evening";
  //   }
  //   if (temp <= 5) {
  //     feel = "snow";
  //   } else if (temp <= 35) {
  //     feel = "ok";
  //   } else {
  //     feel = "hot";
  //   }
  //   console.log(condition, time, feel);
  map.setView(coords, 11);
  mapElem.style.opacity = 1;
  body.style.paddingLeft = `100px`;
  setTimeout(() => {
    map.removeLayer(marker);
  }, 4500);
  marker = L.marker(coords)
    .addTo(map)
    .bindPopup(
      L.popup({
        maxwidth: 250,
        minwidth: 100,
        className: `popup`,
      })
    )
    .setPopupContent(`${weatherInfo.weather[0].description}`)
    .openPopup();
  // Ab sabme dynamically value dal denge

  cityName.innerText = weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

  desc.innerText = weatherInfo?.weather?.[0]?.description;

  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

  //document.body.style.backgroundImage = "url('sunny.jpg')";
  cel = weatherInfo?.main?.temp;
  ms = weatherInfo?.wind?.speed;
  temp.innerText = `${cel} °C`;
  windSpeed.innerText = `${ms} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
  console.log(weatherInfo, condition);
  if (condition === "Haze") {
    body.style.backgroundImage = `linear-gradient(160deg, #876f2e 0%, #c7af41 100%)`;
    heads.style.color = "white";
    pars.forEach((p) => (p.style.color = "white"));
  } else if (condition === "Clear" && weatherInfo.main.temp >= 30) {
    body.style.backgroundImage = `linear-gradient(160deg, #de9c1a 0%, #efe22a 100%)`;
    heads.style.color = "white";
    pars.forEach((p) => (p.style.color = "white"));
  } else if (condition === "Clouds" || condition === "Clear") {
    body.style.backgroundImage = `linear-gradient(160deg, #2973c7 0%, #3bb1d8 100%)`;
    heads.style.color = "white";
    pars.forEach((p) => (p.style.color = "white"));
  } else if (condition === "Smoke") {
    body.style.backgroundImage =
      "linear-gradient(160deg, #acadad 0%, #ecf0f3 100%)";
    heads.style.color = "black";
    pars.forEach((p) => (p.style.color = "black"));
  } else if (condition === "Rain") {
    heads.style.color = "white";
    body.style.backgroundImage = ` linear-gradient(160deg, #112d4e 0%, #3f72af 100%)`;
    pars.forEach((p) => (p.style.color = "white"));
  } else {
    body.style.backgroundImage = `linear-gradient(160deg, #2973c7 0%, #3bb1d8 100%)`;
    heads.style.color = "white";
    pars.forEach((p) => (p.style.color = "white"));
  }
}

// creating get location function

function getLocation() {
  // first check kro ki geoLocation api supporteed hai ki nhin
  if (navigator.geolocation) {
    // ager support available hai to location find out kro
    // with the help of a function called : showPosition
    navigator.geolocation.getCurrentPosition(showPosition);
  }

  // if geolocation is not supported
  else {
    // eak alert dikha do ager support nhi krta geolocation
  }
}

// Defining showposition function

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  // ab in coordinates ko session storage me store kr lenge -- user-coordinates  name se
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

  fetchWeatherInfo(userCoordinates);
}

// ager local coors absent hai to
// Grant access btn pr eak listner lgakr
// geolocation api ke thru coors generate krke user ka weather dekhna pdega

grantAccessButton.addEventListener("click", getLocation);

// search weather ka function

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityName = searchInput.value;
  if (cityName === "") {
    return;
  } else {
    // search bar ko gayab krke , weather info dikhao
    // searchForm.classList.remove("active")
    fetchSearchWeatherInfo(cityName);
  }
});

// ye functiion city name ke base pr API call krke uski detail nikalega

async function fetchSearchWeatherInfo(city) {
  //Jab tak api call ho rhi hai tab tak loader ko active kr do
  loadingScreen.classList.add("active");
  // jo bhi purana weather dikh rha hai usko bhi remove kr do
  userInfoContainer.classList.remove("active");
  // ager grant access container dikh rha hai to usko bhi remove krdo
  grantAccessContainer.classList.remove("active");

  // Now its time to call API

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();
    // Data aaate hi loader ko hta do
    loadingScreen.classList.remove("active");
    // data dikhane ke liye user container ko active kr do
    userInfoContainer.classList.add("active");
    // is container me data fill krne ke liye render function ko call krna hai

    renderWeatherInfo(data);
  } catch (e) {
    // error handeling
  }
}

//modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close-modal");
const btnOpenModal = document.querySelectorAll(".show-modal");

const openfxn = function () {
  modal.classList.remove("hidden"); //remove hidden class from the element
  overlay.classList.remove("hidden");
};
//looping thru the elements of selectALL and eventhandler
for (let i = 0; i < btnOpenModal.length; i++) {
  btnOpenModal[i].addEventListener("click", openfxn);
}

//close event function
const closefxn = function (e) {
  e.preventDefault();
  modal.classList.add("hidden"); //add hidden back on closing
  overlay.classList.add("hidden");
};
btnCloseModal.addEventListener("click", closefxn);
overlay.addEventListener("click", closefxn);

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    //esc pressed
    if (!modal.classList.contains("hidden")) {
      //modal not hidden
      closefxn(); // then hide it
    }
  }
});
function sendMail() {
  const params = {
    email: document.querySelector(".mail").value,
    message: document.querySelector(".feedback").value,
  };
  const serviceID = "service_q7xa9zz";
  const templateID = "template_i54kd9l";
  emailjs.send(serviceID, templateID, params);
}
feedbackBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMail();
  document.querySelector(".mail").value = "";
  document.querySelector(".feedback").value = "";
});

viewBtn.addEventListener("click", function () {
  if (curL === 4) {
    curL = 0;
  } else {
    curL++;
  }
  currLayer = views[curL];
  map.removeLayer(currLayer);
  currLayer.addTo(map);
});

const revealFooter = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  console.log(entry.target);
  footer.style.opacity = 1;
  observer.unobserve(entry.target);
};
const footerObs = new IntersectionObserver(revealFooter, {
  root: null,
  threshold: 0.1,
});
footerObs.observe(footer);
footer.style.opacity = 0;
