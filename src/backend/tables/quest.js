const dice = require('../dice');
const questData = require('../../data/quest');

const createQuest = function() {
  let questProblem = "";
  let questResultant = "";
  let questSource = "";
  let questProblemRoll = dice.die(100);
  let questSourceRoll = dice.die(100);

  for (let i = 1 ; i <= Object.keys(questData.questsTable).length ; i++) {
    if (questProblemRoll >= questData.questsTable[i].value[0] && questProblemRoll <= questData.questsTable[i].value[1]) {
      questProblem = questData.questsTable[i].problem;
      questResultant = questData.questsTable[i].resultantQuest;
    }
  }

  for (let i = 1 ; i <= Object.keys(questData.questsSourcesTable).length ; i++) {
    if (questSourceRoll >= questData.questsSourcesTable[i].value[0] && questSourceRoll <= questData.questsSourcesTable[i].value[1]) {
      questSource = questData.questsSourcesTable[i].source;
    }
  }

  return {
    questProblem: questProblem,
    questResultant: questResultant,
    questSource: questSource
  }
}

const readQuest = function(questsData, questsDone) {
  let quest = {
    "questProblem": "",
    "questResultant": "",
    "questSource": "",
    "questDone": false
  };
  let quests = [];

  for (let i = 0 ; i < questsData.length ; i++) {
    if (questsData[i].questDone === questsDone) {
      quest = {
        "questProblem": "",
        "questResultant": "",
        "questSource": "",
        "questDone": false
      };
      
      quest.questProblem = questsData[i].questProblem;
      quest.questResultant = questsData[i].questResultant;
      quest.questSource = questsData[i].questSource;
      quest.questDone = questsData[i].questDone;

      quests.push(quest);
    }
  }

  return {
    quests: quests
  }
}

const updateQuest = function(questsData, updatedQuest) {
  for (let i = 0 ; i < questsData.length ; i++) {
    if (questsData[i].questProblem === updatedQuest) {
      questsData[i].questDone = true;
    }
  }

  return {
    questsData: questsData
  }
}

exports.createQuest = createQuest;
exports.readQuest = readQuest;
exports.updateQuest = updateQuest;