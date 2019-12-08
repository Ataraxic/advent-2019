const fs = require('fs');

function runner(input) {
  const lines = input.split('\n').map(line => line.split(')'));
  const orbits = {};
  
  lines.filter(x => x.length == 2).forEach(([origin, orbitedBy], i) => {
    if (!orbits[origin]) { orbits[origin] = {}; };
    if (!orbits[orbitedBy]) { orbits[orbitedBy] = {}; };

    orbits[origin][orbitedBy] = orbits[orbitedBy];
  });

  let youPath = findPathTo(orbits['COM'], 'YOU', '');
  let sanPath = findPathTo(orbits['COM'], 'SAN', '');

  
  youPath = youPath.split(')');
  sanPath = sanPath.split(')');

  const lastCommonNode = findLastCommonNode(youPath, sanPath);
  console.log(findPathTo(orbits[lastCommonNode], 'YOU', '').split(')').length + findPathTo(orbits[lastCommonNode], 'SAN', '').split(')').length)
}

function findLastCommonNode(youPath, sanPath) {
  for (var i=0; i < youPath.length; i++){
    if (youPath[i] !== sanPath[i]) {
      return youPath[i - 1];
    }
  }
};

function count() {
  orbits['COM'].distanceFromCom = 0;
  calcDistanceFromCom(orbits['COM'], 0);

  let count = 0;
  for (var orbit in orbits) {
    count += orbits[orbit].distanceFromCom;
  }
  
  console.log('count: ', count);
}

function calcDistanceFromCom(point, distance) {
  point.distanceFromCom = distance;
  
  for (var keys in point) {
    calcDistanceFromCom(point[keys], distance + 1);
  }
}

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

function findPathTo(startingPoint, destinationName, path) {
  return flatten(Object.keys(startingPoint).map(key => {
    if (key === destinationName)  {
      return path;
    } else {
      const pathName = !!path ? [path, key] .join(')') : key;
      return findPathTo(startingPoint[key], destinationName, pathName);
    }
  })).filter(x => !!x)[0];
}

fs.readFile('./input', 'utf-8', (err, data) => {
  runner(data);
});
