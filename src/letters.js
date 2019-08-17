const CHARACTER_POINTS = {
  a: '02 06 35 28',
  b: '02 06 34 42 48 68',
  c: '02 06 68',
  d: '01 06 15 58 68',
  e: '02 06 35 68',
  f: '02 06 35',
  g: '02 06 68 85 54',
  h: '06 35 28',
  i: '02 17 68',
  j: '02 17 67',
  k: '16 34 42 48',
  l: '06 68',
  m: '06 04 42 28',
  n: '06 08 82',
  o: '02 06 68 82',
  p: '02 06 35 52',
  q: '02 06 68 82 84',
  r: '02 06 35 25 58',
  s: '02 03 35 58 68',
  t: '02 17',
  u: '06 68 82',
  v: '03 37 75 52',
  w: '06 64 48 82',
  x: '08 62',
  y: '04 42 47',
  z: '02 26 68',

  0: '02 06 68 82 26',
  1: '17',
  2: '02 25 53 36 68',
  3: '02 28 35 68',
  4: '03 35 28',
  5: '02 03 35 58 68',
  6: '02 06 35 68 85',
  7: '02 26',
  8: '02 06 68 82 35',
  9: '02 03 35 28',

  '+': '35 17'

};
const POINTS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0], [0,  0], [1,  0],
  [-1,  1], [0,  1], [1,  1]
];


function symbolPairToLine(pair) {
  const [a, b] = pair;
  const [aX, aY] = POINTS[a];
  const [bX, bY] = POINTS[b];
  return {
    a: {x: aX, y: aY},
    b: {x: bX, y: bY}
  };
}

function characterStringToLines(charString) {
  return charString.split(' ').map(symbolPairToLine);
}

const CHARACTER_LINE_DATA = Object.keys(CHARACTER_POINTS).reduce((lineData, char) => {
  const characterString = CHARACTER_POINTS[char];
  lineData[char] = characterStringToLines(characterString);

  return lineData;
}, {});

export function drawCharacter(ctx, char, x, y, size, center = true) {
  if (!CHARACTER_LINE_DATA[char]) {
    return;
  }

  char = char.toLowerCase();
  const lineData = CHARACTER_LINE_DATA[char];
  const offset = center ? 0 : size;
  lineData.forEach(({a, b}) => {
    ctx.beginPath();
    ctx.moveTo(a.x * size + x + offset, a.y * size + y);
    ctx.lineTo(b.x * size + x + offset, b.y * size + y);
    ctx.stroke();
  })
}

const FONT_SPACING = 2.5;
export function drawString(ctx, string, x, y, size) {

  string.toLowerCase().split('').forEach((char, idx) => {
    drawCharacter(ctx, char, x + (idx * size * FONT_SPACING), y, size, false);
  });
}
