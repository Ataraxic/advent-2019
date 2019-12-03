const fs = require('fs');

function opOne(integers, index) {
  const [ first, second, third ] = integers.slice(index + 1, index + 4);
  
  integers[third] = integers[first] + integers[second];
}

function opTwo(integers, index) {
  const [ first, second, third ] = integers.slice(index + 1, index + 4);
  
  integers[third] = integers[first] * integers[second];
}

function run(input) {
  const originalCodes = input.split(',').map(x => parseInt(x, 10));
  
  for (var i = 0; i < 100; i++) {
    for (var k = 0; k < 100; k++) {
      let codes = originalCodes.slice();

      // special case
      codes[1] = i;
      codes[2] = k;

      let index = 0;
      let number = codes[index];
      
      while (number !== 99) {
        if (number == 1) {
          opOne(codes, index);
          index += 4;
        } else if (number == 2) {
          opTwo(codes, index);
          index += 4;
        }
        number = codes[index];
      }

      if (codes[0] == 19690720) {
        return 100 * i + k;
      }
    }
  }

  throw new Error("didn't find it");
}

fs.readFile('./input', 'utf-8', (err, data) => {
  console.log(run(data));
});

