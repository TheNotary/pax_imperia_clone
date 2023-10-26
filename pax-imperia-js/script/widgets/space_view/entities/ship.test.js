import { GameSettings } from "../../../gameSettings";
import { Galaxy } from "../../../models/galaxy";
import { Ship } from "./ship"

import { createMockPlanet, createMockPosition, createMockGameStateInterface } from "../../../../test_support/Factory";
import * as THREE from 'three';

const galaxyWidgetConfig = GameSettings.galaxyWidget;
const galaxy = Galaxy.generateFromConfig(galaxyWidgetConfig);

const deltaTime = 1/60;

// test('the update function returns actions when appropriate', () => {
//     const ship = new Ship();

//     const data = {};
//     const elapsedTime = 0;
//     const deltaTime = 1;
//     const system = {};
//     const galaxy = {};

//     ship.destinationEntity = {
//         type: 'wormhole',
//         id: 1,
//         name: 'wormhole',
//         object3d: {
//             position: { x: 0, y: 0, z: 0, distanceTo: () => 0 }
//         }
//     };
//     ship.object3d = {
//         position: { x: 100, y: 100, z: 0, distanceTo: () => 100 }
//     };

//     const actions = ship.update(elapsedTime, deltaTime, system, galaxy);

//     expect(actions.verb).toBe('discover');
// });

test('when a ship\'s update should have the ship jump a wormhold, it defines actions', async () => {

    // Make wormhole
    const wormhole = galaxy.systems[0].wormholes[0];
    wormhole.object3d = {
        position: createMockPosition({ x: 100, y: 100 })
    };

    // Make ship
    const ship = new Ship();
    ship.systemId = wormhole.fromId;
    ship.previousSystemId = wormhole.fromId;
    ship.destinationEntity = wormhole;
    ship.object3d = {
        position: createMockPosition({ x: 100, y: 100 })
    };
    ship.removeFromSystem = (e) => { };
    ship.removeObject3d = () => { };

    // Excercise the code
    await ship.handleWormholeJumping(deltaTime, galaxy);

    // Verify the results
    expect(ship.actions[0].verb).toBe('discover');
});

test("when a ship enroute to orbit reaches/ overshoots it's destinationEntity, it should release it's destination target, ending travel", async () => {
    // Set it up so it will overshoot it's destination
    const planet = createMockPlanet({ x: 2, y: 1, z: 1 });
    planet.object3d.scale.z = 0; // this ensures the destinationPoint isn't changed after calling recaluclateDestinationPoint
    const ship = new Ship();
    ship.object3d = {
        position: new THREE.Vector3(1, 1, 1),
        rotation: new THREE.Vector3(0, 0, 0),
        lookAt: () => { },
        rotateOnAxis: () => { },
    };
    ship.speed = 2;

    // Excercise the code

    ship.moveShip(planet.object3d, 'default');

    expect(ship.destinationEntity).toBe(planet); // just a quick implementation check :)

    ship.handleMovementTowardsDestination(deltaTime, galaxy);

    expect(ship.destinationEntity).toBe(null);
    expect(ship.object3d.position.x).toBe(planet.object3d.position.x);
    expect(ship.object3d.position.y).toBe(planet.object3d.position.y);
    expect(ship.object3d.position.z).toBe(planet.object3d.position.z);

    ship.handleOrbitingAnimation(deltaTime);

    expect(ship.orbitStartTime).toBe(deltaTime);
});


test("when a ship enroute to orbit a planet is updated, and it's not all the way there, then it's posiiton gets closer to the planet", async () => {
    // Set it up so it will overshoot it's destination
    const planet = createMockPlanet({ x: 2, y: 1, z: 1 });
    planet.object3d.scale.z = 0; // this ensures the destinationPoint isn't changed after calling recaluclateDestinationPoint
    const ship = new Ship();
    ship.object3d = {
        position: createMockPosition({ x: 1, y: 1, z: 1 }),
        rotation: new THREE.Vector3(0, 0, 0),
        lookAt: () => { },
    };
    ship.speed = 0.5;

    // Excercise the code

    ship.moveShip(planet.object3d, 'default');
    ship.handleMovementTowardsDestination(deltaTime, galaxy);

    expect(ship.destinationEntity).toBe(planet);
    expect(ship.object3d.position.x).toBe(1.5);
    expect(ship.object3d.position.y).toBe(1);
    expect(ship.object3d.position.z).toBe(1);
});

test("given a ship enroute to colonize, when it reaches it's destinationEntity, then it should colonize the planet", async () => {
    // Set it up so it will overshoot it's destination
    const ship = new Ship();
    ship.object3d = {
        position: createMockPosition({ x: 1, y: 1, z: 1 }),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: new THREE.Vector3(1, 1, 1),
        lookAt: () => { },
    };
    ship.speed = 1;
    ship.systemId = 0;
    ship.id = 0;

    // TODO: shouldn't need to hack this,
    // ship shouldn't need to know about spaceViewDomManager
    // unselect should be deferred to spriteFlipbook
    ship.unselect = () => { };

    // TODO: make creation of planets more beautiful
    const planet = createMockPlanet({ x: 1, y: 2, z: 1});
    planet.id = 3393;
    planet.systemId = 0;
    planet.object3d.scale.z = 0; // this ensures the destinationPoint isn't changed after calling recaluclateDestinationPoint

    // Prop up the galaxy and gameStateInterface because testing this is currently pretty elaborate
    const galaxy2 = Galaxy.generateFromConfig(galaxyWidgetConfig);


    const gameStateInterface = createMockGameStateInterface({ galaxy: galaxy2 });

    galaxy2.systems[0].planets.push(planet);
    galaxy2.systems[0].ships.push(ship);

    // Excercise the code
    ship.moveShip(planet.object3d, 'colonize');
    ship.handleMovementTowardsDestination(deltaTime, galaxy2);

    ship.handleColonizing(deltaTime, galaxy2);

    expect(ship.colonizeAnimationProgress).toBe(1/3);

    ship.handleColonizing(deltaTime, galaxy2);

    // TODO: I need to mitigate against the global window.spaceViewDomManager
    // It's really messy...
    ship.handleColonizing(deltaTime, galaxy2);
    ship.handleColonizing(deltaTime, galaxy2);

    gameStateInterface.performAction(ship.actions[0]);

    expect(planet.colony).toBeTruthy();

});
