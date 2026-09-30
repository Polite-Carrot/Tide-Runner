const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'docs/vendor/unity-ads.js');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(require.resolve('@politecarrot/capacitor-unity-ads'), target);
console.log('Shared Unity Ads JavaScript copied into docs/vendor');
