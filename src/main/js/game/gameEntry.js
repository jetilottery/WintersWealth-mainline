define(function(require) {
  require('polyfill');
  const app = require('skbJet/componentManchester/standardIW/app');
  const layout = require('skbJet/componentManchester/standardIW/layout');
  const config = require('skbJet/componentManchester/standardIW/gameConfig');
  const audio = require('skbJet/componentManchester/standardIW/audio');
  const textStyles = require('skbJet/componentManchester/standardIW/textStyles');
  const gameSize = require('skbJet/componentManchester/standardIW/gameSize');
  const gameFlow = require('skbJet/componentManchester/standardIW/gameFlow');
  const documents = require('skbJet/componentManchester/standardIW/documents');
  const scenarioData = require('skbJet/componentManchester/standardIW/scenarioData');

  const prizetableTransform = require('game/prizetableTransform');
  const scenarioTransform = require('game/scenarioTransform');
  const SKBeInstant = require("skbJet/component/SKBeInstant/SKBeInstant");
  const prizestructureTransform = require("game/prizestructureTransform");

  const templateLayout = require('game/template/layout');
  const gameLayout = require('game/custom/layout');
  const templateConfig = require('game/template/config');
  const gameConfig = require('game/custom/config');
  const templateAudioMap = require('game/template/audioMap');
  const gameAudioMap = require('game/custom/audioMap');
  const templateTextStyles = require('game/template/textStyles');
  const gameTextStyles = require('game/custom/textStyles');
  const dimensions = require('game/template/dimensions');

  // Require StandardIW component templates
  let buttonBar = require('skbJet/componentManchester/standardIW/ui/buttonBar/template');
  let autoPlayButton = require('skbJet/componentManchester/standardIW/ui/autoPlayButton/template');
  let resultPlaques = require('skbJet/componentManchester/standardIW/ui/resultPlaques/template');
  let howToPlay = require('skbJet/componentManchester/standardIW/ui/howToPlay/template');
  let errorPlaque = require('skbJet/componentManchester/standardIW/ui/errorPlaque/template');
  let ticketSelectBar = require('skbJet/componentManchester/standardIW/ui/ticketSelectBar/template');
  let footer = require('skbJet/componentManchester/standardIW/ui/footer/template');
  let networkActivity = require('skbJet/componentManchester/standardIW/ui/networkActivity/template');

  // Require all game specific components that need initializing
  const winningNumbers = require('game/components/winningNumbers');
  const playerNumbers = require('game/components/playerNumbers');
  const bonusCard = require('game/components/bonusCard');
  require('game/components/winUpTo');

  // Require game side state handlers.
  require('game/ticketAcquired');
  require('game/startReveal');
  require('game/endReveal');
  require('game/resultScreen');
  require('game/gameReset');
  require('game/error');

  // Register template configs and game overrides
  layout.register(templateLayout, gameLayout);
  audio.register(templateAudioMap, gameAudioMap);
  config.register(templateConfig, gameConfig);
  textStyles.register(templateTextStyles, gameTextStyles);

  // Set game size for portrait and landscape
  gameSize.set(dimensions);

  function gameInit() {
    // Register a transform function that can be used to turn the prizetable data into structured
    // data representing the prizetables in the paytable document
    if (SKBeInstant.isWLA()){
      documents.registerPrizestructureTransform(prizestructureTransform);
    }
    else{
      documents.registerPrizetableTransform(prizetableTransform);
    }   

    // Register a transform function that can be used to turn the scenario string into useable data
    scenarioData.registerTransform(scenarioTransform);

    // Init StandardIW UI templates
    howToPlay = howToPlay();
    resultPlaques = resultPlaques();
    errorPlaque = errorPlaque();
    buttonBar = buttonBar();
    autoPlayButton = autoPlayButton();
    ticketSelectBar = ticketSelectBar();
    footer = footer();
    networkActivity = networkActivity();

    // Inititialize all game components
    winningNumbers.init();
    playerNumbers.init();
    bonusCard.init();

    // Add everything to the stage
    app.stage.addChild(
      layout.container,
      resultPlaques,
      buttonBar,
      autoPlayButton,
      ticketSelectBar,
      howToPlay,
      footer,
      errorPlaque,
      networkActivity
    );

    // Once everything is initialized continue to next state
    gameFlow.next();
  }

  gameFlow.handle(gameInit, 'GAME_INIT');
});
