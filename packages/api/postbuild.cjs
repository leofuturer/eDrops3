const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, './dist/models');
const files = fs.readdirSync(dir);
for (const file of files) {
  let fileContents = fs.readFileSync(path.join(dir, file), 'utf8');
  fileContents = fileContents.replace(/import.*?from '@loopback\/repository';\n/g, '');
  fileContents = fileContents.replace(/extends Entity/g, '');
  fs.writeFileSync(path.join(dir, file), fileContents);
}