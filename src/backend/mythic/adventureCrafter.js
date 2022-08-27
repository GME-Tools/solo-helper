const dice = require('../dice');
const adventureData = require('../../data/adventurecrafter');
const plotPointsData = require('../../data/plotPoints');
const needsRandom = require('./needsRandom');
const generator = require('../generator');

const themeCreation = (data, themesPlayer) => {
  let themeName = "";
  let themeDescription = "";
  let themes = [];
  let values = [
    [1,4],
    [5,7],
    [8,9],
    [10,10],
    [10,10]
  ];
  let isExisted = false;

  let findName = function(themes, themeName) {
    return themes.find(theme => theme.name === themeName);
  };
  
  if (data.themes.length === 0) {
    if (themesPlayer.length > 0) {
      for (let i = 0 ; i <= themesPlayer.length ; i++) {
        for (let j = 1 ; j <= Object.keys(adventureData.randomThemesTable).length ; j++) {
          if (themesPlayer[i] === adventureData.randomThemesTable[j].name) {
            themes.push({"name": adventureData.randomThemesTable[j].name, "description": adventureData.randomThemesTable[j].description, "values": values[themes.length]});
          }
        }
      } 
    }

    while (themes.length < 5) {
      let themesDice = dice.die(10);

      for (let i = 1 ; i <= Object.keys(adventureData.randomThemesTable).length ; i++) {
        if (themesDice >= adventureData.randomThemesTable[i].value[0] && themesDice <= adventureData.randomThemesTable[i].value[1]) {
          themeName = adventureData.randomThemesTable[i].name;
          themeDescription = adventureData.randomThemesTable[i].description;

          if (themes.length > 0) {
            while (findName(themes, adventureData.randomThemesTable[i].name) !== undefined) {
              if (i === 5) {
                i = 1;
              } else {
                i++;
              }
            }
            
            themeName = adventureData.randomThemesTable[i].name;
            themeDescription = adventureData.randomThemesTable[i].description;
          }

          themes.push({"name": themeName, "description": themeDescription, "values": values[themes.length]});

          break;
        }
      }
    }
    
    themes[3].alternated = true;
    themes[4].alternated = false;
  } else {
    themes = data.themes;

    isExisted = true;
  }

  return {
    themes: themes,
    isExisted: isExisted
  }
}

const themeList = (data) => {
  let themes = [];
  let isExisted = false;

  if (data.themes.length !== 0 && data.themes !== undefined) {
    themes = data.themes;

    isExisted = true;
  }

  return {
    themes: themes,
    isExisted: isExisted
  }
}

const characterRandom = (data) => {
  let characterDice = dice.die(100);
  let characterName = "";

  for (let i = 0 ; i < data.charactersList.length ; i++) {
    if (characterDice >= data.charactersList[i].value[0] && characterDice <= data.charactersList[i].value[1]) {
      characterName = data.charactersList[i].name;
    }
  }

  return {
    name: characterName
  }
}

const plotRandom = (data, add) => {
  let plotDice = dice.die(100);
  let plotName = "";

  for (let i = 0 ; i < data.plotsList.length ; i++) {
    if (plotDice >= data.plotsList[i].value[0] && plotDice <= data.plotsList[i].value[1]) {
      plotName = data.plotsList[i].name;
    }
  }

  if (add === true && (plotName !== "Nouvelle intrigue" && plotName !== "Choisissez l'intrigue la plus logique")) {
    let nbPlots = 0;

    if (data.plotsList.find (plot => plot.name === plotName)) {
      for (let i = 0 ; i < data.plotsList.length ; i++) {
        if (data.plotsList[i].name === plotName) {
          nbPlots++;
        }
      }
    }
    
    if (nbPlots < 3) {
      for (let i = 0 ; i < data.plotsList.length ; i++) {
        if (data.plotsList[i].name === "Nouvelle intrigue" || data.plotsList[i].name === "Choisissez l'intrigue la plus logique") {
          data.plotsList[i].name = plotName;
          break;
        }
      }
    }
  }

  if (add === true) {
    data.currentPlot = plotName;
  }

  return {
    name: plotName
  }
}

const characterList = (data) => {
  let characterNames = [];
  
  for (let i = 0 ; i < data.charactersList.length ; i++) {
    characterNames.push(data.charactersList[i].name);
  }
  
  return {
    names: characterNames
  }
}

