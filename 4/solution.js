const fs = require('fs');

class PasswordFinder {
  constructor(input) {
    const [start, end] = input.split('-');
    
    this.start = start;
    this.end = end;
    this.validPasswords = [];
  }

  run() {
    for (var i = this.start; i <= this.end; i++) {
      const number = i;
      const numberAsString = number.toString();
      const listOfDigits = numberAsString.split('').map(x => parseInt(x, 10));

      if (this.isSixDigits(numberAsString) && this.doubleDigitIncreasing(numberAsString)) {
        this.validPasswords.push(number);
      }
    }

    console.log('count is ' + this.validPasswords.length);
  }

  isSixDigits(numberAsString) {
    return numberAsString.length === 6;
  }

  doubleDigitIncreasing(numberAsString) {
    let allIncreasing = true;
    
    const groupedDigits = numberAsString.split('').reduce((accum, digit) => {
      const [last] = accum.slice(-1);
      
      if (last === undefined) {
        accum.push([digit]);
      } else {
        if (last[0] === digit) {
          last.push(digit);
        } else {
          accum.push([digit]);
        }
      }

      if (allIncreasing && last) {
        allIncreasing = last[0] <= digit;
      }
      
      return accum;
    }, []);

    const doubleDigits = groupedDigits.reduce((accum, digits) => accum || digits.length === 2, false);
    
    return allIncreasing && doubleDigits;
  }
}


fs.readFile('./input', 'utf-8', (err, data) => {
  
  // true
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('112233'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('122333'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('111122'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('222448'));

  // false
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('221333'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('110044'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('223450'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('123789'));
  // console.log((new PasswordFinder(data)).doubleDigitIncreasing('111111'));
  
  (new PasswordFinder(data)).run();
});
