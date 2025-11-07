const fs = require('fs');

// Read the file
const filePath = 'src/app/[locale]/nitimala/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix all malformed escaped quotes in className attributes
content = content.replace(/className=\\"([^"]*)\\">/g, 'className="$1">');
content = content.replace(/className=\\"([^"]*)\\"/g, 'className="$1"');

// Fix malformed JSX attributes with escaped quotes
content = content.replace(/(\w+)=\\"([^"]*)\\"/g, '$1="$2"');

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed malformed quotes in', filePath);