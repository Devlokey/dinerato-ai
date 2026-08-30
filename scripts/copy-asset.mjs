import fs from 'fs';
import path from 'path';

const srcLogo = './public/dinerato-logo-original.png';
const targetDir = './src/assets';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(srcLogo, path.join(targetDir, 'dinerato-logo.png'));
console.log('Copied logo to src/assets/dinerato-logo.png');