const plotList = (data) => {
  let plotNames = [];
  
  for (let i = 0 ; i < data.plotsList.length ; i++) {
    plotNames.push(data.plotsList[i].name);
  }
  
  return {
    names: plotNames
  }
}

const characterOccurrences = (data, character) => {
  let numberOf = 0;
  
  for (let i = 0 ; i < data.charactersList.length ; i++) {
    if (data.charactersList[i].name === character) {
      numberOf++;
    }
  }
  
  return {
    numberOf: numberOf
  }
}

const plotOccurrences = (data, plot) => {
  let numberOf = 0;
  
  for (let i = 0 ; i < data.plotsList.length ; i++) {
    if (data.plotsList[i].name === plot) {
      numberOf++;
    }
  }
  
  return {
    numberOf: numberOf
  }
}

const characterAdd = (charactersList, characterName, isPlayer) => {
  let nbCharacters = 0;
  let full = false;

  if (charactersList.find (character => character.name === characterName)) {
    for (let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === characterName) {
        nbCharacters++;
      }
    }
  }

  if (nbCharacters < 3 && (characterName !== "Nouveau personnage" && characterName !== "Choisissez le personnage le plus logique")) {
    for (let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === "Nouveau personnage" || charactersList[i].name === "Choisissez le personnage le plus logique") {
        if (charactersList.find (character => character.name === characterName)) {
          for (let j = 0 ; j < charactersList.length ; j++) {
            if (charactersList[j].name === characterName) {
              charactersList[i].name = charactersList[j].name;
              charactersList[i].player = charactersList[j].player;
              charactersList[i].travel = charactersList[j].travel;
              charactersList[i].piecesOr = charactersList[j].piecesOr;
              charactersList[i].characterSpecialTraitName = charactersList[j].characterSpecialTraitName;
              charactersList[i].characterSpecialTraitDescription = charactersList[j].characterSpecialTraitDescription;
              charactersList[i].characterIdentityName = charactersList[j].characterIdentityName;
              charactersList[i].characterDescriptorsName = charactersList[j].characterDescriptorsName;
            }
          }
        } else {
          let travel = {
            "travelMode": "Pieds",
            "KMPerDay": 38,
            "KMPerDay2": 48,
            "comments": "si 48 = -5 pénalité à la perception passive",
          }
        
          charactersList[i].name = characterName;
          charactersList[i].player = isPlayer;
          charactersList[i].travel = travel;
          charactersList[i].piecesOr = 100;

          charactersList[i].characterSpecialTraitName = "";
          charactersList[i].characterSpecialTraitDescription = "";
          charactersList[i].characterIdentityName = [];
          charactersList[i].characterDescriptorsName = [];
        }

        break;
      }
    }
  } else {
    full = true;
  }
  
  return {
    charactersList: charactersList,
    full: full
  }
}

const plotAdd = (plotsList, plotName) => {
  let nbPlots = 0;
  let full = false;

  if (plotsList.find (plot => plot.name === plotName)) {
    for (let i = 0 ; i < plotsList.length ; i++) {
      if (plotsList[i].name === plotName) {
        nbPlots++;
      }
    }
  }

  if (nbPlots < 3 && (plotName !== "Nouvelle intrigue" && plotName !== "Choisissez l'intrigue la plus logique")) {
    for (let i = 0 ; i < plotsList.length ; i++) {
      if (plotsList[i].name === "Nouvelle intrigue" || plotsList[i].name === "Choisissez l'intrigue la plus logique") {
        plotsList[i].name = plotName;
        break;
      }
    }
  } else {
    full = true;
  }
  
  return {
    plotsList: plotsList,
    full: full
  }
}

const characterUpdate = (charactersList, nameOld, nameNew, isPlayer) => {
  if (charactersList.find(character => character.name === nameOld)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === nameOld) {
        charactersList[i].name = nameNew;
        charactersList[i].player = isPlayer;
      }
    }
  }

  return {
    charactersList: charactersList
  }
}

const plotUpdate = (plotsList, plotOld, plotNew) => {
  if (plotsList.find(plot => plot.name === plotOld)) {
    for(let i = 0 ; i < plotsList.length ; i++) {
      if (plotsList[i].name === plotOld) {
        plotsList[i].name = plotNew;
      }
    }
  }
  
  return {
    plotsList: plotsList
  }
}

