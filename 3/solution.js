const fs = require('fs');
const exec = require('child_process').execSync;

// start and end inclusive
function seq(start, end) {
  const numbers =  exec(`seq ${start} ${end}`).
        toString().
        split('\n');
  numbers.pop();
  return numbers.
    map(x => {
      const number = parseInt(x, 10);
      if (isNaN(number)) { throw new Error('not a number: ' + x); }
      return number
    });
}

class Positions {
  get lineName() {
    return this.lineNames[this.lineIndex];
  }
  
  constructor(lineNames) {
    this.recordedPositions = {};
    this.x = 0;
    this.y = 0;
    this.lineNames = lineNames;
    this.lineIndex = 0;
    this.distanceMoved = 0;
  }

  findIntersection() {
    const intersectionPoints = [];
    for (let [x, yObj] of Object.entries(this.recordedPositions)) {
      for (let [y, point] of Object.entries(yObj)) {
        if (Object.keys(point).length >= 2) {
          let [x, y] = Object.values(point)[0];
          if (!(x === 0 && y === 0)) {
            intersectionPoints.push(point);
          }
        }
      }
    }

    return intersectionPoints;
  }

  findShortestIntersection() {
    const intersectionPoints = this.findIntersection();

    const distances = intersectionPoints.map(point => {
      const distanceA = point['first'][2];
      const distanceB = point['second'][2];
      
      return distanceA + distanceB;
    });

    const shortestDistance = Math.min(...distances);

    const index = distances.indexOf(shortestDistance);

    const point = intersectionPoints[index];
    const distanceA = point['first'][2];
    const distanceB = point['second'][2];
    
    
    console.log(`Closest Intersection ${distanceA + distanceB}`);
  }

  findClosestIntersection() {
    const intersectionPoints = this.findIntersection();
    const distances = intersectionPoints.map(point => {
      let [x, y] = Object.values(point)[0];
      return Math.abs(x) + Math.abs(y);
    });

    const shortestDistance = Math.min(...distances);

    const index = distances.indexOf(shortestDistance);
    
    let [x, y] = Object.values(intersectionPoints[index])[0];
    
    console.log(`Closest Intersection ${Math.abs(x) + Math.abs(y)}`);
  }

  trace(instructions) {
    instructions.forEach((instruction) => {
      const [direction, ...digits] = instruction.split('');
      const distance = parseInt(digits.join(''), 10);
      
      switch (direction) {
      case 'R':
        this.moveRight(distance);
        break;
      case 'L':
        this.moveLeft(distance);
        break;
      case 'U':
        this.moveUp(distance);
        break;
      case 'D':
        this.moveDown(distance);
        break;
      }
      
      console.log(`position after movement: ${direction} ${distance}, ${this.x}, ${this.y}`);
    });
  }

  moveUp(distance) {
    seq(this.y + 1, this.y + distance).forEach((i) => {
      this.recordPosition(this.x, i);
    });
    
    this.y += distance;
  }

  moveDown(distance) {
    seq(this.y - 1, this.y - distance).forEach((i) => {
      this.recordPosition(this.x, i);
    });

    this.y -=  distance;
  }

  moveRight(distance) {
    seq(this.x + 1, this.x + distance).forEach((i) => {
      this.recordPosition(i, this.y);
    });

    this.x += distance;
  }

  moveLeft(distance) {
    seq(this.x -1, this.x - distance).forEach((i) => {
      this.recordPosition(i, this.y);
    });

    this.x -= distance;
  }

  recordPosition(x, y) {
    this.distanceMoved += 1;
    
    if (this.recordedPositions[x] === undefined) {
      this.recordedPositions[x] = { [y]: { [this.lineName]: [x, y, this.distanceMoved] } };
    } else {
      if (this.recordedPositions[x][y] == undefined) {
        this.recordedPositions[x][y] = { [this.lineName]: [x, y, this.distanceMoved] };
      } else {
        // if already passed
        if (this.recordedPositions[x][y][this.lineName]) {
          
        } else {
          this.recordedPositions[x][y][this.lineName] = [x, y, this.distanceMoved];
        }
      }
    }
  }

  resetPosition() {
    this.x = 0;
    this.y = 0;
    this.lineIndex += 1;
    this.distanceMoved = 0;
  }
}

function run(input) {
  const lines = input.split('\n');
  const positions = new Positions(['first', 'second']);

  positions.trace(lines[0].split(','));
  positions.resetPosition();
  positions.trace(lines[1].split(','));
  // positions.findClosestIntersection();
  positions.findShortestIntersection();
}

fs.readFile('./input', 'utf-8', (err, data) => {
  run(data);
});
