const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const templatePath = path.join(root, 'templates', 'epic-cross-layout-toPrint-all.template.html');
const dataPath = path.join(root, 'data', 'EPIC_data.js');
const builds = [
  {
    side: 'front',
    label: 'Fronte',
    output: 'epic-cross-layout-toPrint-all.built.html'
  },
  {
    side: 'back',
    label: 'Retro',
    output: 'epic-cross-layout-toPrint-allback.built.html'
  }
];

function readDataObjectLiteral(jsPath) {
  const source = fs.readFileSync(jsPath, 'utf8');
  const prefix = 'var EPIC_DATA =';
  const start = source.indexOf(prefix);
  if (start === -1) {
    throw new Error('EPIC_DATA declaration not found in EPIC_data.js');
  }

  const afterPrefix = source.slice(start + prefix.length);
  const end = afterPrefix.lastIndexOf('};');
  if (end === -1) {
    throw new Error('Could not find end of EPIC_DATA object in EPIC_data.js');
  }

  return afterPrefix.slice(0, end + 1).trim();
}

const template = fs.readFileSync(templatePath, 'utf8');
const dataLiteral = readDataObjectLiteral(dataPath);

for (const placeholder of ['__EPIC_DATA__', '__PRINT_SIDE__', '__PRINT_SIDE_LABEL__']) {
  if (!template.includes(placeholder)) {
    throw new Error(`Template placeholder ${placeholder} not found`);
  }
}

for (const build of builds) {
  const built = template
    .replace('__EPIC_DATA__', dataLiteral)
    .replaceAll('__PRINT_SIDE__', build.side)
    .replaceAll('__PRINT_SIDE_LABEL__', build.label);

  const outputPath = path.join(root, 'built', build.output);
  fs.writeFileSync(outputPath, built, 'utf8');
  console.log(`Built ${path.basename(outputPath)} from ${path.basename(templatePath)}`);
}
