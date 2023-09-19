const fs = require('fs');

const INTS = '0123456789';

class Token {
  name;
  value;
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class IntLiteral extends Token {
  constructor(value) {
    super('INT', value);
  }
}

class IfLiteral extends Token {
  constructor(value) {
    super('IF', value);
  }
}

class GRTLiteral extends Token {
  constructor(value) {
    super('GRT', value);
  }
}

class CURLYOPN extends Token {
  constructor(value) {
    super('CURYOPN', value);
  }
}
class CURLYCLS extends Token {
  constructor(value) {
    super('CURYCLS', value);
  }
}

class PARENOPN extends Token {
  constructor(value) {
    super('PARENOPN', value);
  }
}
class PARENCLS extends Token {
  constructor(value) {
    super('PARENCLS', value);
  }
}
class PRINT extends Token {
  constructor(value) {
    super('PRINT', value);
  }
}

const fileContent = fs.readFileSync('f.z', {
  encoding: 'utf8',
});

class Tokenizer {
  str = '';
  idx = 0;
  char = '';
  tokens = [];
  constructor(str) {
    this.str = str;
    this.char = str[this.idx];
  }
  tokenize() {
    while (this.idx < this.str.length) {
      if (this.peek() === ' ') {
        this.next();
        continue;
      } else {
        if (this.peek() === 'i' && this.goto(this.idx + 2) === 'if') {
          if (this.charOf(this.idx + 2) === ' ') {
            this.tokens.push(new IfLiteral());
          } else {
            throw new Error('token is invalid if' + this.charOf(this.idx + 2));
          }
          this.next(2);
        }
        if (this.isInt(this.peek())) {
          let value = '';
          while (this.isInt(this.peek())) {
            value += this.char;
            this.next();
          }
          this.tokens.push(new IntLiteral(Number(value)));
        }
        if (this.peek() === '>') {
          this.tokens.push(new GRTLiteral('>'));
        }
        if (this.peek() === '{') {
          this.tokens.push(new CURLYOPN('{'));
        }
        if (this.peek() === '}') {
          this.tokens.push(new CURLYCLS('}'));
        }
        if (this.peek() === 'p' && this.goto(this.idx + 5) === 'print') {
          this.tokens.push(new PRINT('print'));
          this.next(5);
          while (this.peek() !== ')') {
            if (this.peek() === ' ') {
              this.next();
              continue;
            }
            if (this.peek() === '(') {
              this.tokens.push(new PARENOPN('('));
            }
            if (this.isInt(this.peek())) {
              let value = '';
              while (this.isInt(this.peek())) {
                value += this.char;
                this.next();
              }
              this.tokens.push(new IntLiteral(Number(value)));
            }
            if (this.peek() === ')') {
              this.tokens.push(new PARENCLS(')'));
              break;
            }
            this.next();
          }
        }
      }
      this.next();
    }
    return this.tokens;
  }
  goto(to) {
    return this.str.slice(this.idx, to);
  }
  peek() {
    return this.char;
  }
  isInt() {
    return INTS.includes(this.char);
  }
  nextChar() {
    return this.str(this.idx + 1);
  }
  isNextSpace() {
    return this.str[this.idx + 1] === ' ';
  }
  charOf(idx) {
    return this.str[idx];
  }
  next(incBy) {
    this.idx += incBy ?? 1;
    this.char = this.str[this.idx];
  }
}

const tokeniner = new Tokenizer(fileContent);
const tokens = tokeniner.tokenize();
console.log(tokens);
