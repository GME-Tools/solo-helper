const dice = require('../dice');
const campingData = require('../../data/camping');

const setCamping = function(weather, terrain) {
  let dcCamping = 0;
  let findRoll = dice.die(20);
  let findCamping = false;
  let dcBivouac = 0;
  let bivouacRoll = 0;
  let bivouacSuccess = false;
  let disturbanceTrueRoll = 0;
  let disturbanceRoll = 0;
  let disturbanceName = "";

  for (let i = 1 ; i <= Object.keys(campingData.findCamping).length ; i++) {
    if (campingData.findCamping[i].terrain.includes(terrain)) {
      dcCamping = campingData.findCamping[i].dcCamping;
      dcBivouac = campingData.findCamping[i].dcBivouac;
    }
  }

  if (findRoll >= dcCamping) {
    findCamping = true;
    bivouacSuccess = true;
  }

  if (weather.includes("Neige") || weather.includes("neige")) {
    bivouacRoll = dice.die(20);

    if (bivouacRoll < dcBivouac) {
      bivouacSuccess = false;
    }
  } else if (weather.includes("Pluvieux") || weather.includes("Pluie")) {
    bivouacRoll = dice.die(20);

    if (bivouacRoll < dcBivouac) {
      bivouacSuccess = false;
    }
  }

  if (findCamping === true && bivouacSuccess === true) {
    disturbanceTrueRoll = dice.die(100);

    if (disturbanceTrueRoll > 75) {
      disturbanceRoll = dice.die(100);

      for (let i = 1 ; i <= Object.keys(campingData.wakesYou).length ; i++) {
        if (disturbanceRoll >= campingData.wakesYou[i].value[0] && disturbanceRoll <= campingData.wakesYou[i].value[1]) {
          disturbanceName = campingData.wakesYou[i].name;
        }
      }
    }
  } else if ((findCamping === true && bivouacSuccess === false) || (findCamping === false && bivouacSuccess === true))  {
    disturbanceTrueRoll = dice.die(100);

    if (disturbanceTrueRoll > 50) {
      disturbanceRoll = dice.die(100);

      for (let i = 1 ; i <= Object.keys(campingData.wakesYou).length ; i++) {
        if (disturbanceRoll >= campingData.wakesYou[i].value[0] && disturbanceRoll <= campingData.wakesYou[i].value[1]) {
          disturbanceName = campingData.wakesYou[i].name;
        }
      }
    }
  } else {
    disturbanceTrueRoll = dice.die(100);

    if (disturbanceTrueRoll > 25) {
      disturbanceRoll = dice.die(100);

      for (let i = 1 ; i <= Object.keys(campingData.wakesYou).length ; i++) {
        if (disturbanceRoll >= campingData.wakesYou[i].value[0] && disturbanceRoll <= campingData.wakesYou[i].value[1]) {
          disturbanceName = campingData.wakesYou[i].name;
        }
      }
    }
  }

  return {
    findCamping: findCamping,
    bivouacSuccess: bivouacSuccess,
    disturbanceName: disturbanceName
  }
}

module.exports = setCamping;