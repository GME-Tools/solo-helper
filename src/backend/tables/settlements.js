const dice = require('../dice');
const generator = require('../generator');
const settlementsData = require('../../data/settlements');

const unmarkedSettlements = function(density) {
  let settlementsNumbers = dice.die(4) - 1;
  let settlementsFoundRoll = 0;
  let settlementsChanceNumber = 0;
  let settlementsRoll = 0;
  let settlementsSpeRoll = 0;
  let settlementsTypeTemp = "";
  let settlementsType = [];
  let settlementsPopulationRoll = 0;
  let settlementsPopulation = [];
  let settlementsNameRoll = 0;
  let settlementsName = [];

  for (let i = 1 ; i <= Object.keys(settlementsData.unmarkedSettlementsFinding).length ; i++) {
    if (density === settlementsData.unmarkedSettlementsFinding[i].populationDensity) {
      settlementsChanceNumber = settlementsData.unmarkedSettlementsFinding[i].chance;
    }
  }

  for (let i = 1 ; i <= settlementsNumbers ; i++) {
    settlementsFoundRoll = dice.die(100);

    if (settlementsFoundRoll <= settlementsChanceNumber) {
      settlementsRoll = dice.die(10);

      for (let j = 1 ; j <= Object.keys(settlementsData.unmarkedSettlementsNature).length ; j++) {
        if (settlementsRoll >= settlementsData.unmarkedSettlementsNature[j].value[0] && settlementsRoll <= settlementsData.unmarkedSettlementsNature[j].value[1]) {
          let settlementsNameTemp = "";

          if (settlementsRoll === 1) {
            settlementsSpeRoll = dice.die(100);

            if (settlementsSpeRoll <= 25) {
              settlementsTypeTemp = settlementsData.unmarkedSettlementsNature[j].name + ". Abandonné";
            } else {
              settlementsTypeTemp = settlementsData.unmarkedSettlementsNature[j].name + ". Non abandonné";
            }

            settlementsType.push(settlementsTypeTemp);
          } else {
            settlementsType.push(settlementsData.unmarkedSettlementsNature[j].name);
          }

          settlementsPopulationRoll = dice.die((settlementsData.unmarkedSettlementsNature[j].population[1] - settlementsData.unmarkedSettlementsNature[j].population[0])) + settlementsData.unmarkedSettlementsNature[j].population[0];

          settlementsPopulation.push(settlementsPopulationRoll);

          settlementsNameRoll = dice.die(5);

          settlementsNameTemp = generator.nameGenerator(settlementsNameRoll);

          settlementsName.push(settlementsNameTemp);
        }
      }
    }
  }

  return {
    settlementsName: settlementsName,
    settlementsType: settlementsType,
    settlementsPopulation: settlementsPopulation
  }
}

exports.unmarkedSettlements = unmarkedSettlements;