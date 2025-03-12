define((require) => {
  const prizeData = require('skbJet/componentManchester/standardIW/prizeData');

  return function scenarioTransform(scenarioString) {
    // split the string into the three components; winning, instant and player numbers
    const [winningString, instantString, playerString] = scenarioString.split('|');

    // winning numbers are just a comma seperated list of numbers
    const winningNumbers = winningString.split(',').map(int => parseInt(int, 10));

    // instntWin is either 0 for no win or 1, 2, 3 for prizes IW1, IW2, IW3
    const instantWin = instantString === '0' ? 0 : prizeData.prizeTable['IW' + instantString];

    // player numbers are a list of key:value pairs describing a number and its associated prize
    const playerPairs = playerString.split(',');
    const playerNumbers = playerPairs.map((pair) => {
      const [number, prize] = pair.split(':');
      return [
        parseInt(number, 10),
        prizeData.prizeTable[prize]
      ];
    });

    return {
      winningNumbers,
      instantWin,
      playerNumbers,
    };
  };
});