const characterDelete = (charactersList, archivedCharacters, characterName) => {
  let name = "";
  let player = false;
  let travel = [];
  let piecesOr = 0;
  let characterSpecialTraitName = "";
  let characterSpecialTraitDescription = "";
  let characterIdentityName = [];
  let characterDescriptorsName = [];
  let empty = false;
  
  if (charactersList.find(character => character.name === characterName)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === characterName) {
        name = charactersList[i].name;
        player = charactersList[i].player;
        travel = charactersList[i].travel;
        piecesOr = charactersList[i].piecesOr;

        characterSpecialTraitName = charactersList[i].characterSpecialTraitName;
        characterSpecialTraitDescription = charactersList[i].characterSpecialTraitDescription;
        characterIdentityName = charactersList[i].characterIdentityName;
        characterDescriptorsName = charactersList[i].characterDescriptorsName;

        charactersList[i].name = "Choisissez le personnage le plus logique";
        
        break;
      }
    }
  }

  if (charactersList.find(character => character.name === characterName) === undefined) {
    archivedCharacters.push({
      "name" : name,
      "player": player,
      "travel": travel,
      "piecesOr": piecesOr,
      "characterSpecialTraitName": characterSpecialTraitName,
      "characterSpecialTraitDescription": characterSpecialTraitDescription,
      "characterIdentityName": characterIdentityName,
      "characterDescriptorsName": characterDescriptorsName
    });

    empty = true;
  }
  
  return {
    charactersList: charactersList,
    archivedCharacters: archivedCharacters,
    empty: empty
  }
}

const plotDelete = (plotsList, plotName) => {
  let empty = false;
  
  if (plotsList.find(plot => plot.name === plotName)) {
    for(let i = 0 ; i < plotsList.length ; i++) {
      if (plotsList[i].name === plotName) {
        plotsList[i].name = "Choisissez l'intrigue la plus logique";
        
        break;
      }
    }
  }

  if (plotsList.find(plot => plot.name === plotName) === undefined) {
    empty = true;
  }
  
  return {
    plotsList: plotsList,
    empty: empty
  }
}

const themeRandom = (themes) => {
  let themeName = "";
  let themeDescription = "";
  let themeDice = dice.die(10);
  let isExisted = false;

  if (themes.length > 0) {
    for (let i = 0 ; i < themes.length ; i++) {
      if (themeDice >= themes[i].values[0] && themeDice <= themes[i].values[1]) {
        if (themeDice === 10) {
          if (themes[3].alternated === true) {
            themeName = themes[3].name;
            themeDescription = themes[3].description;
            themes[3].alternated = false;
            themes[4].alternated = true;
          } else {
            themeName = themes[4].name;
            themeDescription = themes[4].description;
            themes[4].alternated = false;
            themes[3].alternated = true;
          }
          
          break;
        } else {
          themeName = themes[i].name;
          themeDescription = themes[i].description;
        }
      }
    }

    isExisted = true;
    
  }
  
  return {
    themeName: themeName,
    themeDescription: themeDescription,
    isExisted: isExisted
  }
}

const characterInformation = (charactersList, characterName) => {
  let name = "";
  let player = false;
  let travel = [];
  let piecesOr = 0;
  let characterSpecialTraitName = "";
  let characterSpecialTraitDescription = "";
  let characterIdentityName = [];
  let characterDescriptorsName = [];
  
  for (let i = 0 ; i < charactersList.length ; i++) {
    if (charactersList[i].name === characterName) {
      name = charactersList[i].name;
      player = charactersList[i].player;
      travel = charactersList[i].travel;
      piecesOr = charactersList[i].piecesOr;
      characterSpecialTraitName = charactersList[i].characterSpecialTraitName;
      characterSpecialTraitDescription = charactersList[i].characterSpecialTraitDescription;
      characterIdentityName = charactersList[i].characterIdentityName;
      characterDescriptorsName = charactersList[i].characterDescriptorsName;

      break;
    }
  }
  
  return {
    name: name,
    player: player,
    travel: travel,
    piecesOr: piecesOr,
    characterSpecialTraitName: characterSpecialTraitName,
    characterSpecialTraitDescription: characterSpecialTraitDescription,
    characterIdentityName: characterIdentityName,
    characterDescriptorsName: characterDescriptorsName
  }
}

