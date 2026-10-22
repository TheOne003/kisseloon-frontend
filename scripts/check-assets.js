const fs = require('fs');
const path = require('path');

const roots = [
  'App.js',
  'index.js',
  'screens',
  'components',
  'constants',
  'services',
  'theme',
];
const files = [];

function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) files.push(p);
  }
}

for (const r of roots) {
  if (!fs.existsSync(r)) continue;
  if (fs.statSync(r).isDirectory()) walk(r);
  else files.push(r);
}

const re = /require\(\s*['"]([^'"]+)['"]\s*\)/g;
const missing = [];
let checked = 0;

for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  let m;
  while ((m = re.exec(t))) {
    const rel = m[1];
    if (!rel.startsWith('.') && !rel.startsWith('/')) continue;
    if (!/\.(png|jpe?g|webp|gif|mp4|ttf|otf|svg)$/i.test(rel)) continue;
    const abs = path.resolve(path.dirname(f), rel);
    checked += 1;
    if (!fs.existsSync(abs)) missing.push(`${f} -> ${rel}`);
  }
}

console.log(`asset requires checked: ${checked}`);
if (missing.length) {
  console.log('MISSING:');
  missing.forEach((x) => console.log(x));
  process.exit(1);
}
console.log('All asset requires resolve');
