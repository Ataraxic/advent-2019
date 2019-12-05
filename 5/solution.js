const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(str) {
  return new Promise(resolve => readline.question(str, resolve));
}

class IntegerArray extends Array {
  get(index, mode) {
    if (mode === 0) {
      return this[this[index]];
    } else {
      return this[index];
    }
  }
}

const spacesToMove = [null,4,4,2,2,3,3,4,4];

function codeParser(code) {
  const digits = code.toString().split('');

  const opcode = parseInt(digits.slice(-2).join(''), 10);

  const modes = digits.slice(0, digits.length - 2).reverse().join('');
  
  var modes1 = modes.
      padEnd(spacesToMove[opcode] - 1, '0');
  
  var modes2 = modes1.
        split('').
        map(x => parseInt(x, 10));
  
  return [opcode, modes2];
}

async function runner(input) {
  const originalCodes = input.split(',').map(x => parseInt(x, 10));

  let first, second, third;
  let codes = IntegerArray.from(originalCodes.slice());
  let requestedInput;
  let incremented = false;
  let index = 0;
  
  let [opcode, modes] = codeParser(codes.get(index, 1));
  
  while (opcode !== 99) {
    incremented = false;
   
    if (opcode === 1) {
      [first, second] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });

      codes[codes[index + 3]] = first + second;
    } else if (opcode === 2) {
      [first, second] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });
      codes[codes[index + 3]] = first * second;
    } else if (opcode === 3) {
      requestedInput = await question('Input pls\n');
      codes[codes[index + 1]] = parseInt(requestedInput, 10);
    } else if (opcode === 4) {
      let value = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });
      
      console.log('the value is: ', value[0]);
    } else if (opcode === 5) {
      [first, second] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });

      if (first !== 0) {
        incremented = true;
        index = second;
      }
    } else if (opcode === 6) {
      [first, second] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });
      
      if (first === 0) {
        incremented = true;
        index = second;
      }
    } else if (opcode === 7) {
      [first, second] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });

      codes[codes[index + 3]] = first < second ? 1 : 0;
    } else if (opcode === 8) {
      [first, second, third] = modes.map((mode, i) => {
        return codes.get(index + i + 1, mode);
      });

      codes[codes[index + 3]] = first === second ? 1 : 0;
    } else {
      throw new Error('opcode invalid: ', opcode);
    }

    if (!incremented && spacesToMove[opcode] !== null) {
      index += spacesToMove[opcode];
    }
   
    [opcode, modes] = codeParser(codes.get(index, 1));
  }
};

// runner('3,9,8,9,10,9,4,9,99,-1,8');
// runner('3,9,7,9,10,9,4,9,99,-1,8')
// runner('3,3,1108,-1,8,3,4,3,99');
// runner('3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99');

fs.readFile('./input', 'utf-8', (err, data) => {
  runner(data);
});