const plotPoints = (plotPoints, charactersList, plotsList, currentPlot, themes, archivedCharacters) => {
  let plotPointsName = [];
  let plotPointsDescription = [];
  let plotPointsNeeds = [];
  let plotPointsDice = 0;
  let plotPointsValue = "";
  let none = 0;
  let themeName = "";
  let themeDice = 0;

  while (plotPointsName.length < 5) {
    themeDice = dice.die(10);

    for (let i = 0 ; i < themes.length ; i++) {
      if (themeDice >= themes[i].values[0] && themeDice <= themes[i].values[1]) {
        if (themeDice === 10) {
          if (themes[3].alternated === true) {
            themeName = themes[3].name;
            themes[3].alternated = false;
            themes[4].alternated = true;
          } else {
            themeName = themes[4].name;
            themes[4].alternated = false;
            themes[3].alternated = true;
          }
          
          break;
        } else {
          themeName = themes[i].name;

          break;
        }
      }
    }

    if (themeName === "ACTION") {
      plotPointsValue = "valueAction";
    } else if (themeName === "TENSION") {
      plotPointsValue = "valueTension";
    } else if (themeName === "MYSTÈRE") {
      plotPointsValue = "valueMystery";
    } else if (themeName === "SOCIAL") {
      plotPointsValue = "valueSocial";
    } else if (themeName === "PERSONNEL") {
      plotPointsValue = "valuePersonal";
    }

    plotPointsDice = dice.die(100);
  
    for (let i = 1 ; i <= Object.keys(plotPointsData.plotPointsTable).length ; i++) {
      if (plotPointsDice >= plotPointsData.plotPointsTable[i][plotPointsValue][0] && plotPointsDice <= plotPointsData.plotPointsTable[i][plotPointsValue][1]) {
        let metaName = "";
        let metaDescription = "";
        
        if (plotPointsData.plotPointsTable[i].name === "META") {
          let nbNPC = 0;

          do {
            let metaDice = dice.die(100);
            
            for (let j = 1 ; j <= Object.keys(plotPointsData.plotPointsTable[i].meta).length ; j++) {
              if (metaDice >= plotPointsData.plotPointsTable[i].meta[j].value[0] && metaDice <= plotPointsData.plotPointsTable[i].meta[j].value[1]) {
                plotPointsName.push(plotPointsData.plotPointsTable[i].meta[j].name);
                metaName = plotPointsData.plotPointsTable[i].meta[j].name;

                plotPointsDescription.push(plotPointsData.plotPointsTable[i].meta[j].description);
                metaDescription = plotPointsData.plotPointsTable[i].meta[j].description;

                let needsTemp = [];

                for (let k = 0 ; k < Object.keys(plotPointsData.plotPointsTable[i].meta[j].need).length ; k++) {
                  needsTemp.push({
                    "name": plotPointsData.plotPointsTable[i].meta[j].need[k],
                    "type": plotPointsData.plotPointsTable[i].meta[j].need[k]
                  });
                }

                plotPointsNeeds.push(needsTemp);
              }
            }

            for (let j = 0 ; j < charactersList.length ; j++) {
              if (charactersList[j].player === false) {
                nbNPC++;
              }
            }
          } while ((metaName === "LE PERSONNAGE QUITTE L'AVENTURE" && nbNPC > 0) || ((metaName === "LE PERSONNAGE RALENTIT" || metaName === "PERSONNAGE RÉTROGRADÉ") && nbNPC > 0));
        } else if (plotPointsData.plotPointsTable[i].name === "RIEN") {
          if (none < 4) {
            plotPointsName.push(plotPointsData.plotPointsTable[i].name);
            plotPointsDescription.push(plotPointsData.plotPointsTable[i].description);

            let needsTemp = [];

            for (let j = 0 ; j < Object.keys(plotPointsData.plotPointsTable[i].need).length ; j++) {
              needsTemp.push({
                "name": plotPointsData.plotPointsTable[i].need[j],
                "type": plotPointsData.plotPointsTable[i].need[j]
              });
            }
            
            plotPointsNeeds.push(needsTemp);

            none++;
          } else {
            continue;
          }
        } else if (plotPointsData.plotPointsTable[i].name === "CONCLUSION" && plotPointsName.find(name => name === plotPointsData.plotPointsTable[i].name) === undefined) {
          if (plotsList.find(plot => plot.name === currentPlot)) {
            for(let j = 0 ; j < plotsList.length ; j++) {
              if (plotsList[j].name === currentPlot) {
                plotsList[j].name = "Choisissez l'intrigue la plus logique";
              }
            }
          }

          if (plotPointsData.plotPointsTable[i].name === "META") {
            plotPointsDescription.push(metaName);
            plotPointsDescription.push(metaDescription);
          } else {
            plotPointsName.push(plotPointsData.plotPointsTable[i].name);
            plotPointsDescription.push(plotPointsData.plotPointsTable[i].description);
          }
          
          let needsTemp = [];

          for (let j = 0 ; j < Object.keys(plotPointsData.plotPointsTable[i].need).length ; j++) {
            needsTemp.push({
              "name": plotPointsData.plotPointsTable[i].need[j],
              "type": plotPointsData.plotPointsTable[i].need[j]
            });
          }
          
          plotPointsNeeds.push(needsTemp);
        } else if (plotPointsName.find(name => name === plotPointsData.plotPointsTable[i].name) === undefined) {
          plotPointsName.push(plotPointsData.plotPointsTable[i].name);
          plotPointsDescription.push(plotPointsData.plotPointsTable[i].description);

          let needsTemp = [];

          for (let j = 0 ; j < Object.keys(plotPointsData.plotPointsTable[i].need).length ; j++) {
            needsTemp.push({
              "name": plotPointsData.plotPointsTable[i].need[j],
              "type": plotPointsData.plotPointsTable[i].need[j]
            });
          }

          plotPointsNeeds.push(needsTemp);
        }

        break;
      }
    }
  }

  plotPoints = [];
  
  for (let i = 0 ; i < plotPointsName.length ; i++) {
    plotPoints.push({
      "name": plotPointsName[i],
      "description": plotPointsDescription[i],
      "needs": plotPointsNeeds[i]
    });
  }

  let plotPointsList = needsRandom.needsRandom(plotPoints, charactersList, plotsList, currentPlot, archivedCharacters);
  
  return {
    plotPointsList: plotPointsList
  }
}

