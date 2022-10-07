const dice = require('../dice');
const creatureData = require('../../data/creatureCrafter');

const creatureCrafter = (data, number) => {
  let creaturesNumber = 0;
  let creaturesNumberDice = 0;
  let potencyModifier = 0;
  let creatures = [];

  let findAbility = function(abilities, abilityName) {
    return abilities.find(ability => ability.name === abilityName);
  };

  let findAbilityBis = function(abilities, abilityName) {
    return abilities.find(({ name }) => name === abilityName);
  };

  if (number === 0) {
    creaturesNumberDice = dice.die(100);
    
    for (let i = 1 ; i <= Object.keys(creatureData.creaturesNumber).length ; i++) {
      if (creaturesNumberDice >= creatureData.creaturesNumber[i].value[0] && creaturesNumberDice <= creatureData.creaturesNumber[i].value[1]) {
        creaturesNumber = creatureData.creaturesNumber[i].number;
        potencyModifier = creatureData.creaturesNumber[i].potencyModifier;
      }
    }
  } else {
    for (let i = 1 ; i <= Object.keys(creatureData.creaturesNumber).length ; i++) {
      if (creatureData.creaturesNumber[i].number === parseInt(number)) {
        creaturesNumber = parseInt(number);
        potencyModifier = creatureData.creaturesNumber[i].potencyModifier;
      }
    }
  }

  for (let i = 1 ; i <= creaturesNumber ; i++) {
    let potencyModifierHealth = 0;
    let potencyModifierSpeed = 0;
    let potencyModifierOffense = 0;
    let potencyModifierDefense = 0;
    let potencyDiceHealth = 0;
    let potencyDiceSpeed = 0;
    let potencyDiceOffense = 0;
    let potencyDiceDefense = 0;
    let potencyDiceHealth1 = 0;
    let potencyDiceHealth2 = 0;
    let potencyDiceSpeed1 = 0;
    let potencyDiceSpeed2 = 0;
    let potencyDiceOffense1 = 0;
    let potencyDiceOffense2 = 0;
    let potencyDiceDefense1 = 0;
    let potencyDiceDefense2 = 0;
    let sizeDice = 0;
    let size = "";
    let skills = {
        "health": {
          "name": "",
          "description": "",
          "modifier": 0,
          "healthModifier": 0,
          "dice": 0
        },
        "speed": {
          "name": "",
          "description": "",
          "modifier": 0,
          "speedModifier": 0,
          "dice": 0
        },
        "offense": {
          "name": "",
          "description": "",
          "modifier": 0,
          "offenseModifier": 0,
          "dice": 0
        },
        "defense": {
          "name": "",
          "description": "",
          "modifier": 0,
          "defenseModifier": 0,
          "dice": 0
        }
      };
    let classificationDice = 0;
    let specialClassificationDice = 0;
    let classification = {
      "name": "",
      "description": ""
    };
    let specialClassification = [];
    
    potencyDiceHealth1 = dice.die(10);
    potencyDiceHealth2 = dice.die(10);
    potencyDiceSpeed1 = dice.die(10);
    potencyDiceSpeed2 = dice.die(10);
    potencyDiceOffense1 = dice.die(10);
    potencyDiceOffense2 = dice.die(10);
    potencyDiceDefense1 = dice.die(10);
    potencyDiceDefense2 = dice.die(10);

    sizeDice = dice.die(100);

    for (let j = 1 ; j <= Object.keys(creatureData.creaturesSize).length ; j++) {
      if (sizeDice >= creatureData.creaturesSize[j].value[0] && sizeDice <= creatureData.creaturesSize[j].value[1]) {
        size = creatureData.creaturesSize[j].name;

        potencyModifierHealth = creatureData.creaturesSize[j].health;
        potencyModifierSpeed = creatureData.creaturesSize[j].speed;
        potencyModifierOffense = creatureData.creaturesSize[j].defense;
        potencyModifierDefense = creatureData.creaturesSize[j].offense;
      }
    }

    classificationDice = dice.die(100);

    for (let j = 1 ; j <= Object.keys(creatureData.creatureClassification).length ; j++) {
      if (classificationDice >= creatureData.creatureClassification[j].value[0] && classificationDice <= creatureData.creatureClassification[j].value[1]) {
        classification.name = creatureData.creatureClassification[j].name;
        classification.description = creatureData.creatureClassification[j].description;

        potencyModifierHealth = potencyModifierHealth + creatureData.creatureClassification[j].health;
        potencyModifierSpeed = potencyModifierSpeed + creatureData.creatureClassification[j].speed;
        potencyModifierOffense = potencyModifierOffense + creatureData.creatureClassification[j].defense;
        potencyModifierDefense = potencyModifierDefense + creatureData.creatureClassification[j].offense;

        if (creatureData.creatureClassification[j].darkVision !== undefined) {
          specialClassificationDice = dice.die(100);

          for (let k = 1 ; k <= Object.keys(creatureData.creatureClassification[j].darkVision).length ; k++) {
            if (specialClassificationDice >= creatureData.creatureClassification[j].darkVision[k].darkVisionValue[0] && specialClassificationDice <= creatureData.creatureClassification[j].darkVision[k].darkVisionValue[1]) {
              specialClassification.push(
  creatureData.creatureClassification[j].darkVision[k].darkVisionName);
            }
          }
        }

        if (creatureData.creatureClassification[j].intellligence !== undefined) {
          specialClassificationDice = dice.die(100);

          for (let k = 1 ; k <= Object.keys(creatureData.creatureClassification[j].intellligence).length ; k++) {
            if (specialClassificationDice >= creatureData.creatureClassification[j].intellligence[k].intellligenceValue[0] && specialClassificationDice <= creatureData.creatureClassification[j].intellligence[k].intellligenceValue[1]) {
              specialClassification.push(
  creatureData.creatureClassification[j].intellligence[k].intellligenceName);
            }
          }
        }

        if (creatureData.creatureClassification[j].sharpSenses !== undefined) {
          specialClassificationDice = dice.die(100);

          for (let k = 1 ; k <= Object.keys(creatureData.creatureClassification[j].sharpSenses).length ; k++) {
            if (specialClassificationDice >= creatureData.creatureClassification[j].sharpSenses[k].sharpSensesValue[0] && specialClassificationDice <= creatureData.creatureClassification[j].sharpSenses[k].sharpSensesValue[1]) {
              specialClassification.push(
  creatureData.creatureClassification[j].sharpSenses[k].sharpSensesName);
            }
          }
        }

        if (creatureData.creatureClassification[j].malus !== undefined) {
          specialClassification.push(
creatureData.creatureClassification[j].malus);
        }

        if (creatureData.creatureClassification[j].healing !== undefined) {
          specialClassificationDice = dice.die(100);

          for (let k = 1 ; k <= Object.keys(creatureData.creatureClassification[j].healing).length ; k++) {
            if (specialClassificationDice >= creatureData.creatureClassification[j].healing[k].healingValue[0] && specialClassificationDice <= creatureData.creatureClassification[j].healing[k].healingValue[1]) {
              specialClassification.push(
  creatureData.creatureClassification[j].healing[k].healingName);
            }
          }
        }

        if (creatureData.creatureClassification[j].bonus !== undefined) {
          specialClassification.push(
creatureData.creatureClassification[j].bonus);
        }

        if (creatureData.creatureClassification[j].resistance !== undefined) {
          specialClassification.push(
creatureData.creatureClassification[j].resistance);
        }
      }
    }

    potencyDiceHealth = potencyDiceHealth1 + potencyDiceHealth2 + potencyModifier + potencyModifierHealth;
    potencyDiceSpeed = potencyDiceSpeed1 + potencyDiceSpeed2 + potencyModifier + potencyModifierSpeed;
    potencyDiceOffense = potencyDiceOffense1 + potencyDiceOffense2 + potencyModifier + potencyModifierOffense;
    potencyDiceDefense = potencyDiceDefense1 + potencyDiceDefense2 + potencyModifier + potencyModifierDefense;
  
    for (let j = 1 ; j <= Object.keys(creatureData.potencyTable).length ; j++) {
      if (potencyDiceHealth >= creatureData.potencyTable[j].value[0] && potencyDiceHealth <= creatureData.potencyTable[j].value[1]) {
        skills.health.name = creatureData.potencyTable[j].name;
        skills.health.description = creatureData.potencyTable[j].description;
        skills.health.modifier = creatureData.potencyTable[j].modifier;
        skills.health.healthModifier = potencyModifierHealth;
        skills.health.dice = potencyDiceHealth;
      }
    }

    for (let j = 1 ; j <= Object.keys(creatureData.potencyTable).length ; j++) {
      if (potencyDiceSpeed >= creatureData.potencyTable[j].value[0] && potencyDiceSpeed <= creatureData.potencyTable[j].value[1]) {
        skills.speed.name = creatureData.potencyTable[j].name;
        skills.speed.description = creatureData.potencyTable[j].description;
        skills.speed.modifier = creatureData.potencyTable[j].modifier;
        skills.speed.speedModifier = potencyModifierSpeed;
        skills.speed.dice = potencyDiceSpeed;
      }
    }

    for (let j = 1 ; j <= Object.keys(creatureData.potencyTable).length ; j++) {
      if (potencyDiceOffense >= creatureData.potencyTable[j].value[0] && potencyDiceOffense <= creatureData.potencyTable[j].value[1]) {
        skills.offense.name = creatureData.potencyTable[j].name;
        skills.offense.description = creatureData.potencyTable[j].description;
        skills.offense.modifier = creatureData.potencyTable[j].modifier;
        skills.offense.offenseModifier = potencyModifierOffense;
        skills.offense.dice = potencyDiceOffense;
      }
    }

    for (let j = 1 ; j <= Object.keys(creatureData.potencyTable).length ; j++) {
      if (potencyDiceDefense >= creatureData.potencyTable[j].value[0] && potencyDiceDefense <= creatureData.potencyTable[j].value[1]) {
        skills.defense.name = creatureData.potencyTable[j].name;
        skills.defense.description = creatureData.potencyTable[j].description;
        skills.defense.modifier = creatureData.potencyTable[j].modifier;
        skills.defense.defenseModifier = potencyModifierDefense;
        skills.defense.dice = potencyDiceDefense;
      }
    }

    let descriptionClass = "";
    
    if (classification.name === "Alien") {
      descriptionClass = "alienDescriptions";
    } else if (classification.name === "Animal") {
      descriptionClass = "animalDescriptions";
    } else if (classification.name === "Animé") {
      descriptionClass = "animatedDescriptions";
    } else if (classification.name === "Élémentaire") {
      descriptionClass = "elementalDescriptions";
    } else if (classification.name === "Humanoïde") {
      descriptionClass = "humanoidDescriptions";
    } else if (classification.name === "Bête surnaturelle") {
      descriptionClass = "supernaturalBeastDescriptions";
    } else if (classification.name === "Amorphe") {
      descriptionClass = "amorphousDescriptions";
    } else if (classification.name === "Plante") {
      descriptionClass = "plantDescriptions";
    } else if (classification.name === "Mort-vivant") {
      descriptionClass = "undeadDescriptions";
    } else if (classification.name === "Insecte") {
      descriptionClass = "insectDescriptions";
    }

    let descriptionDice1 = dice.die(100);
    let descriptionDice2 = dice.die(100);
    let description = [];
    let descriptionName = "";

    for (let j = 1 ; j <= Object.keys(creatureData[descriptionClass]).length ; j++) {
      if (descriptionDice1 >= creatureData[descriptionClass][j].value[0] && descriptionDice1 <= creatureData[descriptionClass][j].value[1]) {
        if (creatureData[descriptionClass][j].table !== undefined) {
          descriptionName = "";
          
          do {
            descriptionDice1 = dice.die(100);

            for (let k = 1 ; k <= Object.keys(creatureData[descriptionClass]).length ; k++) {
              if (descriptionDice1 >= creatureData[descriptionClass][j].table[k].value[0] && descriptionDice1 <= creatureData[descriptionClass][j].table[k].value[1]) {
                descriptionName = creatureData[descriptionClass][j].table[k].name;
              }
            }
          } while (descriptionName === "RELANCER");

          description.push(descriptionName);
        } else {
          description.push(creatureData[descriptionClass][j].name);
        }
      }
    }

    for (let j = 1 ; j <= Object.keys(creatureData[descriptionClass]).length ; j++) {
      if (descriptionDice2 >= creatureData[descriptionClass][j].value[0] && descriptionDice2 <= creatureData[descriptionClass][j].value[1]) {
        if (creatureData[descriptionClass][j].table !== undefined) {
          descriptionName = "";
          
          do {
            descriptionDice2 = dice.die(100);

            for (let k = 1 ; k <= Object.keys(creatureData[descriptionClass]).length ; k++) {
              if (descriptionDice2 >= creatureData[descriptionClass][j].table[k].value[0] && descriptionDice2 <= creatureData[descriptionClass][j].table[k].value[1]) {
                descriptionName = creatureData[descriptionClass][j].table[k].name;
              }
            }
          } while (descriptionName === "RELANCER");

          description.push(descriptionName);
        } else {
          description.push(creatureData[descriptionClass][j].name);
        }
      }
    }

    let abilityNumberDice = dice.die(100);
    let abilityNumber = 0;
    let abilityDice = 0;
    let abilities = [];
    let ability = {};
    let abilityTemp = "";

    for (let j = 1 ; j <= Object.keys(creatureData.abilityNumber).length ; j++) {
      if (abilityNumberDice >= creatureData.abilityNumber[j].value[0] && abilityNumberDice <= creatureData.abilityNumber[j].value[1]) {
        abilityNumber = creatureData.abilityNumber[j].number;
      }
    }
    
    for (let j = 0 ; j < abilityNumber ; j++) {
      do {
        abilityDice = dice.die(100);

        ability = {
          "name": "",
          "description": "",
          "subDescription": [],
          "modifier": 0
        };
        
        for (let k = 1 ; k <= Object.keys(creatureData.ability).length ; k++) {
          if (abilityDice >= creatureData.ability[k].value[0] && abilityDice <= creatureData.ability[k].value[1]) {
            ability.name = creatureData.ability[k].name;
            ability.description = creatureData.ability[k].description;

            if (creatureData.ability[k].subdescription !== undefined) {
              abilityDice = dice.die(100);

              for (let l = 1 ; l <= Object.keys(creatureData.ability[k].subdescription).length ; l++) {
                if (abilityDice >= creatureData.ability[k].subdescription[l].value[0] && abilityDice <= creatureData.ability[k].subdescription[l].value[1]) {
                  if (creatureData.ability[k].subdescription[l].name === "2 LANCERS") {
                    abilityTemp = creatureData.ability[k].subdescription[l].name;
                    
                    while (abilityTemp === "2 LANCERS" || findAbility(ability.subDescription, abilityTemp)) {
                      abilityDice = dice.die(100);

                      for (let m = 1 ; m <= Object.keys(creatureData.ability[k].subdescription).length ; m++) {
                        if (abilityDice >= creatureData.ability[k].subdescription[m].value[0] && abilityDice <= creatureData.ability[k].subdescription[m].value[1]) {
                          abilityTemp = creatureData.ability[k].subdescription[m].name;
                        }
                      }
                    }

                    ability.subDescription.push(abilityTemp);

                    abilityTemp = "2 LANCERS";
                    
                    while (abilityTemp === "2 LANCERS" || findAbility(ability.subDescription, abilityTemp)) {
                      abilityDice = dice.die(100);

                      for (let m = 1 ; m <= Object.keys(creatureData.ability[k].subdescription).length ; m++) {
                        if (abilityDice >= creatureData.ability[k].subdescription[m].value[0] && abilityDice <= creatureData.ability[k].subdescription[m].value[1]) {
                          abilityTemp = creatureData.ability[k].subdescription[m].name;
                        }
                      }
                    }

                    ability.subDescription.push(abilityTemp);
                  } else {
                    ability.subDescription.push(creatureData.ability[k].subdescription[l].name);
                  }
                }
              }
            }

            if (creatureData.ability[k].modifier !== undefined) {
              ability.modifier = creatureData.ability[k].modifier;
            }

            if (creatureData.ability[k].subdescription2 !== undefined) {
              abilityDice = dice.die(100);

              for (let l = 1 ; l <= Object.keys(creatureData.ability[k].subdescription2).length ; l++) {
                if (abilityDice >= creatureData.ability[k].subdescription2[l].value[0] && abilityDice <= creatureData.ability[k].subdescription2[l].value[1]) {
                  ability.subDescription.push(creatureData.ability[k].subdescription2[l].name);
                }
              }
            }
          }
        }
      } while (findAbilityBis(abilities, ability.name));

      abilities.push(ability);

      if (abilities[j].name === "Aucune capacité spéciale") {
        abilities.splice(j, 1);
        
        break;
      }
    }
    
    creatures.push({
      "size": size,
      "classification": classification,
      "specialClassification": specialClassification,
      "skills": skills,
      "description": description,
      "abilities": abilities
    });
  }

  return {
    creaturesNumber: creaturesNumber,
    creatures: creatures
  }
}

module.exports = creatureCrafter;