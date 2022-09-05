const dice = require('../dice');
const eventData = require('../../data/event');
const adventureCrafter = require('./adventureCrafter');

const eventCheck = function(charactersList, plotsList, currentPlot) {
  let eventFocusName = "";
  let eventFocusDescription = "";
  let eventFocusNeed = "";

  let eventFocusRoll = dice.die(100);
  let eventActionRoll = dice.die(100);
  let eventSubjectRoll = dice.die(100);

  let eventAction = eventData.eventAction[eventActionRoll].name;
  let eventSubject = eventData.eventSubject[eventSubjectRoll].name;

  for (let i = 1; i <= Object.keys(eventData.eventFocus).length; i++) {
    if (eventFocusRoll >= eventData.eventFocus[i].value[0] && eventFocusRoll <= eventData.eventFocus[i].value[1]) {
      eventFocusName = eventData.eventFocus[i].name;
      eventFocusDescription = eventData.eventFocus[i].description;

      if (eventData.eventFocus[i].need === "PNJ") {
        eventFocusNeed = adventureCrafter.characterRandom(charactersList, false).name;
      } else if (eventData.eventFocus[i].need === "Joueur") {
        eventFocusNeed = adventureCrafter.characterRandom(charactersList, true).name;
      } else if (eventData.eventFocus[i].need === "Intrigue") {
        eventFocusNeed = adventureCrafter.plotRandom(plotsList, true, false, "").name;
      }
    }
  }

  return {
    eventFocusName: eventFocusName,
    eventFocusDescription: eventFocusDescription,
    eventAction: eventAction,
    eventSubject: eventSubject,
    eventFocusNeed: eventFocusNeed
  }
}

module.exports = eventCheck;