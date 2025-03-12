define(require => {
  const Timeline = require('com/gsap/TimelineLite');
  const gameConfig = require('skbJet/componentManchester/standardIW/gameConfig');
  const displayList = require('skbJet/componentManchester/standardIW/displayList');

  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const bonusCard = require('game/components/bonusCard');

  let revealAllTimeline;

  function start() {
    const revealWinning = winningNumbers.revealAll();
    const revealPlayer = playerNumbers.revealAll();
    const revealBonus = bonusCard.autoReveal();

    revealAllTimeline = new Timeline();

    // disable all interaction at the parent container level
    displayList.bonusCard.interactiveChildren = false;
    displayList.playerNumbers.interactiveChildren = false;
    displayList.winningNumbers.interactiveChildren = false;

    // Start with the winning numbers
    revealAllTimeline.add(
      new Timeline({ tweens: revealWinning, stagger: gameConfig.autoPlayWinningNumberInterval })
    );

    // Then the player numbers, with a delay between the winning and player numbers
    revealAllTimeline.add(
      new Timeline({ tweens: revealPlayer, stagger: gameConfig.autoPlayPlayerNumberInterval }),
      revealWinning.length > 0 && revealPlayer.length > 0
        ? `+=${gameConfig.autoPlayPlayerNumberDelay}`
        : '+=0'
    );

    // End with the bonus item
    revealAllTimeline.add(revealBonus);

    return revealAllTimeline;
  }

  function stop() {
    // re-enable all interaction at the parent container level
    displayList.bonusCard.interactiveChildren = true;
    displayList.playerNumbers.interactiveChildren = true;
    displayList.winningNumbers.interactiveChildren = true;
    // kill the revealAll timeline if active
    if (revealAllTimeline) {
      revealAllTimeline.kill();
      revealAllTimeline = undefined;
    }
  }

  return {
    start,
    stop,
  };
});
