const fs = require('fs');
const chalk = require('chalk');

const width = 25;
const height = 6;
const lineLength = 25 * 6;

function runner(input) {
  let pointer = 0;
  const increment = width * height;
  const layers = [];
  while (pointer < input.length) {
    layers.push(input.slice(pointer, pointer + increment).split(''));
    pointer += increment;
  }

  const finalImage = transpose(layers).map(x => {
    return x.find(y => y !== '2');
  });
  printImage(finalImage);
}

function printImage(image) {
  let black = chalk.black('N');
  let white = chalk.white('1');
  
  for (var i = 0; i < image.length; i++) {
    if (image[i] == 0) {
      let black = chalk.bgBlack('i');
      process.stdout.write(black);
    } else if (image[i] == 1) {
      let white = chalk.bgWhite('i');
      process.stdout.write(white);
    }

    
    if ((i + 1) % width === 0) {
      process.stdout.write('\n')
    }
  }
}

function transpose(layers) {
  const imageLayers = [];
  
  for (var position = 0; position < lineLength; position++) {
    const arr = [];
    
    for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      arr.push(layers[layerIndex][position]);
    }
    
    imageLayers.push(arr);
  }

  return imageLayers;
}

function layerWithMostZeroes(layers) {
  return layers.map(layer => {
    return layer.reduce((accum, digit) => {
      if (!accum[digit]) {
        accum[digit] = 0;
      }

      accum[digit] += 1;

      return accum;
    }, {});
  }).reduce((a, b) => {
    return (a[0] || 0) < (b[0] || 0) ? a : b;
  });
}

fs.readFile('./input', 'utf-8', (err, data) => {
  runner(data.trim());
});
