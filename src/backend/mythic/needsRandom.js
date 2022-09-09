const dice = require('../dice');
const adventureCrafter = require('./adventureCrafter');

const needsRandom = (plotPoints, charactersList, plotsList, currentPlot, archivedCharacters) => {
  let nbPlayer = 0;
  let characterName = "";
  let player = false;
  let travel = [];
  let piecesOr = 0;
  let existedCharacters = [];
  let responseCharacterCreation = {};

  let findName = function(list, name) {
    return list.find(item => item.name === name);
  };


  for (let i = 0 ; i < plotPoints.length ; i++) {
    for (let j = 0 ; j < plotPoints[i].needs.length ; j++) {
      if (plotPoints[i].needs[j].name === "Personnage") {
        let characterDice = dice.die(100);
        let nbCharacters = 0;

        for (let k = 0 ; k < charactersList.length ; k++) {
          if (characterDice >= charactersList[k].value[0] && characterDice <= charactersList[k].value[1]) {
            if (plotPoints[i].name === "LE PERSONNAGE QUITTE L'AVENTURE") {
              if (charactersList[k].name === "Nouveau personnage" || charactersList[k].player === true) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              } else if (charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = charactersList[k].name;
                player = charactersList[k].player;
                travel = charactersList[k].travel;
                piecesOr = charactersList[k].piecesOr;
                
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === characterName) {
                    charactersList[l].name = "Choisissez le personnage le plus logique";
                    charactersList[l].player = false;
                    charactersList[l].travel = {
                      "travelMode": "Pieds",
                      "KMPerDay": 38,
                      "KMPerDay2": 48,
                      "comments": "si 48 = -5 pénalité à la perception passive"
                    };
                    charactersList[l].piecesOr = 100;
                  }
                }
                
                if (findName(charactersList, characterName) === undefined) {
                  archivedCharacters.push({
                    "name": characterName,
                    "player": player,
                    "travel": travel,
                    "piecesOr": piecesOr
                  });
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              }
            } else if (plotPoints[i].name === "RETOUR DE PERSONNAGE") {
              if (archivedCharacters.length === 0) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              } else {
                let characterDice = dice.die(archivedCharacters.length);

                plotPoints[i].needs[j].name = charactersList[characterDice - 1].name;

                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === "Nouveau personnage" || charactersList[l].name === "Choisissez le personnage le plus logique") {
                    charactersList[l].name = charactersList[characterDice - 1].name;
                    charactersList[l].player = charactersList[characterDice - 1].player;
                    charactersList[l].travel = charactersList[characterDice - 1].travel;
                    charactersList[l].piecesOr = charactersList[characterDice - 1].piecesOr;
                    
                    break;
                  }
                }

                archivedCharacters.splice(characterDice - 1, 1);
              }
            } else if (plotPoints[i].name === "LE PERSONNAGE S'INTENSIFIE") {
              if (charactersList[k].name !== "Nouveau personnage" && charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === "Nouveau personnage" || charactersList[l].name === "Choisissez le personnage le plus logique") {
                    charactersList[l].name = charactersList[k].name;
                    charactersList[l].player = charactersList[k].player;
                    charactersList[l].travel = charactersList[k].travel;
                    charactersList[l].piecesOr = charactersList[k].piecesOr;

                    break;
                  }
                }
              }
            } else if (plotPoints[i].name === "LE PERSONNAGE RALENTIT") {
              if (charactersList[k].name !== "Nouveau personnage" || charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === charactersList[k].name) {
                    nbPlayer++;
                  }
                }
              }

              if (charactersList[k].name === "Nouveau personnage" || nbPlayer < 1) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              } else if (charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = charactersList[k].name;
                player = charactersList[k].player;
                travel = charactersList[k].travel;
                piecesOr = charactersList[k].piecesOr;

                charactersList[k].name = "Choisissez le personnage le plus logique";
                charactersList[k].player = false;
                charactersList[k].travel = {
                  "travelMode": "Pieds",
                  "KMPerDay": 38,
                  "KMPerDay2": 48,
                  "comments": "si 48 = -5 pénalité à la perception passive"
                };
                charactersList[k].piecesOr = 100;
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              }
              
              if (findName(charactersList, characterName) === undefined) {
                archivedCharacters.push({
                  "name": characterName,
                  "player": player,
                  "travel": travel,
                  "piecesOr": piecesOr
                });
              }
            } else if (plotPoints[i].name === "PERSONNAGE RÉTROGRADÉ") {
              if (charactersList[k].name !== "Nouveau personnage" || charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === charactersList[k].name) {
                    nbPlayer++;
                  }
                }
              }

              if (charactersList[k].name === "Nouveau personnage" || nbPlayer < 2) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              } else if (charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = charactersList[k].name;
                player = charactersList[k].player;
                travel = charactersList[k].travel;
                piecesOr = charactersList[k].piecesOr;

                charactersList[k].name = "Choisissez le personnage le plus logique";
                charactersList[k].player = false;
                charactersList[k].travel = {
                  "travelMode": "Pieds",
                  "KMPerDay": 38,
                  "KMPerDay2": 48,
                  "comments": "si 48 = -5 pénalité à la perception passive",
                };
                charactersList[k].piecesOr = 100;

                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === characterName) {
                    charactersList[l].name = "Choisissez le personnage le plus logique";
                    charactersList[l].player = false;
                    charactersList[l].travel = {
                      "travelMode": "Pieds",
                      "KMPerDay": 38,
                      "KMPerDay2": 48,
                      "comments": "si 48 = -5 pénalité à la perception passive",
                    };
                    charactersList[l].piecesOr = 100;
                    
                    break;
                  }
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              }
              
              if (findName(charactersList, characterName) === undefined) {
                archivedCharacters.push({
                  "name": characterName,
                  "player": player,
                  "travel": travel,
                  "piecesOr": piecesOr
                });
              }
            } else if (plotPoints[i].name === "PERSONNAGE PROMU") {
              if (charactersList[k].name === "Nouveau personnage")  {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              } else if (charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === "Nouveau personnage" || charactersList[l].name === "Choisissez le personnage le plus logique") {
                    charactersList[l].name = charactersList[k].name;
                    charactersList[l].player = charactersList[k].player;
                    charactersList[l].travel = charactersList[k].travel;
                    charactersList[l].piecesOr = charactersList[k].piecesOr;
                    
                    break;
                  }
                }

                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === "Nouveau personnage" || charactersList[l].name === "Choisissez le personnage le plus logique") {
                    charactersList[l].name = charactersList[k].name;
                    charactersList[l].player = charactersList[k].player;
                    charactersList[l].travel = charactersList[k].travel;
                    charactersList[l].piecesOr = charactersList[k].piecesOr;
                    
                    break;
                  }
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique " + (j + 1);
              }
            } else {
              if (charactersList[k].name !== "Nouveau personnage" && charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < charactersList.length ; l++) {
                  if (charactersList[l].name === charactersList[k].name) {
                    nbCharacters++;
                  }
                }
              }

              if (nbCharacters < 3) {
                if (findName(existedCharacters, charactersList[k].name)) {
                  for (let l = 0 ; l < charactersList.length ; l++) {
                    if (charactersList[l].name === "Nouveau personnage" || charactersList[l].name === "Choisissez le personnage le plus logique") {
                      charactersList[l].name = charactersList[k].name;
                      existedCharacters.push(charactersList[k].name);

                      break;
                    }
                  }
                }
              }

              if (charactersList[k].name === "Choisissez le personnage le plus logique") {
                plotPoints[i].needs[j].name = charactersList[k].name + " " + (j + 1);
              } else if (charactersList[k].name === "Nouveau personnage") {
                responseCharacterCreation = adventureCrafter.characterCreation(charactersList, plotPoints, plotPoints[i].name, j);
                plotPoints = responseCharacterCreation.plotPoints;
                charactersList = responseCharacterCreation.charactersList;
              } else {
                plotPoints[i].needs[j].name = charactersList[k].name;
              }
            }
          }
        }
      } else if (plotPoints[i].needs[j].name === "Intrigue") {
        let plotDice = dice.die(100);
        let nbPlots = 0;

        for (let k = 0 ; k < plotsList.length ; k++) {
          if (plotDice >= plotsList[k].value[0] && plotDice <= plotsList[k].value[1]) {

            for (let l = 0 ; l < plotsList.length ; l++) {
              if (plotsList[l].name !== "Choisissez l'intrigue la plus logique" || plotsList[l].name !== "Nouvelle intrigue") {
                nbPlots++;
              }
            }

            if (plotsList[k].name === currentPlot) {
              plotPoints[i].needs[j].name = "Choisissez l'intrigue la plus logique " + (j + 1);
            } else if (nbPlots === 0) {
              plotPoints[i].needs[j].name = "Nouvelle intrigue " + (j + 1);
            } else {
              if (plotsList[k].name === "Choisissez l'intrigue la plus logique" || plotsList[k].name === "Nouvelle intrigue") {
                plotPoints[i].needs[j].name = plotsList[k].name + " " + (j + 1);
              } else {
                plotPoints[i].needs[j].name = plotsList[k].name;
              }
            }
          }
        }
      }
    }
  }

  return {
    plotPoints: plotPoints,
    charactersList: charactersList,
    plotsList: plotsList,
    currentPlot: currentPlot,
    archivedCharacters: archivedCharacters
  }
}

module.exports = {
  "needsRandom": needsRandom
};