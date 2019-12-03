const fs = require('fs');

const costFunction = (cost) => { return Math.floor(cost / 3) - 2; };

function fuelCost(moduleMass) {
  let marginalCost = costFunction(moduleMass);
  let fuelSum = 0;
  while (marginalCost > 0) {
    fuelSum += marginalCost;
    marginalCost = costFunction(marginalCost);

    if (marginalCost <= 0) { break; }
  }

  return fuelSum;
}

const contents = fs.readFileSync('./input', 'utf-8');

const data = contents.split('\n').map(x => parseInt(x.trim(), 10));

console.log(fuelCost(data[0]));

console.log(data.map(fuelCost).reduce((x,y) => x + y, 0))

