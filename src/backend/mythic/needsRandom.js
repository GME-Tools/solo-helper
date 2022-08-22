const dice = require('../dice');

const needsRandom = (campaign, plotPoints) => {
  let nbPlayer = 0;
  let characterName = "";
  let player = false;
  let travel = [];
  let piecesOr = 0;
  let existedCharacters = [];

  let findName = function(list, name) {
    return list.find(item => item.name === name);
  };


  for (let i = 0 ; i < plotPoints.length ; i++) {
    for (let j = 0 ; j < plotPoints[i].needs.length ; j++) {
      if (plotPoints[i].needs[j].name === "Personnage") {
        let characterDice = dice.die(100);
        let nbCharacters = 0;

        for (let k = 0 ; k < campaign.charactersList.length ; k++) {
          if (characterDice >= campaign.charactersList[k].value[0] && characterDice <= campaign.charactersList[k].value[1]) {
            if (plotPoints[i].name === "LE PERSONNAGE QUITTE L'AVENTURE") {
              if (campaign.charactersList[k].name === "Nouveau personnage" || campaign.charactersList[k].player === true) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              } else if (campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = campaign.charactersList[k].name;
                player = campaign.charactersList[k].player;
                travel = campaign.charactersList[k].travel;
                piecesOr = campaign.charactersList[k].piecesOr;
                
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === characterName) {
                    campaign.charactersList[l].name = "Choisissez le personnage le plus logique";
                    campaign.charactersList[l].player = false;
                    campaign.charactersList[l].travel = {
                      "travelMode": "Pieds",
                      "KMPerDay": 38,
                      "KMPerDay2": 48,
                      "comments": "si 48 = -5 pénalité à la perception passive"
                    };
                    campaign.charactersList[l].piecesOr = 100;
                  }
                }
                
                if (findName(campaign.charactersList, characterName) === undefined) {
                  campaign.archivedCharacters.push({
                    "name": characterName,
                    "player": player,
                    "travel": travel,
                    "piecesOr": piecesOr
                  });
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              }
            } else if (plotPoints[i].name === "RETOUR DE PERSONNAGE") {
              if (campaign.archivedCharacters.length === 0) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              } else {
                let characterDice = dice.die(campaign.archivedCharacters.length);

                plotPoints[i].needs[j].name = campaign.charactersList[characterDice - 1].name;

                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === "Nouveau personnage" || campaign.charactersList[l].name === "Choisissez le personnage le plus logique") {
                    campaign.charactersList[l].name = campaign.charactersList[characterDice - 1].name;
                    campaign.charactersList[l].player = campaign.charactersList[characterDice - 1].player;
                    campaign.charactersList[l].travel = campaign.charactersList[characterDice - 1].travel;
                    campaign.charactersList[l].piecesOr = campaign.charactersList[characterDice - 1].piecesOr;
                    
                    break;
                  }
                }

                campaign.archivedCharacters.splice(characterDice - 1, 1);
              }
            } else if (plotPoints[i].name === "LE PERSONNAGE S'INTENSIFIE") {
              if (campaign.charactersList[k].name !== "Nouveau personnage" && campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === "Nouveau personnage" || campaign.charactersList[l].name === "Choisissez le personnage le plus logique") {
                    campaign.charactersList[l].name = campaign.charactersList[k].name;
                    campaign.charactersList[l].player = campaign.charactersList[k].player;
                    campaign.charactersList[l].travel = campaign.charactersList[k].travel;
                    campaign.charactersList[l].piecesOr = campaign.charactersList[k].piecesOr;

                    break;
                  }
                }
              }
            } else if (plotPoints[i].name === "LE PERSONNAGE RALENTIT") {
              if (campaign.charactersList[k].name !== "Nouveau personnage" || campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === campaign.charactersList[k].name) {
                    nbPlayer++;
                  }
                }
              }

              if (campaign.charactersList[k].name === "Nouveau personnage" || nbPlayer < 1) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              } else if (campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = campaign.charactersList[k].name;
                player = campaign.charactersList[k].player;
                travel = campaign.charactersList[k].travel;
                piecesOr = campaign.charactersList[k].piecesOr;

                campaign.charactersList[k].name = "Choisissez le personnage le plus logique";
                campaign.charactersList[k].player = false;
                campaign.charactersList[k].travel = {
                  "travelMode": "Pieds",
                  "KMPerDay": 38,
                  "KMPerDay2": 48,
                  "comments": "si 48 = -5 pénalité à la perception passive"
                };
                campaign.charactersList[k].piecesOr = 100;
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              }
              
              if (findName(campaign.charactersList, characterName) === undefined) {
                campaign.archivedCharacters.push({
                  "name": characterName,
                  "player": player,
                  "travel": travel,
                  "piecesOr": piecesOr
                });
              }
            } else if (plotPoints[i].name === "PERSONNAGE RÉTROGRADÉ") {
              if (campaign.charactersList[k].name !== "Nouveau personnage" || campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === campaign.charactersList[k].name) {
                    nbPlayer++;
                  }
                }
              }

              if (campaign.charactersList[k].name === "Nouveau personnage" || nbPlayer < 2) {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              } else if (campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                characterName = campaign.charactersList[k].name;
                player = campaign.charactersList[k].player;
                travel = campaign.charactersList[k].travel;
                piecesOr = campaign.charactersList[k].piecesOr;

                campaign.charactersList[k].name = "Choisissez le personnage le plus logique";
                campaign.charactersList[k].player = false;
                campaign.charactersList[k].travel = {
                  "travelMode": "Pieds",
                  "KMPerDay": 38,
                  "KMPerDay2": 48,
                  "comments": "si 48 = -5 pénalité à la perception passive",
                };
                campaign.charactersList[k].piecesOr = 100;

                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === characterName) {
                    campaign.charactersList[l].name = "Choisissez le personnage le plus logique";
                    campaign.charactersList[l].player = false;
                    campaign.charactersList[l].travel = {
                      "travelMode": "Pieds",
                      "KMPerDay": 38,
                      "KMPerDay2": 48,
                      "comments": "si 48 = -5 pénalité à la perception passive",
                    };
                    campaign.charactersList[l].piecesOr = 100;
                    
                    break;
                  }
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              }
              
              if (findName(campaign.charactersList, characterName) === undefined) {
                campaign.archivedCharacters.push({
                  "name": characterName,
                  "player": player,
                  "travel": travel,
                  "piecesOr": piecesOr
                });
              }
            } else if (plotPoints[i].name === "PERSONNAGE PROMU") {
              if (campaign.charactersList[k].name === "Nouveau personnage")  {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              } else if (campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === "Nouveau personnage" || campaign.charactersList[l].name === "Choisissez le personnage le plus logique") {
                    campaign.charactersList[l].name = campaign.charactersList[k].name;
                    campaign.charactersList[l].player = campaign.charactersList[k].player;
                    campaign.charactersList[l].travel = campaign.charactersList[k].travel;
                    campaign.charactersList[l].piecesOr = campaign.charactersList[k].piecesOr;
                    
                    break;
                  }
                }

                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === "Nouveau personnage" || campaign.charactersList[l].name === "Choisissez le personnage le plus logique") {
                    campaign.charactersList[l].name = campaign.charactersList[k].name;
                    campaign.charactersList[l].player = campaign.charactersList[k].player;
                    campaign.charactersList[l].travel = campaign.charactersList[k].travel;
                    campaign.charactersList[l].piecesOr = campaign.charactersList[k].piecesOr;
                    
                    break;
                  }
                }
              } else {
                plotPoints[i].needs[j].name = "Choisissez le personnage le plus logique";
              }
            } else {
              if (campaign.charactersList[k].name !== "Nouveau personnage" && campaign.charactersList[k].name !== "Choisissez le personnage le plus logique") {
                for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                  if (campaign.charactersList[l].name === campaign.charactersList[k].name) {
                    nbCharacters++;
                  }
                }
              }

              if (nbCharacters < 3) {
                if (existedCharacters.find(character => character === campaign.charactersList[k].name) === undefined) {
                  for (let l = 0 ; l < campaign.charactersList.length ; l++) {
                    if (campaign.charactersList[l].name === "Nouveau personnage" || campaign.charactersList[l].name === "Choisissez le personnage le plus logique") {
                      campaign.charactersList[l].name = campaign.charactersList[k].name;
                      existedCharacters.push(campaign.charactersList[k].name);

                      break;
                    }
                  }
                }
              }

              plotPoints[i].needs[j].name = campaign.charactersList[k].name;
            }
          }
        }
      } else if (plotPoints[i].needs[j].name === "Intrigue") {
        let plotDice = dice.die(100);
        let nbPlots = 0;

        for (let k = 0 ; k < campaign.plotsList.length ; k++) {
          if (plotDice >= campaign.plotsList[k].value[0] && plotDice <= campaign.plotsList[k].value[1]) {

            for (let l = 0 ; l < campaign.plotsList.length ; l++) {
              if (campaign.plotsList[l].name !== "Choisissez l'intrigue la plus logique" || campaign.plotsList[l].name !== "Nouvelle intrigue") {
                nbPlots++;
              }
            }

            if (campaign.plotsList[k].name === campaign.currentPlot) {
              plotPoints[i].needs[j].name = "Choisissez l'intrigue la plus logique";
            } else if (nbPlots === 0) {
              plotPoints[i].needs[j].name = "Nouvelle intrigue";
            } else {
              plotPoints[i].needs[j].name = campaign.plotsList[k].name;
            }
          }
        }
      }
    }
  }

  return {
    plotPoints: plotPoints
  }
}

module.exports = {
  "needsRandom": needsRandom
};