import { GalaxyWidget } from 'pax-imperia-js/script/widgets/galaxy/galaxyWidget';
import { SpaceViewWidget } from 'pax-imperia-js/script/widgets/space_view/spaceViewWidget';
import { GameSettings } from 'pax-imperia-js/script/gameSettings';
import { Galaxy } from 'pax-imperia-js/script/models/galaxy';

const initGameData = () => {
  //////////
  // Main //
  //////////

  let galaxy = new Galaxy(GameSettings.galaxyWidget);

  let gameData = {
    galaxy
  };

  let systemsData = JSON.parse(JSON.stringify(galaxy.systems));

  const data = {
    galaxyWidget :
      new GalaxyWidget(GameSettings.galaxyWidget, gameData),
    spaceViewWidget:
      new SpaceViewWidget(GameSettings.spaceViewWidget, {}, systemsData)
  };
  return data;
};

export { initGameData };
