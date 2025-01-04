// Variáveis e seleção de elementos
const apiKey = "169fdf091f8ae324a4872f312623d845";
const unsplashAccessKey = "8NlqS1rk6smDVeh0tx7GQGanSWDoabMqOLOOfYEOLHo";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#humidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

// Loader
const toggleLoader = () => {
  loader.classList.toggle("hide");
};

// Funções
const getWeatherData = async (city) => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Função para obter imagem da Unsplash
const getUnsplashImage = async (city) => {
  const apiUnsplashURL = `https://api.unsplash.com/search/photos?query=${city}&client_id=${unsplashAccessKey}`;
  const res = await fetch(apiUnsplashURL);
  const data = await res.json();
  // Verifica se há resultados e retorna a URL da primeira imagem
  if (data.results.length > 0) {
    return data.results[0].urls.regular;
  } else {
    // Se não houver resultados, retorna uma imagem padrão ou aleatória
    return `https://source.unsplash.com/1600x900/?${city}`;
  }
};

// Função para obter a bandeira do país
const getCountryFlag = async (countryCode) => {
  const apiCountryURL = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  const res = await fetch(apiCountryURL);
  const data = await res.json();
  return data[0].flags.png;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
};

const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};

const showWeatherData = async (city) => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === "404") {
    showErrorMessage();
    return;
  }

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );

  // Obter e definir a bandeira do país
  const countryFlag = await getCountryFlag(data.sys.country);
  countryElement.setAttribute("src", countryFlag);

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Obter e definir a imagem de plano de fundo da Unsplash
  const backgroundImage = await getUnsplashImage(city);
  document.body.style.backgroundImage = `url("${backgroundImage}")`;

  weatherContainer.classList.remove("hide");
};

// Eventos
searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const city = cityInput.value;

  showWeatherData(city);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value;

    showWeatherData(city);
  }
});

// Sugestões
suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});
