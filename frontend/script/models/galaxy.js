import { StarName } from './starName.js';
import { System } from './system.js';

export class Galaxy {

    constructor(canvasWidth, canvasHeight, systemCount = 100){
        this.systemCount = systemCount
        this.systems = this.generateSystems(canvasWidth, canvasHeight, systemCount);
        this.connections = this.generateConnections();
        console.log("Constructing galaxy");
    }
    
    generateConnections(){
        let connections = [];
        let connectedSystems = [];
        while (connectedSystems.length < this.systems.length){
            console.log("Looped");
            let minDist = Infinity;
            let minI;
            let minJ;
        
            // 1. Loop through all pairings of the systems to find the two closest systems
            for (let i = 0; i < this.systems.length - 1; i++) {
                for (let j = i + 1; j < this.systems.length; j++) {
                    // If this is our first connection, or if i is connected while j is not, or vice versa
                    // then we should see if they're a minimal distance from each other so that they can be
                    // connected.
                    if (        connections.length == 0 
                            || (connectedSystems.includes(i) && !connectedSystems.includes(j)) 
                            || (connectedSystems.includes(j) && !connectedSystems.includes(i)) ) {
                        let dist = (this.systems[i].x - this.systems[j].x)**2 + (this.systems[i].y - this.systems[j].y)**2;
                        if (dist < minDist) {
                            minDist = dist;
                            minI = i;
                            minJ = j;
                        };
                    };
                };
            };
            connections.push([minI,minJ])
            if (!connectedSystems.includes(minI)){
                connectedSystems.push(minI)
            }
            if (!connectedSystems.includes(minJ)){
                connectedSystems.push(minJ)
            }
        };
        return connections;
    }

    // parameters of galaxies:
    //   How many systems
    //   How close can they be to each other?
    //   How far can they be from each other?
    //   how linear/ branchy (connectivity) is everything?
    generateSystems(canvasWidth, canvasHeight, systemCount) {
        let systemRadius = 5;
        let systemBufferRadius = systemRadius * 6;
        let canvasBufferRadius = systemRadius * 3;
        let systems = [];
        let starName = new StarName();

        // Define systems with coordinates
        for (let i = 0; i < systemCount; i++){
            let point = this.generateSystemXY(canvasWidth, canvasHeight, canvasBufferRadius);
            let iter = 0
            // Try 10 times to find a system far enough away from existing systems
            while (!this.isValidDistance(systems, point, systemBufferRadius) && iter < 10) {
                point = this.generateSystemXY(canvasWidth, canvasHeight, canvasBufferRadius);
                iter = iter + 1;
                if (iter == 10){
                    console.log('Generating stars without buffer')
                }
            }
            let system = new System(i, point, starName.pick(), systemRadius);
            systems.push(system);
        }
        return systems;
    }

    generateSystemXY(canvasWidth, canvasHeight, canvasBufferRadius) {
        // Make sure that no systems are too close to the edge of the canvas
        let x = Math.round(Math.random() * (canvasWidth - canvasBufferRadius * 2) + canvasBufferRadius);
        let y = Math.round(Math.random() * (canvasHeight - canvasBufferRadius * 2) + canvasBufferRadius);
        return {x: x, y: y};
    }

    isValidDistance(systems, point, systemBufferRadius) {
        // Check the distance from the point to every system
        let isValid = systems.every( system => {
            let dist = Math.pow(Math.pow(system.x - point.x, 2) + Math.pow(system.y - point.y, 2), 0.5)
            if (dist < systemBufferRadius) {
                return false;
            } else {
                return true;
            }
        });
        return isValid;
    }
    
}
