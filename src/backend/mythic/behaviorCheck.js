const dice = require('../dice');
const behaviorData = require('../../data/behavior');
const detailData = require('../../data/detail');
const eventData = require('../../data/event');
const actionRoll = require('./actionRoll');
const descriptionRoll = require('./descriptionRoll');
const adventureCrafter = require('./adventureCrafter');

const behaviorDescriptors = (charactersList, name, activatedDescriptors) => {
  if (charactersList.find(character => character.name === name)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === name) {
        charactersList[i].activatedDescriptors = parseInt(activatedDescriptors);
      }
    }
  }

  return {
    charactersList: charactersList
  }
}  

const behaviorDisposition = (charactersList, name) => {
  let activatedDescriptors = 0;
  let dispositionName = "";
  let dispositionDescription = "";
  let dispositionModifier = "";

  const disposition1 = dice.die(10);
  const disposition2 = dice.die(10);

  if (charactersList.find(character => character.name === name)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === name) {
        activatedDescriptors = charactersList[i].activatedDescriptors;
      }
    }
  }

  const sum = disposition1 + disposition2 + activatedDescriptors;

  for (let i = 1 ; i <= Object.keys(behaviorData.disposition).length ; i++) {
    if (sum >= behaviorData.disposition[i].value[0] && sum <= behaviorData.disposition[i].value[1]) {
      dispositionName = behaviorData.disposition[i].name;
      dispositionDescription = behaviorData.disposition[i].description;
      dispositionModifier = behaviorData.disposition[i].modifier;
    }
  }

  if (charactersList.find(character => character.name === name)) {
    for (let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === name) {
        charactersList[i].disposition = {
          dispositionName: dispositionName,
          dispositionDescription: dispositionDescription,
          dispositionModifier: dispositionModifier,
          dispositionScore: sum
        };
      }
    }
  }

  return {
    charactersList: charactersList,
    dispositionName: dispositionName,
    dispositionDescription: dispositionDescription,
    dispositionModifier: dispositionModifier
  }
}

