const dice = require('../dice');
const detailData = require('../../data/detail');
const adventureCrafter = require('./adventureCrafter');

const detailCheck = (chaos, charactersList, plotsList, currentPlot) => {
  const chaosmod = -2 * Math.trunc(chaos - 4.5);
  const roll1 = dice.die(10);
  const roll2 = dice.die(10);
  const sum = roll1 + roll2 + chaosmod;

  let detailName = "";
  let detailDescription = "";
  let detailNeed = "";

  for (let i = 1 ; i <= Object.keys(detailData.detailCheck).length ; i++) {
    if (sum >= detailData.detailCheck[i].value[0] && sum <= detailData.detailCheck[i].value[1]) {
      detailName = detailData.detailCheck[i].name;
      detailDescription = detailData.detailCheck[i].description;
      detailNeed = detailData.detailCheck[i].need;
    }
  }

  if (detailNeed === "Joueur") {
    detailNeed = adventureCrafter.characterRandom(charactersList, true).name;
  } else if (detailNeed === "PNJ") {
    detailNeed = adventureCrafter.characterRandom(charactersList, false).name;
  } else if (detailNeed === "Intrigue") {
    detailNeed = adventureCrafter.plotRandom(plotsList, false, false, currentPlot).name;
  } else {
    detailNeed = "";
  }

  return {
    detailName: detailName,
    detailDescription: detailDescription,
    detailNeed: detailNeed
  }
}

module.exports = detailCheck;