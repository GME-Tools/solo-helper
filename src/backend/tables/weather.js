const weatherData = require('../../data/weather');
const dice = require('../dice');

/* Utilisez le tableau ci-dessous pour déterminer la météo d'un jour ou d'une nuit en particulier. Là où le temps donne l'option Chaud, si le jet est vers le bas de la plage, il fait chaud. Si c'est plus haut, il fait très chaud. Les résultats évoluent vers le haut. Ajuster selon le terrain aussi. Si c'est dans un désert => +5, si c'est dans montagnes ou steppes glacées => -5 */


const seasonSet = (season) => {
  let seasonDice = dice.die(4);
  let seasonName = "";
  let seasonURL = "";
  
  if (season !== "auto") {
    seasonName = season;
  } else {
    for (let i = 1 ; i <= Object.keys(weatherData.season).length ; i++) {
      if (seasonDice >= weatherData.season[i].value[0] && seasonDice <= weatherData.season[i].value[1]) {
        seasonName = weatherData.season[i].name;
        seasonURL = weatherData.season[i].url;
      }
    }
  }
  
  return {
    seasonName: seasonName,
    seasonURL: seasonURL
  }
}

const seasonRead = (season) => {
  let seasonName = season;

  return {
    season: seasonName
  }
}

const weatherRandom = (weather, season, modifier) => {
  let weatherDice = dice.die(20);
  let weatherName = "";
  let seasonName = "";
  let weatherURL = "";
  let seasonURL = "";

  if (modifier === "froid") {
    weatherDice = weatherDice - 5;
  } else if (modifier === "chaud") {
    weatherDice = weatherDice + 5;
  }

  if (weather !== "auto") {
    weatherName = weather;
  } else {
    if (season !== undefined && season !== "") {
      for (let i = 1 ; i <= Object.keys(weatherData.weather).length ; i++) {
        if (weatherDice >= weatherData.weather[i].value[0] && weatherDice <= weatherData.weather[i].value[1]) {
          weatherName = weatherData.weather[i][season].name;
          weatherURL = weatherData.weather[i][season].url;
          seasonName = season;
        }
      }
    } else {
      let seasonDice = dice.die(4);
  
      for (let i = 1 ; i <= Object.keys(weatherData.season).length ; i++) {
        if (seasonDice >= weatherData.season[i].value[0] && seasonDice <= weatherData.season[i].value[1]) {
          seasonName = weatherData.season[i].name;
          seasonURL = weatherData.season[i].url;
        }
      }
  
      for (let i = 1 ; i <= Object.keys(weatherData.weather).length ; i++) {
        if (weatherDice >= weatherData.weather[i].value[0] && weatherDice <= weatherData.weather[i].value[1]) {
          weatherName = weatherData.weather[i][seasonName].name;
          weatherURL = weatherData.weather[i][seasonName].url;
        }
      }
    }
  }
  
  return {
    seasonName: seasonName,
    seasonURL: seasonURL, 
    weatherName: weatherName, 
    weatherURL: weatherURL
  }
}

const weatherRead = (season, weather) => {
  let seasonName = season;
  let weatherName = weather;

  return {
    season: seasonName,
    weather: weatherName
  }
}

exports.seasonSet = seasonSet;
exports.seasonRead = seasonRead;
exports.weatherRandom = weatherRandom;
exports.weatherRead = weatherRead;