const behaviorAction = (charactersList, name, plotsList, currentPlot) => {
  let newDisposition = false;
  const action1 = dice.die(10);
  let dispositionModifier = 0;
  let actionName = "";
  let actionDescription = "";
  let actionModifierDisposition = 0;
  let actionModifierAction = 0;
  let action1Action2 = false;
  let dispositionScore = 0;
  let dispositionName = "";
  let dispositionDescription = "";
  let actionNeed = [];
  let descriptor = "";
  let actionDescriptionDescriptor = "";

  if (charactersList.find(character => character.name === name)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === name) {
        dispositionModifier = charactersList[i].disposition.dispositionModifier;
        dispositionScore = charactersList[i].disposition.dispositionScore;
      }
    }
  }

  const sum = action1 + dispositionModifier;

  for (let i = 1 ; i <= Object.keys(behaviorData.actionTable1).length ; i++) {
    if (sum >= behaviorData.actionTable1[i].value[0] && sum <= behaviorData.actionTable1[i].value[1]) {
      actionName = behaviorData.actionTable1[i].name;
      actionDescription = behaviorData.actionTable1[i].description;
      actionModifierDisposition = behaviorData.actionTable1[i].modifierDisposition;
      actionModifierAction = behaviorData.actionTable1[i].modifierAction;
      action1Action2 = behaviorData.actionTable1[i].action2;
    }
  }

  if (actionModifierDisposition !== 0) {
    dispositionScore = dispositionScore + actionModifierDisposition;

    newDisposition = true;
    
    for (let i = 1 ; i <= Object.keys(behaviorData.disposition).length ; i++) {
      if (dispositionScore >= behaviorData.disposition[i].value[0] && dispositionScore <= behaviorData.disposition[i].value[1]) {
        dispositionName = behaviorData.disposition[i].name;
        dispositionDescription = behaviorData.disposition[i].description;
        dispositionModifier = behaviorData.disposition[i].modifier;
      }
    }

    if (charactersList.find(character => character.name === name)) {
      for(let i = 0 ; i < charactersList.length ; i++) {
        if (charactersList[i].name === name) {
          charactersList[i].disposition.dispositionName = dispositionName;
          charactersList[i].disposition.dispositionModifier = dispositionModifier;
          charactersList[i].disposition.dispositionScore = dispositionScore;
        }
      }
    }
  } else if (action1Action2 === true) {
    const action2Dice1 = dice.die(10);
    const action2Dice2 = dice.die(10);

    const sumAction2 = action2Dice1 + action2Dice2 + dispositionModifier + actionModifierAction;

    for (let i = 1 ; i <= Object.keys(behaviorData.actionTable2).length ; i++) {
      if (sumAction2 >= behaviorData.actionTable2[i].value[0] && sumAction2 <= behaviorData.actionTable2[i].value[1]) {
        actionName = behaviorData.actionTable2[i].name;
        actionDescription = behaviorData.actionTable2[i].description;

        for (let j = 0 ; j < behaviorData.actionTable2[i].need.length ; j++) {
          actionNeed[j] = behaviorData.actionTable2[i].need[j];
        }
      }
    }

    for (let j = 0 ; j < actionNeed.length ; j++) {
      if (actionNeed[j] === "descripteur") {
        const descriptorRandom = dice.die(3);
  
        if (descriptorRandom === 1) {
          descriptor = "identity";
        } else if (descriptorRandom === 2) {
          descriptor = "personality";
        } else {
          descriptor = "activity";
        }
  
        let actionDescriptionDescriptor1 = dice.die(100);
        let actionDescriptionDescriptor2 = dice.die(100);
  
        if (descriptor === "identity" || descriptor === "personality") {
          actionDescriptionDescriptor = detailData.descriptionTable1[actionDescriptionDescriptor1].name + " - " + detailData.descriptionTable2[actionDescriptionDescriptor2].name;
        } else if (descriptor === "activity") {
          actionDescriptionDescriptor = eventData.eventAction[actionDescriptionDescriptor1].name + " - " + eventData.eventSubject[actionDescriptionDescriptor2].name;
        }
  
        if (charactersList.find(character => character.name === name)) {
          for(let i = 0 ; i < charactersList.length ; i++) {
            if (charactersList[i].name === name) {
              if (charactersList[i].descriptors[descriptor].length !== 3) {
                charactersList[i].descriptors[descriptor].push(actionDescriptionDescriptor);
  
                charactersList[i].descriptors[descriptor][0] = "2";
              } else {
                if (charactersList[i].descriptors[descriptor][0] === "1") {
                  charactersList[i].descriptors[descriptor][0] = "2";
                } else {
                  charactersList[i].descriptors[descriptor][0] = "1";
                }
              }
            }
          }
        }
      } else if (actionNeed[j] === "action") {
        actionNeed[j] = actionRoll();
      } else if (actionNeed[j] === "description") {
        actionNeed[j] = descriptionRoll();
      } else if (actionNeed[j] === "joueur") {
        actionNeed[j] = adventureCrafter.characterRandom(charactersList, true).name;
      } else if (actionNeed[j] === "intrigue") {
        actionNeed[j] = adventureCrafter.plotRandom(plotsList, false, false, currentPlot).name;
      }
    }
  }

  if (charactersList.find(character => character.name === name)) {
    for(let i = 0 ; i < charactersList.length ; i++) {
      if (charactersList[i].name === name) {
        charactersList[i].action = {
          actionName: actionName,
          actionDescription: actionDescription,
          actionNeed: actionNeed
        };
      }
    }
  }

  return {
    actionName: actionName,
    actionDescription: actionDescription,
    actionNeed: actionNeed,
    dispositionName: dispositionName,
    dispositionDescription: dispositionDescription,
    descriptor: descriptor,
    actionDescriptionDescriptor: actionDescriptionDescriptor,
    newDisposition: newDisposition,
    charactersList: charactersList
  }
}

module.exports = {
  "behaviorDescriptors": behaviorDescriptors,
  "behaviorDisposition": behaviorDisposition,
  "behaviorAction": behaviorAction
};