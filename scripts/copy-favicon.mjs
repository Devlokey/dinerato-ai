import fs from 'fs';
import path from 'path';

const srcFavicon = 'C:/Users/Amal/.gemini/antigravity/brain/a606e07b-4a7c-44de-be52-c39101b479cf/.user_uploaded/media_1788054328651.png';
const targetDir = './public';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.copyFileSync(srcFavicon, path.join(targetDir, 'favicon.png'));
fs.copyFileSync(srcFavicon, path.join(targetDir, 'dinerato-icon.png'));
console.log('Copied favicon to public/favicon.png and public/dinerato-icon.png');