const plotPointsRead = (plotPoints) => {
  let plotPointsName = [];
  let plotPointsDescription = [];
  let plotPointsNeeds = [];
  
  for (let i = 0 ; i < plotPoints.length ; i++) {
    plotPointsName.push(plotPoints[i].name);
    plotPointsDescription.push(plotPoints[i].description);
    plotPointsNeeds.push(plotPoints[i].needs);
  }
  
  return {
    name: plotPointsName,
    description: plotPointsDescription,
    needs: plotPointsNeeds
  }
}

const plotPointsUpdate = (plotPoints, plotPoint, need, newNeed) => {
  plotPoints.find(item => item.name === plotPoint).needs.find(item => item.name === need).name = newNeed;
  
  return {
    plotPoints: plotPoints
  }
}

const characterCreation = (charactersList, plotPoints, plotPoint, need, name) => {
  let characterSpecialTraitDice = dice.die(100);
  let characterIdentityDice = dice.die(100);
  let characterDescriptorsDice = dice.die(100);
  let randomNumber = dice.die(4) + 1;

  plotPoints.find(item => item.name === plotPoint).needs[need].name = generator.nameGenerator(randomNumber);

  for (let i = 0 ; i < charactersList.length ; i++) {
    if (charactersList[i].name === "Nouveau personnage" || charactersList[i].name === "Choisissez le personnage le plus logique") {
      let travel = {
        "travelMode": "Pieds",
        "KMPerDay": 38,
        "KMPerDay2": 48,
        "comments": "si 48 = -5 pénalité à la perception passive",
      }
    
      charactersList[i].name = plotPoints.find(item => item.name === plotPoint).needs[need].name;
      charactersList[i].player = false;
      charactersList[i].travel = travel;
      charactersList[i].piecesOr = 100;

      charactersList[i].characterSpecialTraitName = "";
      charactersList[i].characterSpecialTraitDescription = "";
      charactersList[i].characterIdentityName = [];
      charactersList[i].characterDescriptorsName = [];

      for (let j = 1 ; j <= Object.keys(adventureData.characterSpecialTraitTable).length ; j++) {
        if (characterSpecialTraitDice >= adventureData.characterSpecialTraitTable[j].value[0] && characterSpecialTraitDice <= adventureData.characterSpecialTraitTable[j].value[1]) {
          charactersList[i].characterSpecialTraitName = adventureData.characterSpecialTraitTable[j].name;
          charactersList[i].characterSpecialTraitDescription = adventureData.characterSpecialTraitTable[j].description;
        }
      }

      for (let j = 1 ; j <= Object.keys(adventureData.characterIdentityTable).length ; j++) {
        if (characterIdentityDice >= adventureData.characterIdentityTable[j].value[0] && characterIdentityDice <= adventureData.characterIdentityTable[j].value[1]) {
          if (adventureData.characterIdentityTable[j].name === "Jetez les dés pour deux identités") {
            let characterIdentityDice2 = dice.die(67) + 33;

            for (let k = 1 ; k <= Object.keys(adventureData.characterIdentityTable).length ; k++) {
              if (characterIdentityDice2 >= adventureData.characterIdentityTable[k].value[0] && characterIdentityDice2 <= adventureData.characterIdentityTable[k].value[1]) {
                charactersList[i].characterIdentityName.push(adventureData.characterIdentityTable[k].name);
              }
            }

            let characterIdentityDice3 = dice.die(67) + 33;

            for (let k = 1 ; k <= Object.keys(adventureData.characterIdentityTable).length ; k++) {
              if (characterIdentityDice3 >= adventureData.characterIdentityTable[k].value[0] && characterIdentityDice3 <= adventureData.characterIdentityTable[k].value[1]) {
                charactersList[i].characterIdentityName.push(adventureData.characterIdentityTable[k].name);
              }
            }
          } else {
            charactersList[i].characterIdentityName.push(adventureData.characterIdentityTable[j].name);
          }
        }
      }

      for (let j = 1 ; j <= Object.keys(adventureData.characterDescriptorsTable).length ; j++) {
        if (characterDescriptorsDice >= adventureData.characterDescriptorsTable[j].value[0] && characterDescriptorsDice <= adventureData.characterDescriptorsTable[j].value[1]) {
          if (adventureData.characterDescriptorsTable[j].name === "Jetez les dés pour deux identités") {
            let characterDescriptorsDice2 = dice.die(67) + 33;

            for (let k = 1 ; k <= Object.keys(adventureData.characterDescriptorsTable).length ; k++) {
              if (characterDescriptorsDice2 >= adventureData.characterDescriptorsTable[k].value[0] && characterDescriptorsDice2 <= adventureData.characterDescriptorsTable[k].value[1]) {
                charactersList[i].characterDescriptorsName.push(adventureData.characterDescriptorsTable[k].name);
              }
            }

            let characterDescriptorsDice3 = dice.die(67) + 33;

            for (let k = 1 ; k <= Object.keys(adventureData.characterDescriptorsTable).length ; k++) {
              if (characterDescriptorsDice3 >= adventureData.characterDescriptorsTable[k].value[0] && characterDescriptorsDice3 <= adventureData.characterDescriptorsTable[k].value[1]) {
                charactersList[i].characterDescriptorsName.push(adventureData.characterDescriptorsTable[k].name);
              }
            }
          } else {
            charactersList[i].characterDescriptorsName.push(adventureData.characterDescriptorsTable[j].name);
          }
        }
      }

      break;
    }
  }
  
  return {
    plotPoints: plotPoints,
    charactersList: charactersList
  }
}

module.exports = {
  "themeCreation": themeCreation,
  "themeList": themeList,
  "characterRandom": characterRandom,
  "plotRandom": plotRandom,
  "characterList": characterList,
  "plotList": plotList,
  "characterOccurrences": characterOccurrences,
  "plotOccurrences": plotOccurrences,
  "characterAdd": characterAdd,
  "plotAdd": plotAdd,
  "characterUpdate": characterUpdate,
  "plotUpdate": plotUpdate,
  "characterDelete": characterDelete,
  "plotDelete": plotDelete,
  "themeRandom": themeRandom,
  "characterInformation": characterInformation,
  "plotPoints": plotPoints,
  "plotPointsRead": plotPointsRead,
  "plotPointsUpdate": plotPointsUpdate,
  "characterCreation": characterCreation
};

exports.characterCreation = characterCreation;